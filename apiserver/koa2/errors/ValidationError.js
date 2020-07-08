/**
 * Created by JinWYP on 20/02/2017.
 */

const validationErrorCode = require('./ValidationErrorCode');

/**
 * Custom Error For Validation Error
 *
 */
class ValidationError extends Error{

    //构造方法
    constructor(error_name, error_field){
        super();

        const vError = validationErrorCode(error_name);

        this.type = "UserLevelOperationalError";
        this.name = "ValidationError";
        this.status = 400;


        this.code = vError.code || 400;
        this.message = vError.message || "Field Validation Error";
        this.field = error_field || vError.field ;
    }
}



module.exports = ValidationError;