
// Koa application is now a class and requires the new operator.

require('./global-variable');


const util            = require('util');
const path            = require('path');
const Koa             = require('koa');
const logger          = require('koa-logger');
const XResponseTime   = require('koa-response-time');
const koaStaticServer = require('koa-static');
const ejs             = require('koa-ejs');
const router          = require('koa-router')();
const bodyParser      = require('koa-bodyparser');
const { userAgent }   = require('koa-useragent');
const cors            = require('@koa/cors');
const helmet          = require('koa-helmet')

const debug           = require('debug')('koa2-user:server');


const app               = new Koa();
const log4js            = require('./koa2/koa2-middleware/logger-log4js');
const errorHandler      = require('./koa2/koa2-middleware/error-handler');
const responseFormatter = require('./koa2/koa2-middleware/response-formater');
const ejsHelper         = require('./koa2/koa2-middleware/ejs-helper');
const userDevice        = require('./koa2/koa2-middleware/user-device');
const userIP            = require('./koa2/koa2-middleware/ip-address');
const visitor           = require('./koa2/koa2-middleware/visit-logger');




debug("Node Config: ", util.inspect(GConfig, {showHidden: false, depth: null}))



app.keys = [GConfig.cookieSecret];


app.use(errorHandler(app, {env : GConfig.env}));     // 全局错误处理


app.use(log4js.middleware)
app.use(logger())     // 记录所用方式与时间
app.use(helmet())
app.use(XResponseTime())     // 设置Header
app.use(bodyParser())     // POST请求 body 解析
app.use(cors())     // 跨域资源共享 CORS
app.use(userAgent)     //请求Header 的 user agent 信息
app.use(userDevice())   //根据 Header 的 user agent 信息 获得设备名称
app.use(userIP())      // 获取ipv4和ipv6地址
app.use(visitor())     // 获取visitor UUID


// 静态文件夹
const staticFilePath = path.join(__dirname, './public');
app.use(koaStaticServer(staticFilePath, {
    maxage : 1000 * 60 * 60 * 24 * 365,
    hidden : false, // 默认不返回隐藏文件
    gzip : false
}))

// 设置渲染引擎
ejs(app, {
    root: GConfig.pathViewTemplate,
    layout: false,
    viewExt: 'ejs',
    cache: false,
    debug: false
})

app.use(ejsHelper());

app.use(responseFormatter(/api/, {isInclude:true}));




// Start Router 路由
const apiRoutes = require('./app-user/routes/api/apiv1');
const webRoutes = require('./app-user/routes/website/page-route');


router.use('/api', apiRoutes.routes(), apiRoutes.allowedMethods());
router.use('/web', webRoutes.routes(), webRoutes.allowedMethods());

router.redirect('/', '/web/tgfcer')

app.use(router.routes(), router.allowedMethods());



// Start listening on specified port
app.listen(GConfig.port, () => {
    debug("----- Server Koa 2.0 listening on port", GConfig.port);
});

// Start the app with "node --harmony-async-await" flag, and go to http://localhost:3000



module.exports = app;

