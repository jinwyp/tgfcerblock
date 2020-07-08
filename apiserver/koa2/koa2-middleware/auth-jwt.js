/**
 * Created by jinwyp on 4/20/17.
 */


const koaJwt = require('koa-jwt')

const UserService     = require('../../app-user/service/user/userService')
const UserRoleService = require('../../app-user/service/user/userRoleService')


/**
 *
 * https://github.com/koajs/jwt
 *
 * The resolution order for the token is the following. The first non-empty token resolved will be the one that is verified.
 *
 *
 * 1. opts.getToken function
 * 2. check the cookies (if opts.cookie is set)
 * 3. check the Authorization header for a bearer token
 *
 */
function authMiddleware(options) {

    return koaJwt({
        debug : true,
        secret : GConfig.authToken.secret,
        cookie : GConfig.authToken.fieldName,
        key : 'userToken',  // add token info to ctx.state.userToken
        isRevoked : async (ctx, decodeToken, token) => {

            ctx.state.user = await UserService.getUserInfoFromToken(decodeToken, ctx)

            // console.log('ctx.state: ', ctx.state)

            return false
        }
    })
}


module.exports = authMiddleware

