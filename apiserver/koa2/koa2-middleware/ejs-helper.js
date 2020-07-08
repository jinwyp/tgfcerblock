/**
 * Created by jinwyp on 4/12/17.
 */




function ejsHelper (options) {

    return async function (ctx, next) {
        ctx.state = ctx.state || {};
        ctx.state.timeNow = new Date();
        ctx.state.version = '1.0.0';

        ctx.state.ip = ctx.ip;

        if (ctx.ipv4)  ctx.state.ipv4 = ctx.ipv4
        if (ctx.ipv6)  ctx.state.ipv6 = ctx.ipv6


        ctx.state.page = {
            title : '404 Not Found !',
            url : ctx.request.url
        }

        ctx.state.staticPath = '/static';

        ctx.state.user = null

        ctx.state.ngShow = function (flag){
            if (!flag){
                return ' style="display:none;" '
            }
        };

        return next();
    }
}



module.exports = ejsHelper