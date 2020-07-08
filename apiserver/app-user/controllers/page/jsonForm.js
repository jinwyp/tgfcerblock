/**
 * Created by jin on 9/1/17.
 */


exports.formModelList = async function pageAdminHome(ctx, next) {

    await ctx.render('web/jsonForm/formModel', { page: { title : '模型 !' }});
}





exports.formData = async function pageAdminHome(ctx, next) {

    await ctx.render('web/jsonForm/formData', { page: { title : '表单数据！' }});
}

