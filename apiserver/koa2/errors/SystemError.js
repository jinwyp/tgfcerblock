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




/**
 * Custom Error For System Error
 *
 */
class SystemError extends Error{

    //构造方法
    constructor(code, message, error){
        super();

        this.type = "SystemLevelOperationalError";
        this.name = "SystemError";
        this.status = 500;
        
        this.code = code || 500;
        this.message = message || "System Operational Error";


        if(typeof error !== 'undefined' && error) {
            this.codename = error.code || 'Common System Errors';
            this.inner = error;
        }

    }
}



module.exports = SystemError;