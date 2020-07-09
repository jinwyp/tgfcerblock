/**
 * Created by JinWYP on 23/01/2017.
 */


const response_formatter = function(ctx){

    //如果有返回数据，将返回数据添加到data中
    if (ctx.body) {
        if (Array.isArray(ctx.body)){
            ctx.body = {
                success : true,
                error : null,
                meta : {
                    total : 0,
                    count : ctx.body.length,
                    pageSize : 0,
                    offset : 0,
                    pageNo : 0
                },
                data : ctx.body
            }

            if (ctx.meta && ctx.meta.total) {
                ctx.body.meta = {
                    total : ctx.meta.total,
                    totalPages : Math.ceil(ctx.meta.total / ctx.meta.pageSize),
                    count : ctx.body.length,
                    pageSize : ctx.meta.pageSize,
                    offset : ctx.meta.offset,
                    pageNo : ctx.meta.pageNo
                }
            }
        }else {
            ctx.body = {
                success : true,
                error   : null,
                meta    : null,
                data    : ctx.body
            }
        }

    }
}



const url_filter = function (pattern, options){

    return async (ctx, next) => {

        const matchedUrl = new RegExp(pattern);

        options = options || {isInclude : true}


        try {
            // 先去执行路由
            await next(); // wait until we execute the next function down the chain, then continue;

            // console.log('----------------------  RES Formatter  ------------------------------')

            // 通过正则的url进行格式化处理
            if(typeof pattern === 'undefined'){
                response_formatter(ctx);
            }else {

                if (options.isInclude){
                    if(pattern && matchedUrl.test(ctx.originalUrl)){
                        response_formatter(ctx);
                    }else{

                    }
                }else{

                    if(ctx.path.indexOf(pattern) === -1){

                    }else{
                        response_formatter(ctx);
                    }
                }

            }

        } catch (error) {
            // console.log('name:', error.name)
            // console.log('type:',error.type)
            // console.log('code:',error.code)
            // console.log('message:',error.message)
            // console.log('field:',error.field)
            // console.log('===== ===== error stack:',error.stack)

            let newErr = error;

            // Deal with Some extra error type. Such as 3rd party sms provider libs

            if (typeof error.type === 'undefined' ){

                if (error.name === 'UnauthorizedError'){
                    newErr = new GUnauthenticatedAccessError('token.tokenDecodeWrong', 'X-Access-Token');

                    /**
                     * Base on Module koa-jwt Error
                     * https://github.com/koajs/jwt
                     */
                    console.log('==: koa jwt error :== Extra type error.message:', error.message)
                    if (error.message && error.message !== 'Authentication Error'){
                        newErr.message = error.message;
                    }

                    /**
                     * Base on Module jsonwebtoken Error
                     * https://github.com/auth0/node-jsonwebtoken
                     */
                    if (error.message === 'jwt expired') {
                        newErr = new GUnauthenticatedAccessError('token.tokenExpired', 'X-Access-Token');
                    }

                    if (error.message === 'invalid signature') {
                        newErr = new GUnauthenticatedAccessError('token.tokenInvalidSignature', 'X-Access-Token');
                    }


                    if (error.message === 'User Unauthorized, token not found') {
                        newErr = new GUnauthenticatedAccessError('token.tokenNotFound', 'X-Access-Token');
                    }


                }else {
                    newErr = new GSystemError(500, error.message, error);
                }

                if (error && typeof error.stack !== 'undefined'){
                    newErr.stack = error.stack;
                }
            }


            ctx.body = {
                success : false,
                error : {
                    code: newErr.code,
                    message: newErr.message,
                    field: newErr.field,

                    type : newErr.type,
                    name : newErr.name,
                    codename : newErr.codename,
                    stack : newErr.stack,
                    status: newErr.status,

                    url : ctx.request.url

                },
                meta : null,
                data : null
            };


            //继续抛，让外层中间件处理日志
            throw newErr;
        }

    }
}





module.exports = url_filter;