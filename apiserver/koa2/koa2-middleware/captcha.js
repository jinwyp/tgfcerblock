/**
 * Created by jin on 8/18/17.
 */

const moment = require('moment')
const captchapng = require('captchapng2');

const mathUtil = require('../../koa2/common-libs/math')
const SMS = require('../../koa2/koa2-libs/sms/alicloud/sms')

const UserService = require('../../app-user/service/user/userService')
const MCaptcha = require('../../app-user/service/user/model/captcha')



const ImageCaptchaExpireMinutes = 8
const SMSCaptchaExpireMinutes = 10
const SMSSendFrequency = 90

const SendType = {
    image : 'image',
    sms : 'sms',
    email : 'email'
}

exports.captchaSendType = SendType;

/**
 * 发送图片验证码
 *
 * 参考链接 http://blog.csdn.net/clementad/article/details/48788361
 *
 */
exports.getCaptchaImage = function (captchaType) {
    return async function (ctx, next) {

        let rand = mathUtil.getRandomInt(1000, 9999)
        let png = new captchapng(80, 36, rand); // width,height, numeric captcha

        const captcha = {
            visitorId : ctx.visitor.visitorId,
            sendType: SendType.image,
            type: captchaType,
            code: rand,
            isUsed : false,
            isUsedTimes : 0,
            isVerified : false,
            expireDate : moment().add(ImageCaptchaExpireMinutes, 'minutes')
        }

        const captchaData = await MCaptcha.findOneAndUpdate({visitorId: captcha.visitorId, type : captchaType, sendType : SendType.image}, captcha, { upsert : true} )

        ctx.type = 'image/png'
        ctx.body = png.getBuffer()

    }
}


exports.verifyCaptchaImage = function (captchaType) {
    return async function (ctx, next) {

        // console.log('ctx.visitor.visitorId: ', ctx.visitor.visitorId)

        GDataChecker.userCaptcha(ctx.request.body.captcha)

        const captchaData = await MCaptcha.findOne({visitorId: ctx.visitor.visitorId, type : captchaType, sendType : SendType.image, code: ctx.request.body.captcha } )

        ctx.body = { captchaWrong : true }

        if (captchaData) {

            if (!captchaData.isExpired()) {
                captchaData.isVerified = true
                const captchaUpdated = await captchaData.save()
                ctx.body = { captchaWrong : false }
            }
        }
    }
}



exports.verifyImageMiddleware = function(captchaType, reUsedTimes) {

    return async function (ctx, next) {
        reUsedTimes = reUsedTimes || 1

        // console.log('ctx.visitor.visitorId: ', ctx.visitor.visitorId)

        const captchaData = await MCaptcha.findOne({visitorId: ctx.visitor.visitorId, type : captchaType, sendType : SendType.image,  isVerified: true} )

        // console.log('captchaData: ', captchaData)

        if (captchaData) {

            if (reUsedTimes > captchaData.isUsedTimes ) {
                captchaData.isUsed = true
                captchaData.isUsedTimes++
                const captchaUpdated = await captchaData.save()
                return next()
            } else {
                GDataChecker.userCaptchaTooManyTimes(null)
            }

        } else {
            GDataChecker.userCaptchaUsed(captchaData)
        }

    }
}




/**
 * 发送短信验证码
 *
 * 手机验证短信设计与代码实现
 * 参考链接 https://my.oschina.net/wanglihui/blog/321101
 */
