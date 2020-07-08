/**
 * Koa2 logger middleware
 * Demo for how to write a Koa2 middleware
 */


async function logger (ctx, next) {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
}



module.exports = logger

