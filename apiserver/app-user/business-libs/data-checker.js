/**
 * Created by jinwyp on 4/14/17.
 */


const validator = require('validator')



function throw409(codeName, field) {
    field = field || ''
    throw (new GValidationError(codeName, field))
}


function throw401(codeName, field) {
    field = field || ''
    throw (new GUnauthenticatedAccessError(codeName, field))
}




let validation = {
    userDBCreate: function(err, field) {
        return throw409('user.usernameDBCreateError ' + (err && err.message || ''), field)
    },

    userId: function(userId, field) {
        if (!validator.isMongoId(userId.toString())) return throw409('user.userIdWrong', field)
    },
    userAddressId: function(id, field) {
        if (!validator.isMongoId(id.toString())) return throw409('user.addressIdWrong', field)
    },

    username: function(username, field) {
        if (!username) return throw409('user.usernameRequired', field)
        if (!validator.isLength(username, 1, 60)) return throw409('user.usernameWrong', field)
            // if (!validator.matches(username, /^[a-zA-Z][a-zA-Z0-9_]*$/))  return throw409('user.usernameWrong', field)
    },
    userPassword: function(password, field) {
        if (!password) return throw409('user.passwordRequired', field)
        if (!validator.isLength(password, 6, 30)) return throw409('user.passwordWrong', field)
    },
    userPasswordNew: function(password, field) {
        if (!password) return throw409('user.passwordNewRequired', field)
        if (!validator.isLength(password, 6, 30)) return throw409('user.passwordNewWrong', field)
    },
    userEmail: function(email, field) {
        if (!email) return throw409('user.emailRequired', field)
        if (!validator.isEmail(email)) return throw409('user.emailWrong', field)
    },
    userMobile: function(mobilePhone, field) {
        if (!mobilePhone) return throw409('user.mobileRequired', field)
        if (!validator.isMobilePhone(mobilePhone, 'zh-CN')) return throw409('user.mobileWrong', field)
    },

    userCaptcha: function(captcha, field) {
        if (!captcha) return throw409('user.captchaRequired', field)
        if (!validator.isLength(captcha, 4, 4)) return throw409('user.captchaWrong', field)
    },

    userSMSCode: function(smsCode, field) {
        if (!smsCode) return throw409('user.smsCodeRequired', field)
        if (!validator.isLength(smsCode, 6, 6)) return throw409('user.smsCodeWrong', field)
    },

    userCaptchaUsed: function(captcha, field) {
        if (!captcha) return throw409('user.captchaUsed', field)
        if (!validator.isLength(captcha, 4, 4)) return throw409('user.captchaUsed', field)
    },

    userCaptchaTooManyTimes: function(captcha, field) {
        if (!captcha) return throw409('user.captchaTooManyTimes', field)
        if (!validator.isLength(captcha, 4, 4)) return throw409('user.captchaTooManyTimes', field)
    },

    userSMSCodeFrequently: function(smsCode, field) {
        if (!smsCode) return throw409('user.smsCodeFrequently', field)
        if (!validator.isLength(smsCode, 6, 6)) return throw409('user.smsCodeFrequently', field)
    },
    userSMSCodeUsed: function(smsCode, field) {
        if (!smsCode) return throw409('user.smsCodeUsed', field)
        if (!validator.isLength(smsCode, 6, 6)) return throw409('user.smsCodeUsed', field)
    },
    userSMSCodeExpired: function(smsCode, field) {
        if (!smsCode) return throw409('user.smsCodeExpired', field)
        if (!validator.isLength(smsCode, 6, 6)) return throw409('user.smsCodeExpired', field)
    },



    userEmailCaptchaFrequently: function(emailToken, field) {
        if (!emailToken) return throw409('user.emailCaptchaFrequently', field)
        if (!validator.isLength(emailToken, 0, 500)) return throw409('user.emailCaptchaFrequently', field)
    },
    userEmailCaptchaUsed: function(emailToken, field) {
        if (!emailToken) return throw409('user.emailCaptchaUsed', field)
        if (!validator.isLength(emailToken, 0, 500)) return throw409('user.emailCaptchaUsed', field)
    },
    userEmailCaptchaExpired: function(emailToken, field) {
        if (!emailToken) return throw409('user.emailCaptchaExpired', field)
        if (!validator.isLength(emailToken, 0, 500)) return throw409('user.emailCaptchaExpired', field)
    },



    // SMScodeNotFound : function (code, next){
    //     if (!code) return throw409(code.user.SMSCodeNotFound.code, code.user.SMSCodeNotFound.message, code.user.SMSCodeNotFound.field)
    // },
    // SMScodeExpired : function (isExpired, next){
    //     if (isExpired) return throw409(code.user.SMSCodeExpired.code, code.user.SMSCodeExpired.message, code.user.SMSCodeExpired.field)
    // },


    userWeChatJsCode: function(js_code, field) {
        if (!js_code) return throw409('user.weChatJsCodeRequired', field)
        if (!validator.isLength(js_code, 32, 50)) return throw409('user.weChatJsCodeWrong', field)
    },
    userWeChatOpenID: function(openId, field) {
        if (!openId) return throw409('user.weChatOpenIDRequired', field)
        if (!validator.isLength(openId, 28, 30)) return throw409('user.weChatOpenIDWrong', field)
    },
    userWeChatUnionID: function(unionId, field) {
        if (!unionId) return throw409('user.weChatUnionIDRequired', field)
        if (!validator.isLength(unionId, 29, 30)) return throw409('user.weChatUnionIDWrong', field)
    },
    userWeChatEncryptedData: function(encryptedData, field) {
        if (!encryptedData) return throw409('user.weChatEncryptedDataRequired', field)
        if (!validator.isLength(encryptedData, 100, 1000)) return throw409('user.weChatEncryptedDataWrong', field)
    },
    userWeChatUserInfoIV: function(iv, field) {
        if (!iv) return throw409('user.weChatUserInfoIVRequired', field)
        if (!validator.isLength(iv, 24, 24)) return throw409('user.weChatUserInfoIVWrong', field)
    },
    userWeChatUserSessionKey: function(session_key, field) {
        if (!session_key) return throw409('user.weChatUserSessionKeyRequired', field)
        if (!validator.isLength(session_key, 24, 24)) return throw409('user.weChatUserSessionKeyWrong', field)
    },
    userWeChatUserInfoSignature: function(signature, field) {
        if (!signature) return throw409('user.weChatUserInfoSignatureRequired', field)
        if (!validator.isLength(signature, 40, 40)) return throw409('user.weChatUserInfoSignatureWrong', field)
    },


    linkExist: function(user, field) {
        if (user) return throw409('user.linkExist', field)
    },
    usernameExist: function(user, field) {
        if (user) return throw409('user.usernameExist', field)
    },
    userEmailExist: function(email, field) {
        if (email) return throw409('user.emailExist', field)
    },
    userMobilePhoneExist: function(mobilePhone, field) {
        if (mobilePhone) return throw409('user.mobileExist', field)
    },
    userMobilePhoneNotExist: function(mobilePhone, field) {
        if (!mobilePhone) return throw409('user.mobileNotExist', field)
        if (!validator.isMobilePhone(mobilePhone, 'zh-CN')) return throw409('user.mobileNotExist', field)
    },
    userWeChatOpenIDExist: function(user, field) {
        if (user) return throw409('user.weChatOpenIDExist', field)
    },



    userAddress: function(address, field) {

        if (!address) return throw409('user.addressRequired', field)
        if (!address.provinceId) return throw409('user.addressProvinceId', field)
        if (!address.province) return throw409('user.addressProvince', field)

        if (!address.cityId) return throw409('user.addressCityId', field)
        if (!address.city) return throw409('user.addressCity', field)

        if (!address.districtId) return throw409('user.addressDistrictId', field)
        if (!address.district) return throw409('user.addressDistrict', field)

        if (!address.detailAddress) return throw409('user.addressDistrict', field)
        if (!address.contactPerson) return throw409('user.addressContactPerson', field)
        if (!address.contactPersonMobilePhone) return throw409('user.addressContactPersonMobilePhone', field)



        if (!validator.isLength(address.provinceId.toString(), 1, 10)) return throw409('user.addressProvinceId', field)
        if (!validator.isLength(address.province, 2, 100)) return throw409('user.addressProvince', field)

        if (!validator.isLength(address.cityId.toString(), 1, 10)) return throw409('user.addressCityId', field)
        if (!validator.isLength(address.city, 2, 100)) return throw409('user.addressCity', field)

        if (!validator.isLength(address.districtId.toString(), 1, 10)) return throw409('user.addressDistrictId', field)
        if (!validator.isLength(address.district, 2, 100)) return throw409('user.addressDistrict', field)


        if (!validator.isLength(address.detailAddress, 2, 1000)) return throw409('user.addressDistrict', field)
        if (!validator.isLength(address.contactPerson, 2, 100)) return throw409('user.addressContactPerson', field)
        if (!validator.isMobilePhone(address.contactPersonMobilePhone, 'zh-CN')) return throw409('user.addressContactPersonMobilePhone', field)

    },

    userAddressCodeName: function(addressCodeName, field) {
        if (!validator.isLength(addressCodeName, 2, 500)) return throw409('user.addressCodeName', field)
    },
    userAddressPostalCode: function(postalCode, field) {
        if (!validator.isLength(postalCode, 2, 60)) return throw409('user.addressPostalCode', field)
    },
    userAddressContactPersonFixedPhone: function(contactPersonFixedPhone, field) {
        if (!validator.isLength(contactPersonFixedPhone, 2, 40)) return throw409('user.addressContactPersonFixedPhone', field)
    },
    userAddressContactPersonEmail: function(contactPersonEmail, field) {
        if (!validator.isEmail(contactPersonEmail)) return throw409('user.addressContactPersonEmail', field)
    },

    linkNotFound: function(link, field) {
        if (!link) return throw409('user.linkNotFound', field)
    },
    userNotFound: function(user, field) {
        if (!user) return throw409('user.userNotFound', field)
    },

    loginUserNotFound: function(user, field) {
        if (!user) return throw409('user.userNotFound', field)
    },

    loginUserUnauthorized: function(isPasswordMatch, field) {
        if (!isPasswordMatch) return throw409('user.passwordNotMatch', field)
    },


    token: function(token, field) {
        if (!token) return throw409('token.tokenRequired', field)
        if (!validator.isLength(token, 20, 100)) return throw409('token.tokenLengthWrong', field)

        if (token.indexOf('jin') === -1) {
            return throw409('token.tokenDecodeWrong', field)
        }
    },

    tokenNotFound: function(token, field) {
        if (!token) return throw401('token.tokenNotFound', field)
    },

    tokenUserNotFound: function(user, field) {
        if (!user) return throw401('token.userNotFound', field)
    },

    tokenDecodeWrong: function(token, field) {
        if (token) return throw401('token.tokenDecodeWrong', field)
    },

    tokenExpired: function(tokenIsExpired, field) {
        if (tokenIsExpired) return throw401('token.tokenExpired', field)
    },



    pagination: function(pagination, field) {
        if (!validator.isLength(pagination.pageNo.toString(), 1, 10)) return throw409('pagination.pageNo', field)
        if (!validator.isInt(pagination.pageNo.toString(), { min: 1, max: 99999999 })) return throw409('pagination.pageNo', field)
        if (!validator.isLength(pagination.pageSize.toString(), 1, 10)) return throw409('pagination.pageSize', field)
        if (!validator.isInt(pagination.pageSize.toString(), { min: 1, max: 99999999 })) return throw409('pagination.pageSize', field)
    },








    websiteId: function(id, field) {
        if (!id) return throw409('website.websiteIdWrong', field)
        if (!validator.isMongoId(id.toString())) return throw409('website.websiteIdWrong', field)
    },

    webPage: function(webPage, field) {
        if (!webPage) return throw409('website.webPageRequired', field)
        if (!validator.isURL(webPage.pageUrl)) return throw409('website.webPageUrlWrong', field)
    }


}



module.exports = validation