exports.getSMSCode = function (captchaType, options) {

    return async function (ctx, next) {

        options = options || { sessionUser : false, forgetPassword: false}

        let mobilePhoneNumber = ctx.params.mobilePhone

        if (options.sessionUser  && ctx.state.user) {
            mobilePhoneNumber = ctx.state.user.mobilePhone
        }

        GDataChecker.userMobile(mobilePhoneNumber)

        let newUser = await UserService.checkMobilePhoneExist(mobilePhoneNumber)

        if (options.sessionUser ) {
            // 登录后修改密码 
            GDataChecker.userMobilePhoneNotExist(newUser.mobilePhone)
        } else if ( options.forgetPassword) {

            // 未登录找回密码
            if (newUser) {
                GDataChecker.userMobilePhoneNotExist(newUser.mobilePhone)
            }
        } else {

            // 注册时手机号是否存在
            if (newUser) {
                GDataChecker.userMobilePhoneExist(newUser.mobilePhone)
            }
        }


        let code = mathUtil.getRandomInt(100000, 999999)

        const timeNow = new Date()

        const captcha = {
            visitorId : ctx.visitor.visitorId,
            sendType: SendType.sms,
            type: captchaType,
            code: code,
            mobilePhone: mobilePhoneNumber,
            isUsed : false,
            isVerified : false,
            expireDate : moment().add(SMSCaptchaExpireMinutes, 'minutes')
        }


        /**
         * 发送短信验证码 错误代码
         *
         * https://api.alidayu.com/doc2/apiDetail?apiId=25450
         *
         * isv.BUSINESS_LIMIT_CONTROL
         *
         * 短信验证码，使用同一个签名，对同一个手机号码发送短信验证码，支持1条/分钟，5条/小时，10条/天。一个手机号码通过阿里大于平台只能收到40条/天。
         * 短信通知，使用同一签名、同一模板，对同一手机号发送短信通知，允许每天50条（自然日）。
         *
         */

        const SMSCodeData = await MCaptcha.findOne({visitorId: captcha.visitorId, type : captchaType, sendType : SendType.sms, mobilePhone : mobilePhoneNumber, expireDate:{$gt: timeNow} } )

        if (SMSCodeData){

            // 查询90s内是否发送过，如果存在，需要等待 90-(已发送时间)s

            const timeUpdatedAt = moment(SMSCodeData.updatedAt).add(SMSSendFrequency, 'seconds')
            // console.log('SMSCodeData', moment().toDate(), SMSCodeData.updatedAt, moment().isBefore(timeUpdatedAt));

            if (moment().isBefore(timeUpdatedAt)) {
                GDataChecker.userSMSCodeFrequently(null)
            }
        }

        // 开发环境 不需要真实发短信, 注释掉了
        const [resultSMS, captchaResult] = await Promise.all([
            // SMS.sendCode(mobilePhoneNumber, code),
            MCaptcha.findOneAndUpdate({visitorId: captcha.visitorId, type: captchaType, sendType: SendType.sms, mobilePhone: mobilePhoneNumber}, captcha, { upsert : true} )
        ]);

        /* SMS send success:
            {
                Message: 'OK',
                RequestId: 'E5930616-0C37-4D4D-9E59-5D59D5B1CA5D',
                BizId: '976813272332093007^0',
                Code: 'OK'
            }
         */
        // console.log('SMS send success: ', resultSMS)
        // console.log('captcha save success: ', captchaResult)

        console.log('SMS Code: ', await MCaptcha.findOne({visitorId: captcha.visitorId, type : captchaType, sendType : SendType.sms, mobilePhone : mobilePhoneNumber} ))

        ctx.body = {smsSendSuccess : true}



    }
}


exports.verifySMSCode = function (captchaType, options) {
    return async function (ctx, next) {

        options = options || { sessionUser : false}

        let mobilePhoneNumber = ctx.request.body.mobilePhone

        if (options.sessionUser && ctx.state.user) {
            mobilePhoneNumber = ctx.state.user.mobilePhone
        }

        GDataChecker.userSMSCode(ctx.request.body.smsCode)
        GDataChecker.userMobile(mobilePhoneNumber)

        const SMSCodeData = await MCaptcha.findOne({visitorId: ctx.visitor.visitorId, type : captchaType, sendType : SendType.sms, code: ctx.request.body.smsCode , mobilePhone : mobilePhoneNumber} )

        ctx.body = { smsCodeWrong : true }

        // console.log('SMSCodeData: ', SMSCodeData)

        if (SMSCodeData) {

            if (!SMSCodeData.isExpired()) {
                SMSCodeData.isVerified = true
                const codeUpdated = await SMSCodeData.save()
                ctx.body = { smsCodeWrong : false }
            }
        }
    }
}


exports.verifySMSCodeMiddleware = function(captchaType, options) {

    return async function (ctx, next) {

        // console.log('ctx.visitor.visitorId: ', ctx.visitor.visitorId, ctx.request.body.mobilePhone, ctx.state.user.mobilePhone)

        options = options || { sessionUser : false}

        let mobilePhoneNumber = ctx.request.body.mobilePhone

        if (options.sessionUser && ctx.state.user) {
            mobilePhoneNumber = ctx.state.user.mobilePhone
        }

        const SMSCodeData = await MCaptcha.findOne({visitorId: ctx.visitor.visitorId, type: captchaType, sendType: SendType.sms, isUsed: false, isVerified: true, mobilePhone: mobilePhoneNumber} )

        console.log('SMSCodeData: ', SMSCodeData)

        if (SMSCodeData) {
            
            if (SMSCodeData.isExpired()) {
                GDataChecker.userSMSCodeExpired(SMSCodeData)
                
            } else {
                SMSCodeData.isUsed = true
                SMSCodeData.isUsedTimes++
                const SMScodeUpdated = await SMSCodeData.save()
                return next()
            }

        } else {
            GDataChecker.userSMSCodeUsed(SMSCodeData)
        }

    }
}
