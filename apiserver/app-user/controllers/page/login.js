/**
 * Created by jin on 8/2/17.
 */


exports.index = async function pageIndex(ctx, next) {


    const users = [
        {name : 'Dead Horse'},
        {name : 'Jack'},
        {name : 'Tom'}
    ];

    const user = null
    await ctx.render('web/index', { page : {title : 'Homepage !'}, template: 'login' });
}





exports.login = async function pageLogin(ctx, next) {
    await ctx.render('web/login', { page : {title : '登陆页面 !'}, template: 'login'});
}


exports.register = async function pageRegister(ctx, next) {
    await ctx.render('web/register', { page : {title : '注册页面 !'}, template: 'registration' });
}





