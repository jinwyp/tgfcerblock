/**
 * log4js 配置文件
 *
 * 日志等级由低到高
 * ALL TRACE DEBUG INFO WARN ERROR FATAL OFF.
 *
 * 关于log4js的appenders的配置说明
 * https://github.com/nomiddlename/log4js-node/wiki/Appenders
 * https://github.com/tough1985/hello-koa2/blob/master/config/log_config.js
 */

const path = require('path');

//日志根目录
let baseLogPath = path.resolve(__dirname, '../../../logs')


//错误日志目录
const errorPath = "/error";

//错误日志文件名
const errorFileName = "error";

//错误日志输出完整路径
let errorLogPath = baseLogPath + errorPath + "/" + errorFileName;
// const errorLogPath = path.resolve(__dirname, "../logs/error/error");



//响应日志目录
const responsePath = "/response";

//响应日志文件名
const responseFileName = "response";

//响应日志输出完整路径
let responseLogPath = baseLogPath + responsePath + "/" + responseFileName;
// var responseLogPath = path.resolve(__dirname, "../logs/response/response");


// [2023-12-14T23:37:46.007] [ERROR] responseLogger - 104.248.130.34 - - "GET /Temporary_Listen_Addresses HTTP/1.0" 404 - "" "Mozilla/5.0 zgrab/0.x"

module.exports = function(pathLog){
    if (pathLog) {
        baseLogPath = pathLog
    }

    errorLogPath = baseLogPath + errorPath + "/" + errorFileName;
    responseLogPath = baseLogPath + responsePath + "/" + responseFileName;


    return {
        "appenders"   : {
            //错误日志
            "errorLogger" : {
                "category"             : "errorLogger",             //logger名称
                "type"                 : "dateFile",                   //日志类型
                "filename"             : errorLogPath,             //日志输出位置
                "alwaysIncludePattern" : true,          //是否总是有后缀名
                "pattern"              : "-yyyy-MM-dd.log",      //后缀，每天创建一个新的日志文件
                "path"                 : errorPath                     //自定义属性，错误日志的根目录
            },
            //响应日志
            "responseLogger" : {
                "category"             : "responseLogger",
                "type"                 : "dateFile",
                "filename"             : responseLogPath,
                "alwaysIncludePattern" : true,
                "pattern"              : "-yyyy-MM-dd.log",
                "path"                 : responsePath
            }
        },
        "categories": {
            "error": { "appenders": ['errorLogger'], level: 'error' },
            "response": { "appenders": ['responseLogger'], level: 'ALL' },
            "default": { "appenders": ['errorLogger'], level: 'error' }
        },
        "baseLogPath" : baseLogPath                  //logs根目录
    }
}