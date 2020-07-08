const moment = require('moment')
const { createClient, decomposeAddress, addressParser } = require('mail-sc.js');
const jwt = require("jsonwebtoken");

const debug = require('debug')('koa2-user:email-send');


const UserService = require('../../app-user/service/user/userService')
const MCaptcha = require('../../app-user/service/user/model/captcha')
const captchaSendType = require('./captcha').captchaSendType;



const sendCloudOptions = {
    apiKey: GConfig.emailSendcloud.API_KEY,
    apiUser: GConfig.emailSendcloud.API_USER, 
};



const sendCloudClient = createClient(sendCloudOptions);



const EmailSendFrequency = 60
const EMAIL_TOKEN_EXPIRATION_SEC = 60 * 60 * 24 * GConfig.emailToken.expireDay;

const emailTemplate = {
    userChangeEmailVerify : 'user_change_email'
}



/**
 * 发送验证邮件
 *
 * 
 * 参考链接 https://my.oschina.net/wanglihui/blog/321101
 * 参考链接 https://segmentfault.com/a/1190000014522351
 */
exports.sendEmailCode = function (captchaType, options) {

    return async function (ctx, next) {
        
        let newEmail = ctx.request.body.newEmail
        let mobilePhoneNumber = ctx.state.user.mobilePhone
        
        GDataChecker.userEmail(newEmail)
        GDataChecker.userMobile(mobilePhoneNumber)

        let newUser = await UserService.checkEmailExist(newEmail)

        if (newUser) {
            GDataChecker.userEmailExist(newUser.email)
        }



        const payload = {
            _id: ctx.state.user._id,
            mobilePhone: mobilePhoneNumber,
            email: newEmail
        };

        const token  = jwt.sign(payload, GConfig.emailToken.secret, {
            expiresIn: EMAIL_TOKEN_EXPIRATION_SEC
        });


        const timeNow = new Date()

        const captcha = {
            visitorId : ctx.visitor.visitorId,
            sendType: captchaSendType.email,
            type: captchaType,
            token: token,
            email: newEmail,
            mobilePhone: mobilePhoneNumber,
            isUsed : false,
            isVerified : false,
            expireDate : moment().add(EMAIL_TOKEN_EXPIRATION_SEC, 'seconds')
        }



        const emailCaptcha = await MCaptcha.findOne({visitorId: captcha.visitorId, type : captchaType, sendType : captchaSendType.email, mobilePhone : mobilePhoneNumber, email: newEmail, expireDate:{$gt: timeNow} } )


        if (emailCaptcha){

            // 查询48小时内是否发送过，如果存在，需要等待 60-(已发送时间)s

            const timeUpdatedAt = moment(emailCaptcha.updatedAt).add(EmailSendFrequency, 'seconds')
            // console.log('EmailCodeData', moment().toDate(), emailCaptcha.updatedAt, moment().isBefore(timeUpdatedAt));

            if (moment().isBefore(timeUpdatedAt)) {
                GDataChecker.userEmailCaptchaFrequently(null)
            }
        }


        const message = {
            from: 'jscoolwebmaster@jscool.net',
            fromName: 'jscoolwebmaster',
            xsmtpapi: JSON.stringify({
                to: [newEmail],
                sub: {
                    "%username%": [encodeURIComponent(ctx.state.user.username)],
                    "%useremail%": [encodeURIComponent(newEmail)],
                    "%emailtoken%": [encodeURIComponent(token)]
                }
            }),
            templateInvokeName: emailTemplate.userChangeEmailVerify
        };

        const resultEmail = await sendCloudClient.delivery.sendTemplate(message);

        debug("Email send status: ", resultEmail.data)

        
        if (resultEmail.status === 200 && resultEmail.data.result && resultEmail.data.statusCode === 200) {
            const captchaResult = await MCaptcha.findOneAndUpdate({visitorId: captcha.visitorId, type: captchaType, sendType: captchaSendType.email, mobilePhone: mobilePhoneNumber, email: newEmail}, captcha, { upsert : true} );

            // console.log('captcha save success: ', captchaResult)
            ctx.body = {emailSendSuccess : true}
            
        } else {
            ctx.body = {emailSendSuccess : false, message: resultEmail.data.message}
        }

        
    }
}




exports.verifyEmailTokenMiddleware = function (captchaType, options) {
    
    return async function (ctx, next) {
        
        const email = decodeURIComponent(ctx.request.query.email)
        const emailToken = decodeURIComponent(ctx.request.query.emailtoken)

        
        options = options || {}

        GDataChecker.userEmail(email)


        const decodedToken = jwt.verify(emailToken, GConfig.emailToken.secret);
        
        console.log('email: ', email)
        console.log('decodeToken: ', decodedToken)
        
        const emailCodeData = await MCaptcha.findOne({visitorId: ctx.visitor.visitorId, type : captchaType, sendType : captchaSendType.email, isUsed: false, isVerified: false, mobilePhone: decodedToken.mobilePhone, email: email, token: emailToken} )

        console.log('emailCodeData: ', emailCodeData)

        if (emailCodeData) {
            
            if (emailCodeData.isExpired()) {
                GDataChecker.userEmailCaptchaExpired(null)
                
            } else {
                emailCodeData.isVerified = true
                
                emailCodeData.isUsed = true
                emailCodeData.isUsedTimes++
                const emailCodeDataUpdated = await emailCodeData.save()


                let newUser = await UserService.modifyEmail(ctx.state.user._id, emailCodeData.email)
                
                return next()
                
            }
            
        } else {
            GDataChecker.userEmailCaptchaUsed(emailCodeData)
        }
        
    }
}

