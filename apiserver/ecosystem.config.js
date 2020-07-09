/**
 * This is a sample configuration file for PM2
 */

/**
 * Here we declare the apps that must be managed by PM2
 * All options are listed here:
 * https://github.com/Unitech/PM2/blob/master/ADVANCED_README.md#json-app-declaration
 *
 */


/**
 * PM2 help you to deploy apps over your servers
 * For more help go to :
 * https://github.com/Unitech/PM2/blob/master/ADVANCED_README.md#deployment-pm2--090
 */


module.exports = {

  apps : [

    // First application
    {
      name      : "tgfcer",
      script    : "./server.js",
      env: {
        COMMON_VARIABLE: "true",
        DEBUG : "koa2-user:*",
        NODE_ENV: "development"
      },

      env_production : {
        DEBUG : "koa2-user:*",
        NODE_ENV: "production"
      }
    }

  ],



  deploy : {
    production : {
      user : "root",
      host : "95.169.17.157",
      ref  : "origin/master",
      repo : "git@github.com:jinwyp/tgfcerblock.git",
      path : "/root/nodejs"
    },
    dev : {
      user : "root",
      host : "95.169.17.157",
      ref  : "origin/master",
      repo : "git@github.com:jinwyp/tgfcerblock.git",
      path : "/root/nodejs/development"
    }
  }
}
