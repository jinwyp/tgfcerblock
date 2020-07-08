/**
 * Created by jin on 8/17/17.
 */

const { nanoid } = require('nanoid')

// const MVisitor = require('../../app-user/service/user/model/visitor')


function visitLoggerMiddleware (options) {

    const CONFIG = {
        key: GConfig.cookieName, /** (string) cookie key (default is koa:sess) */
        /** (number || 'session') maxAge in ms (default is 1 days) */
        /** 'session' will result in a cookie that expires when session/browser is closed */
        /** Warning: If a session cookie is stolen, this cookie will never expire */
        maxAge: GConfig.authToken.expireDay * 1000 * 3600 * 24,
        overwrite: true, /** (boolean) can overwrite or not (default true) */
        httpOnly: true, /** (boolean) httpOnly or not (default true) */
        signed: true, /** (boolean) signed or not (default true) */
        rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
        path: '/', /** a string indicating the path of the cookie (/ by default). **/
        secure: false, /** a boolean indicating whether the cookie is only to be sent over HTTPS (false by default for HTTP, true by default for HTTPS). **/
    };

    options = options || CONFIG

    if (!options.key) { options.key = CONFIG.key}
    if (!options.maxAge) { options.maxAge = CONFIG.maxAge}
    if (!options.overwrite) { options.overwrite = CONFIG.overwrite}
    if (!options.httpOnly) { options.httpOnly = CONFIG.httpOnly}
    if (!options.signed) { options.signed = CONFIG.signed}
    if (!options.rolling) { options.rolling = CONFIG.rolling}
    if (!options.path) { options.path = CONFIG.path}
    if (!options.secure) { options.secure = CONFIG.secure}


    return async function (ctx, next) {

        const visitorId = ctx.cookies.get(options.key , {signed : options.signed})


        const visitor = {
            visitorId: '',
            ipv4: ctx.ipv4 || '',
            ipv6: ctx.ipv6 || '',
            deviceType: ctx.userDevice || '',
            userAgent : ctx.header['user-agent']
        }

        if (ctx.userAgent) {
            visitor.browser = ctx.userAgent.browser
            visitor.browserVersion = ctx.userAgent.version

            visitor.OS = ctx.userAgent.platform
            visitor.OSVersion = ctx.userAgent.os

            visitor.isMobile = ctx.userAgent.isMobile
            visitor.isDesktop = ctx.userAgent.isDesktop
        }


        if (!visitorId) {

            const uuid = nanoid()
            visitor.visitorId = uuid

            ctx.cookies.set(options.key, uuid, options)

            // ctx.visitor = await MVisitor.create(visitor)

        }else {
            visitor.visitorId = visitorId
        }

        return next()
    }
}



module.exports = visitLoggerMiddleware
