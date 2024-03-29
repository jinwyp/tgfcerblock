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
      host : [{
        host : "107.172.219.43",
        port: "29858"
      }],
      ref  : "origin/master",
      repo : "git@github.com:jinwyp/tgfcerblock.git",
      path : "/www/wwwroot/tgfcer_nodejs",
      "pre-deploy": "git pull",
      "post-setup": "ls -lah && cd ./apiserver && npm install",
      "post-deploy" : "ls -lah && cd ./apiserver && pm2 startOrRestart ecosystem.config.js --env production"
    },
    production2 : {
      user : "root",
      host : [{
        host : "95.169.17.157",
        port: "28983"
      }],
      ref  : "origin/master",
      repo : "git@github.com:jinwyp/tgfcerblock.git",
      path : "/root/nodejs/tgfcer",
      "pre-deploy": "git pull",
      "post-setup": "ls -lah && cd ./apiserver && npm install",
      "post-deploy" : "ls -lah && cd ./apiserver && pm2 startOrRestart ecosystem.config.js --env production"
    },
    dev : {
      user : "root",
      host : [{
        host : "95.169.17.157",
        port: "28983"
      }],
      ref  : "origin/master",
      repo : "git@github.com:jinwyp/tgfcerblock.git",
      path : "/root/nodejs/tgfcerdev",
      "post-setup": "ls -lah",
      "post-deploy" : "cd ./apiserver && npm install && pm2 startOrRestart ecosystem.config.js"
    }
  }
}

