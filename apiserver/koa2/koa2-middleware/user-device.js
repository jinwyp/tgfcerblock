/**
 * Created by jinwyp on 4/19/17.
 */


const userDeviceType = {
    desktop : 'desktop', // desktop pc or linux
    mac : 'mac',  // Mac and MacBook
    iPad : 'ipad',
    tablet : 'tablet',  // tablet except iPad
    phone : 'phone',
    tv : 'tv',
    car : 'car',
    console : 'console', // game console
    bot : 'bot'
}

function getUserDeviceMiddleware(options) {

    return async function (ctx, next) {

        let device = userDeviceType.desktop

        if (ctx.userAgent){

            if (ctx.userAgent.isMobile) device = userDeviceType.phone
            if (ctx.userAgent.isTablet) device = userDeviceType.tablet

            if (ctx.userAgent.isMac) device = userDeviceType.mac
            if (ctx.userAgent.isiPad) device = userDeviceType.iPad

            if (ctx.userAgent.isSmartTV) device = userDeviceType.tv
            if (ctx.userAgent.isBot) device = userDeviceType.bot

            ctx.userDevice = device

        }else{

            if (ctx.header['user-agent']){


            }else{
                // No user agent.
                // https://github.com/rguerreiro/express-device/blob/master/lib/device.js

                if (ctx.header['cloudfront-is-mobile-viewer'] === 'true') device = userDeviceType.phone;
                if (ctx.header['cloudfront-is-tablet-viewer'] === 'true') device = userDeviceType.tablet;
                if (ctx.header['cloudfront-is-desktop-viewer'] === 'true') device = userDeviceType.desktop;
            }

        }

        return next();
    }
}



module.exports = getUserDeviceMiddleware;

