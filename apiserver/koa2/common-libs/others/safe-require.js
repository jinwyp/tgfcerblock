const fs = require('fs')
const debug = require('debug')('koa2-user:utils');


module.exports = function safe_require (path) {
    var file_path

    if(/\.js$/.test(path) === false) {
        file_path = path + '.js'
    }

    if (fs.existsSync(file_path) == true) {
        debug('safe_require path:' + path + ' exist')
        return require(path)
    } else {
        debug('safe_require path:' + path + ' is not exist')
    }
}