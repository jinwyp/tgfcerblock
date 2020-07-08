/**
 * Created by JinWYP on 23/01/2017.
 */




const router = require('koa-router')()
const userController = require('../../controllers/api/tgfceruser')


router.post('/tgfcer/user/blocked', userController.createNewBlockedUser)
router.get('/tgfcer/user/count', userController.getBlockedUserList)

// router.post('/form/models/:id/formdata', formController.postNewFormData)






module.exports = router

