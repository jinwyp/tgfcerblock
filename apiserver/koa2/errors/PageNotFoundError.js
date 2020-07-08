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
class PageNotFoundError extends Error{

    //构造方法
    constructor(code, message){
        super();

        this.type = "UserLevelOperationalError";
        this.name = "PageNotFoundError";
        this.status = 404;

        this.code = code || 404;
        this.message = message || "Requested URL Not Found";

    }
}


module.exports = PageNotFoundError;