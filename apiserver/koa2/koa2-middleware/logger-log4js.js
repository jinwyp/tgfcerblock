/**
 * Created by JinWYP on 21/02/2017.
 */


'use strict'


const log4js = require('koa-log4')

log4js.configure(GConfig.log4jsConfig);


module.exports = {
    middleware : log4js.koaLogger(log4js.getLogger('responseLogger'), { level: 'auto' }),
    log4js : log4js,
    logger : log4js.getLogger('errorLogger')
}

