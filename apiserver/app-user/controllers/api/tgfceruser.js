const { nanoid } = require('nanoid')
const moment = require('moment');

const {
    MBlockUsersCreateP,
    MBlockUsersFindOneP,
    MBlockUserCountFindOneP,
    MBlockUserCountCreateP,
    MBlockUserCountUpdateP,
    MBlockUserCountFindP,
    MUserFavoriteLinkCreateP,
    MUserFavoriteLinkUpdateP,
    MUserFavoriteLinkDeleteP,
    MUserFavoriteLinkFindOneP,
    MUserFavoriteLinkFindP
} = require('../../service/tgfcerUserModel/userService')



/**
 * 获取屏蔽用户列表
 */
exports.getBlockedUserList = async(ctx, next) => {
    // console.log('ctx.params.id', ctx.params.id)
    // throw new GValidationError('XXXName', 'xxxField');

    const body = ctx.request.body
        // GDataChecker.token(body.token)

    ctx.body = await MBlockUserCountFindP({})
}




/**
 * 创建一个屏蔽用户数据
 */

exports.createNewBlockedUser = async(ctx, next) => {

    // console.log(ctx.userAgent);
    console.log('=== ctx.request.body: ', ctx.request.body)

    const body = ctx.request.body

    GDataChecker.token(body.token)
    GDataChecker.username(body.submitUsername, 'submitUsername')
    GDataChecker.username(body.blockedUsername, 'blockedUsername')


    const newBlockedUser = {
        localId: body.localId,
        uuid: nanoid(),
        submitUsername: body.submitUsername,
        blockedUsername: body.blockedUsername,
        remark: body.remark || '',
        createTime: moment().format(),
        submitUserIpv4: ctx.ipv4 || '',
        submitUserIpv6: ctx.ipv6 || '',
        userAgent: ctx.header['user-agent'] || '',
    }



    const userAgent = {
        _agent: {
            isYaBrowser: false,
            isAuthoritative: false,
            isMobile: false,
            isTablet: false,
            isiPad: false,
            isiPod: false,
            isiPhone: false,
            isAndroid: false,
            isBlackberry: false,
            isOpera: false,
            isIE: false,
            isEdge: false,
            isIECompatibilityMode: false,
            isSafari: false,
            isFirefox: false,
            isWebkit: false,
            isChrome: false,
            isKonqueror: false,
            isOmniWeb: false,
            isSeaMonkey: false,
            isFlock: false,
            isAmaya: false,
            isPhantomJS: false,
            isEpiphany: false,
            isDesktop: true,
            isWindows: false,
            isLinux: false,
            isLinux64: false,
            isMac: true,
            isChromeOS: false,
            isBada: false,
            isSamsung: false,
            isRaspberry: false,
            isBot: false,
            isCurl: false,
            isAndroidTablet: false,
            isWinJs: false,
            isKindleFire: false,
            isSilk: false,
            isCaptive: false,
            isSmartTV: false,
            isUC: false,
            isFacebook: false,
            isAlamoFire: false,
            isElectron: false,
            silkAccelerated: false,
            browser: 'Paw',
            version: '3.1.5',
            os: 'OS X',
            platform: 'Apple Mac',
            geoIp: {},
            source: 'Paw/3.1.5 (Macintosh; OS X/10.11.6) GCDHTTPRequest'
        }
    }

    if (ctx.userAgent) {
        newBlockedUser.browser = ctx.userAgent.browser
        newBlockedUser.browserVersion = ctx.userAgent.version

        newBlockedUser.OSPlatform = ctx.userAgent.platform
        newBlockedUser.OSVersion = ctx.userAgent.os

        newBlockedUser.isMobile = ctx.userAgent.isMobile
        newBlockedUser.isDesktop = ctx.userAgent.isDesktop
    }

    const temUser = await MBlockUsersFindOneP({
        submitUsername: body.submitUsername,
        blockedUsername: body.blockedUsername,
    });

    if (temUser) {
        GDataChecker.usernameExist(body.blockedUsername, 'blockedUsername')
    }

    // 创建屏蔽用户
    await MBlockUsersCreateP(newBlockedUser)


    // 创建屏蔽用户统计数量
    const tempQueryCount = {
        blockedUsername: body.blockedUsername,
    };
    const tempUserCount = await MBlockUserCountFindOneP(tempQueryCount)

    if (tempUserCount) {
        let tempNewRemark = tempUserCount.remark;

        if (newBlockedUser.remark && tempNewRemark.indexOf('newBlockedUser.remark') === -1) {
            tempNewRemark = tempNewRemark + ',' + newBlockedUser.remark
        }
        await MBlockUserCountUpdateP(tempQueryCount, { $set: { count: tempUserCount.count + 1, remark: tempNewRemark } })

    } else {
        await MBlockUserCountCreateP({
            blockedUsername: body.blockedUsername,
            count: 1,
            remark: newBlockedUser.remark
        })
    }

    ctx.body = {
        uuid: newBlockedUser.uuid,
        submitUsername: newBlockedUser.submitUsername,
        blockedUsername: newBlockedUser.blockedUsername,
        remark: newBlockedUser.remark,
        createTime: newBlockedUser.createTime,
    }

}








/**
 * 创建一个用户收藏的帖子
 */

