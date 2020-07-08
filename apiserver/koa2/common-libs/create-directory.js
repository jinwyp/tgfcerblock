/**
 * Created by JinWYP on 21/02/2017.
 */


'use strict'

const debug = require('debug')('koa2-user:utils');

const fs = require('fs')
const path = require('path')

const PATH_SEPARATOR = path.normalize("/");


/**
 * 判断目录是否存在
 *
 */
function isDirExistsSync (dirPath) {
    try {
        return fs.statSync(dirPath).isDirectory();
    } catch (e) {
        if (e.code === 'ENOENT') {
            return false;
        } else {
            throw e;
        }
    }
}


/**
 * 判断文件是否存在
 *
 */
function isFileExistsSync(filePath) {
    try {
        return fs.statSync(filePath).isFile();
    } catch (e) {
        if (e.code === 'ENOENT') {
            return false;
        } else {
            throw e;
        }
    }
}


/**
 * 创建目录,如果该目录包括子目录,则无法创建
 *
 */
function mkdirSync(path) {
    try {
        fs.mkdirSync(path);
    } catch(e) {
        if ( e.code !== 'EEXIST' ) throw e;
    }
}


/**
 * 创建目录
 *
 * https://github.com/moajs/moa2/blob/v2/init.js
 */
function createDirectory (path) {
    var isExist = fs.existsSync(path)

    if (isExist !== true) {
        debug('Path is not exist, create folder:' + path)
        fs.mkdirSync(path)
    } else {
        debug('Path is exist, no operation!')
    }
}


/**
 * 创建目录,如果该目录包括子目录,则自动创建所有子目录
 *
 */
function mkdirpSync(pathStr) {
    var pathArray = path.normalize(pathStr).split(PATH_SEPARATOR);
    var resolvedPath = pathArray[0];

    pathArray.forEach(function (name) {
        if (!name || name.substr(-1, 1) === ":") return;
        resolvedPath += PATH_SEPARATOR + name;
        var stat;

        try {
            stat = fs.statSync(resolvedPath);
        } catch (e) {
            if (e.code === 'ENOENT') {
                fs.mkdirSync(resolvedPath);
            }

            // var fd;
            // try {
            //     fd = fs.openSync(resolvedPath, 'w', 438); // 0666
            // } catch(e) {
            //     fs.chmodSync(resolvedPath, 438);
            //     fd = fs.openSync(resolvedPath, 'w', 438);
            // }
            // if (fd) {
            //     fs.closeSync(fd);
            // }
        }
        if (stat && stat.isFile()){
            debug(pathStr + ' is a file!')
            throw new Error(pathStr + 'is a file')
        }
    });
}






module.exports = {
    isDirExistsSync : isDirExistsSync,
    isFileExistsSync : isFileExistsSync,
    mkdirSync : mkdirSync,
    mkdirpSync : mkdirpSync,
    createDirectory : createDirectory
}