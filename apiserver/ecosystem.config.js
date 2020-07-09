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
        NODE_ENV: "development",
        DEBUG : "koa2-user:*"
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
      path : "/root/nodejs/production",
      "post-deploy" : "pm2 startOrRestart ecosystem.config.js --env production"
    },
    dev : {
      user : "node",
      host : "212.83.163.1",
      ref  : "origin/master",
      repo : "git@github.com:repo.git",
      path : "/var/www/development",
      "post-deploy" : "pm2 startOrRestart ecosystem.config.js --env dev",
      env  : {
        NODE_ENV: "dev"
      }
    }
  }
}

