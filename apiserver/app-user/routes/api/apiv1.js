/**
 * Created by JinWYP on 23/01/2017.
 */




const router = require('koa-router')()
const userController = require('../../controllers/api/tgfceruser')


router.post('/tgfcer/user/blocked', userController.createNewBlockedUser)
router.get('/tgfcer/user/count', userController.getBlockedUserList)


router.get('/tgfcer/user/favorite', userController.getUserFavoriteLinkList)
router.post('/tgfcer/user/favorite', userController.createNewFavoriteLink)
router.put('/tgfcer/user/favorite/:uuid', userController.updateUserFavoriteLink)
router.delete('/tgfcer/user/favorite/:uuid', userController.delUserFavoriteLink)

// router.post('/form/models/:id/formdata', formController.postNewFormData)






module.exports = router