exports.createNewFavoriteLink = async(ctx, next) => {

    // console.log(ctx.userAgent);
    console.log('=== ctx.request.body: ', ctx.request.body)

    const body = ctx.request.body

    GDataChecker.token(body.token)

    GDataChecker.username(body.submitUsername, 'submitUsername')
    GDataChecker.username(body.submitUserId, 'submitUserId')
    GDataChecker.username(body.threadId, 'threadId')
    GDataChecker.username(body.website, 'website')


    const newUserFavoritePost = {
        uuid: nanoid(),
        submitUserId: body.submitUserId,
        submitUsername: body.submitUsername,
        threadTitle: body.threadTitle || '',
        threadId: body.threadId,
        threadTag: body.threadTag || '',
        remark: body.remark || '',
        url: body.url || '',
        website: body.website || ''
    };



    if (ctx.userAgent) {
        newUserFavoritePost.browser = ctx.userAgent.browser
        newUserFavoritePost.browserVersion = ctx.userAgent.version

        newUserFavoritePost.OSPlatform = ctx.userAgent.platform
        newUserFavoritePost.OSVersion = ctx.userAgent.os

        newUserFavoritePost.isMobile = ctx.userAgent.isMobile
        newUserFavoritePost.isDesktop = ctx.userAgent.isDesktop
    }

    const temUserFavoriteLink = await MUserFavoriteLinkFindOneP({
        submitUserId: body.submitUserId,
        threadId: body.threadId,
    });

    if (temUserFavoriteLink) {
        GDataChecker.linkExist(body.threadId, 'threadId')
    }

    // 创建用户收藏Link
    await MUserFavoriteLinkCreateP(newUserFavoritePost)


    ctx.body = {
        uuid: newUserFavoritePost.uuid,
        submitUsername: newUserFavoritePost.submitUsername,
        submitUserId: newUserFavoritePost.submitUserId,
        threadTitle: newUserFavoritePost.threadTitle,
        threadId: newUserFavoritePost.threadId,
        threadTag: newUserFavoritePost.threadTag,
        remark: newUserFavoritePost.remark,
        url: newUserFavoritePost.url,
        website: newUserFavoritePost.website
    }
}


/**
 * 编辑某个用户的收藏某一个Link
 */
exports.updateUserFavoriteLink = async(ctx, next) => {

    console.log('=== ctx.request.body: ', ctx.request.body)

    const body = ctx.request.body
    GDataChecker.username(ctx.params.uuid, 'uuid')

    GDataChecker.token(body.token)
    GDataChecker.username(body.submitUsername, 'submitUsername')
    GDataChecker.username(body.submitUserId, 'submitUserId')
    GDataChecker.username(body.threadId, 'threadId')
    GDataChecker.username(body.website, 'website')
    GDataChecker.username(body.threadTag, 'threadTag')


    const tempQuery = {
        uuid: ctx.params.uuid,
        submitUserId: body.submitUserId,
        threadId: body.threadId,
    }

    const tempUserFavoriteLink = await MUserFavoriteLinkFindOneP(tempQuery);
    GDataChecker.linkNotFound(tempUserFavoriteLink, 'uuid')

    // 更新用户收藏Link
    await MUserFavoriteLinkUpdateP(tempQuery, { $set: { threadTag: body.threadTag, remark: body.remark || "" } })


    ctx.body = {
        uuid: tempUserFavoriteLink.uuid,
        submitUsername: tempUserFavoriteLink.submitUsername,
        submitUserId: tempUserFavoriteLink.submitUserId,
        threadTitle: tempUserFavoriteLink.threadTitle,
        threadId: tempUserFavoriteLink.threadId,
        threadTag: tempUserFavoriteLink.threadTag,
        remark: tempUserFavoriteLink.remark,
        url: tempUserFavoriteLink.url,
        website: tempUserFavoriteLink.website
    }
}

exports.delUserFavoriteLink = async(ctx, next) => {
    // console.log('ctx.params.id', ctx.params.id)
    // throw new GValidationError('XXXName', 'xxxField');

    console.log('=== ctx.request.body: ', ctx.request.body)

    const body = ctx.request.body
    GDataChecker.username(ctx.params.uuid, 'uuid')

    GDataChecker.token(body.token)
    GDataChecker.username(body.submitUserId, 'submitUserId')
    GDataChecker.username(body.threadId, 'threadId')


    const tempQuery = {
        uuid: ctx.params.uuid,
        submitUserId: body.submitUserId,
        threadId: body.threadId,
    }

    const tempUserFavoriteLink = await MUserFavoriteLinkFindOneP(tempQuery);
    GDataChecker.linkNotFound(tempUserFavoriteLink, 'uuid')

    ctx.body = await MUserFavoriteLinkDeleteP(tempQuery)
}


/**
 * 获取某个用户的收藏列表
 */
exports.getUserFavoriteLinkList = async(ctx, next) => {
    // console.log('ctx.params.id', ctx.params.id)
    // throw new GValidationError('XXXName', 'xxxField');

    const query = ctx.request.query
    GDataChecker.token(ctx.request.query.token)
        // GDataChecker.username(body.submitUsername, 'submitUsername')
    GDataChecker.username(ctx.request.query.uid, 'uid')


    const tempQuery = {
        submitUserId: ctx.request.query.uid
    }

    if (query.title) {
        tempQuery.threadTitle = new RegExp(decodeURIComponent(query.title))
    }

    if (query && query.tag) {
        tempQuery.threadTag = new RegExp(decodeURIComponent(query.tag))
    }

    console.log('===== Search query getUserFavoriteLinkList: ', ctx.request.query, tempQuery)

    ctx.body = await MUserFavoriteLinkFindP(tempQuery)
}