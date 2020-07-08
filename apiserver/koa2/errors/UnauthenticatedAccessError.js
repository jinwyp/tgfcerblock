/**
 * Node Custom Error
 *
 * https://gist.github.com/justmoon/15511f92e5216fa2624b
 *
 * http://www.bennadel.com/blog/2828-creating-custom-error-objects-in-node-js-with-error-capturestacktrace.htm
 *
 * https://github.com/shutterstock/node-common-errors
 *
 * https://matoski.com/article/jwt-express-node-mongoose/
 *
 * https://www.joyent.com/developers/node/design/errors
 */


const validationErrorCode = require('./ValidationErrorCode');

/**
 * Custom Error For Unauthenticated Access Error
 *
 */
class UnauthenticatedAccessError extends Error{

    //构造方法
    constructor(error_name, error_field){
        super();

        this.type = "UserLevelOperationalError";
        this.name = "UnauthenticatedAccessError";
        this.status = 401;

        const vError = validationErrorCode(error_name);

        this.code = vError.code || 401;
        this.message = vError.message || "Unauthenticated Access Token";
        this.field = error_field || vError.field ;

    }
}



module.exports = UnauthenticatedAccessError;



