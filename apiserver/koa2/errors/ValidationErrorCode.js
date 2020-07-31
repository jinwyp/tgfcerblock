

const validationName = {
    user : {

        usernameDBCreateError : {code:1801, message:"DB Error,  username create error !", field:'username'},

        usernameRequired : {code:1001, message:"Field validation error,  username is required", field:'username'},
        passwordRequired : {code:1002, message:"Field validation error,  password is required", field:'password'},
        passwordNewRequired : {code:1003, message:"Field validation error,  new password is required", field:'newPassword'},
        emailRequired : {code:1004, message:"Field validation error, Email is required", field:'email'},
        mobileRequired : {code:1005, message:"Field validation error, mobile number is required", field:'mobilePhone'},
        captchaRequired :  {code:1007, message:"Field validation error, captcha is required", field:'captcha'},
        smsCodeRequired :  {code:1008, message:"Field validation error, sms code is required", field:'smsCode'},


        userIdWrong : {code:1010, message:"Field validation error,  user id length must be 24", field:'_id'},

        usernameWrong : {code:1011, message:"Field validation error,  username length must be 4-30, start with letter character", field:'username'},
        passwordWrong : {code:1012, message:"Field validation error,  password length must be 6-30", field:'password'},
        passwordNewWrong : {code:1013, message:"Field validation error,  new password length must be 6-30", field:'newPassword'},
        emailWrong : {code:1014, message:"Field validation error, Email format wrong", field:'email'},
        mobileWrong : {code:1015, message:"Field validation error, mobile number format wrong", field:'mobilePhone'},
        captchaWrong :  {code:1017, message:"Field validation error, captcha length must be 4-4 or captcha expired", field:'captcha'},
        smsCodeWrong :  {code:1018, message:"Field validation error, sms code length must be 6-6 or sms code expired", field:'smsCode'},



        linkExist : {code:1031, message:"Field validation error,  favorite link already exist", field:'threadId'},
        usernameExist : {code:1031, message:"Field validation error,  username already exist", field:'username'},
        emailExist : {code:1032, message:"Field validation error,  email already exist", field:'email'},
        mobileExist : {code:1033, message:"Field validation error, mobile phone number already exist", field:'mobilePhone'},
        mobileNotExist : {code:1034, message:"Field validation error, mobile phone number not exist", field:'mobilePhone'},
        weChatOpenIDExist : {code:1038, message:"Field validation error,  wechat OpenID already exist", field:'idWeChatOpenID'},

        linkNotFound :  {code:1040, message:"User Unauthorized, user's favorite link not found", field:'uuid'},
        userNotFound :  {code:1041, message:"User Unauthorized, user not found", field:'username'},
        passwordNotMatch :  {code:1042, message:"User Unauthorized, password not match", field:'password'},


        captchaUsed :  {code:1051, message:"Field validation error, captcha not found or already used", field:'captcha'},
        captchaTooManyTimes :  {code:1052, message:"Field validation error, image captcha used too many times", field:'captcha'},

        smsCodeFrequently :  {code:1054, message:"Field validation error, 90秒内只能发送一次短信验证码", field:'smsCode'},
        smsCodeUsed :  {code:1053, message:"Field validation error, sms code not found or already used", field:'smsCode'},
        smsCodeExpired :  {code:1059, message:"Field validation error, sms code expired", field:'smsCode'},

        emailCaptchaFrequently :  {code:1058, message:"Field validation error, 60秒内只能发送一次验证邮件", field:'emailToken'},
        emailCaptchaUsed :  {code:1057, message:"Field validation error, email captcha not found or already used", field:'emailToken'},
        emailCaptchaExpired :  {code:1059, message:"Field validation error, email captcha expired", field:'emailToken'},


        weChatJsCodeRequired : {code:1071, message:"Field validation error, wechat js_code is required", field:'code'},
        weChatEncryptedDataRequired : {code:1072, message:"Field validation error, wechat user encrypted info is required", field:'encryptedData'},
        weChatUserInfoIVRequired : {code:1073, message:"Field validation error, wechat encrypted info iv is required", field:'iv'},
        weChatUserSessionKeyRequired : {code:1074, message:"Field validation error, wechat user session key is required", field:'session_key'},
        weChatUserInfoSignatureRequired : {code:1075, message:"Field validation error, wechat user info signature is required", field:'signature'},
        weChatOpenIDRequired : {code:1076, message:"Field validation error, wechat OpenID is required", field:'idWeChatOpenID'},
        weChatUnionIDRequired : {code:1077, message:"Field validation error, wechat UnionID is required", field:'idWeChatUnionID'},


        weChatJsCodeWrong : {code:1081, message:"Field validation error, wechat js_code length must be 32", field:'code'},
        weChatEncryptedDataWrong : {code:1082, message:"Field validation error, wechat user encrypted info length must be 100+", field:'encryptedData'},
        weChatUserInfoIVWrong : {code:1082, message:"Field validation error, wechat user encrypted info iv length must be 24-24", field:'iv'},
        weChatUserSessionKeyWrong : {code:1083, message:"Field validation error, wechat user session key length must be 24-24", field:'session_key'},
        weChatUserInfoSignatureWrong : {code:1084, message:"Field validation error, wechat user info signature length must be 40-40", field:'signature'},
        weChatOpenIDWrong : {code:1085, message:"Field validation error, wechat OpenID length must be 28", field:'idWeChatOpenID'},
        weChatUnionIDWrong : {code:1086, message:"Field validation error, wechat UnionID length must be 29", field:'idWeChatUnionID'},





        addressIdWrong : {code:1111, message:"Field validation error,  user address id length must be 24", field:'_id'},
        addressRequired : {code:1112, message:"Field validation error,  user address is required, must be a object", field:'provinceId'},

        addressProvinceId : {code:1113, message:"Field validation error,  user address province Id is required and length must be 1-10", field:'provinceId'},
        addressProvince : {code:1114, message:"Field validation error,  user address province name is required and length must be 2-100", field:'province'},

        addressCityId : {code:1115, message:"Field validation error,  user address city Id is required and length must be 1-10", field:'cityId'},
        addressCity : {code:1116, message:"Field validation error,  user address city name is required and length must be 2-100", field:'city'},

        addressDistrictId : {code:1117, message:"Field validation error,  user address district Id is required and length must be 1-10", field:'districtId'},
        addressDistrict : {code:1118, message:"Field validation error,  user address district name is required and length must be 2-100", field:'district'},


        addressDetailAddress : {code:1121, message:"Field validation error,  user detailAddress is required and length must be 2-1000", field:'detailAddress'},
        addressContactPerson : {code:1122, message:"Field validation error,  user address contact person is required and length must be 2-100", field:'contactPerson'},
        addressContactPersonMobilePhone : {code:1123, message:"Field validation error,  user address contact person mobile phone format wrong", field:'contactPersonMobilePhone'},


        addressCodeName : {code:1126, message:"Field validation error, user address code name length must be 2-500", field:'addressCodeName'},
        addressPostalCode : {code:1127, message:"Field validation error, user address postal code length must be 2-60", field:'postalCode'},
        addressContactPersonFixedPhone : {code:1128, message:"Field validation error, user address contact person fixed phone length must be 2-40", field:'contactPersonFixedPhone'},
        addressContactPersonEmail : {code:1129, message:"Field validation error,  user address contact person email format wrong", field:'contactPersonEmail'},

    },

    token : {
        tokenRequired : {code:2001, message:"Field validation error,  accessToken is required", field:'accessToken'},
        tokenLengthWrong : {code:2002, message:"Field validation error,  accessToken length must be 20-100", field:'accessToken'},

        tokenNotFound : {code:2003, message:"User Unauthorized, token not found", field:'X-Access-Token'},
        userNotFound : {code:2005, message:"User Unauthorized, user not found", field:'X-Access-Token'},
        tokenDecodeWrong : {code:2007, message:"User Unauthorized, token wrong", field:'X-Access-Token'},
        tokenExpired : {code:2008, message:"User Unauthorized, token expired", field:'X-Access-Token'},
        tokenInvalidSignature : {code:2009, message:"User Unauthorized, token invalid signature", field:'X-Access-Token'}

    },


    pagination : {
        pageNo : {code:2801, message:'Field validation error, pageNo should be 1 - 99999999', field:'pageNo'},
        pageSize : {code:2802, message:'Field validation error, pageSize should be 1 - 99999999', field:'pageSize'}
    },




    userPermission : {
        create : {code:3001, message:"User role not authorized 'create' permission", field:'roles'},
        getOwn : {code:3002, message:"User role not authorized 'getOwn' permission", field:'roles'},
        update : {code:3003, message:"User role not authorized 'update' permission", field:'roles'},
        updatePassword : {code:3004, message:"User role not authorized 'updatePassword' permission", field:'roles'},
        delete : {code:3007, message:"User role not authorized 'delete' permission", field:'roles'},
        getList : {code:3008, message:"User role not authorized 'getList' permission", field:'roles'},

    },






    pay:{
        payPhone:{code:5500,message:'Field validation error, phone format wrong'}
    },
    order : {
        orderIdWrong : {code:5001, message:'Field validation error, orderId length should be 1 - 100'},
        deliveryAmountWrong : {code:5101, message:'Field validation error, deliveryAmount should be 1 - 999999999'},

        startDate : {code:5201, message:'Field validation error, start date wrong'},
        endDate : {code:5202, message:'Field validation error, end date wrong'},
        categoryType : {code:5204, message:'Field validation error, category type wrong'},
        searchText : {code:5205, message:'Field validation error, search text length should be 1 - 100'}
    },


    website : {
        websiteIdWrong : {code:7001, message:"Field validation error,  website id length must be 24", field:'websiteId'},
        webPageRequired : {code:7101, message:"Field validation error,  webPage is required, must be a object", field:'webPage'},

        webPageUrlWrong : {code:7102, message:"Field validation error,  web page url format wrong", field:'pageUrl'},
    },



    uploadFile : {
        picExist : {code:9501, message:'Field validation error, upload picture not found'},
    }
};



const getValidationErrorCode = function(propertyName){
    const propertyArray = propertyName.split('.')


    let result = {
        code : 400,
        message:'Field validation error.',
        field : 'Unknown_field'
    };

    if (propertyName){

        if (validationName[propertyArray[0]]){
            result = validationName[propertyArray[0]];

            for(let i = 1, l = propertyArray.length; i < l; i++){

                if (result[propertyArray[i]]){
                    result = result[propertyArray[i]];
                }else{
                    result = {
                        code : 400,
                        message:'Field validation error.',
                        field : 'Unknown_field'
                    };
                }
            }
        }
    }

    return result
};



module.exports = getValidationErrorCode;
