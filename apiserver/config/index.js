/**
 * Created by JinWYP on 22/01/2017.
 *
 * 扩展配置文件路径 配置文件名分别为
 * development.js 开发环境
 * testing.js 测试环境
 * staging.js 线上 staging 环境
 * production.js 线上 生产环境
 *
 */



"use strict";

const defaultConfig = require('./default.js');
const env = process.env.NODE_ENV || 'development';
const currentConfig = require('./' + env);

let config = Object.assign({env : env}, defaultConfig, currentConfig)


const log4jsConfig = require('./log4js-config')(config.pathLogs);

config.log4jsConfig = log4jsConfig


// 创建log的根目录'logs'
GDirUtil.mkdirSync(config.pathLogs)

// 创建数据库文件目录
GDirUtil.mkdirSync(config.pathDB)

//根据不同的logType创建不同的文件目录
for(var i = 0, len = log4jsConfig.appenders.length; i < len; i++){
    if(log4jsConfig.appenders[i].path){
        GDirUtil.mkdirSync(log4jsConfig.baseLogPath + log4jsConfig.appenders[i].path);
    }
}




module.exports = config;


