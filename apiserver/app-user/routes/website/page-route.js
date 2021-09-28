/**
 * Created by jinwyp on 4/12/17.
 */




const router = require('koa-router')()





async function userListBlocked(ctx, next) {

    await ctx.render('tgfcer/userlist', { page: { title: 'Tgfcer blocked user list' } });
}

async function userDetailListBlocked(ctx, next) {

    await ctx.render('tgfcer/user_detail_list', { page: { title: 'Tgfcer blocked user detail list' } });
}


router.get('/tgfcer/users/blockeddetail', userDetailListBlocked)
router.get('/tgfcer/users/blocked', userListBlocked)
router.get('/tgfcer', userListBlocked)





module.exports = router