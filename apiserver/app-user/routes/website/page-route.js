/**
 * Created by jinwyp on 4/12/17.
 */




const router = require('koa-router')()





async function userListBlocked(ctx, next) {

    await ctx.render('tgfcer/userlist', { page: { title: 'Tgfcer blocked user list' } });
}



router.get('/tgfcer/users/blocked', userListBlocked)
router.get('/tgfcer', userListBlocked)





module.exports = router