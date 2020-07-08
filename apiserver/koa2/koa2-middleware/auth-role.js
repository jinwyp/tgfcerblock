/**
 * Created by jinwyp on 4/20/17.
 */


const koaJwt = require('koa-jwt')

const UserService     = require('../../app-user/service/user/userService')
const UserRoleService = require('../../app-user/service/user/userRoleService')


/**
 * 验证用户角色权限
 *
 *
 *
 */

function authRoleMiddleware(permission, options) {


    return async function (ctx, next) {

        UserRoleService.checkUserPermission(ctx.state.user, permission)

        return next()

    }
}


module.exports = authRoleMiddleware

