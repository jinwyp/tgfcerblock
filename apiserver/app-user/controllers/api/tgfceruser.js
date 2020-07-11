

const { nanoid } = require('nanoid')
const moment = require('moment');

const { MBlockUsersCreateP, MBlockUsersFindOneP, MBlockUserCountFindOneP, MBlockUserCountCreateP, MBlockUserCountUpdateP, MBlockUserCountFindP  } = require('../../service/tgfcerUserModel/userService')



/**
 * 获取屏蔽用户列表
 */
exports.getBlockedUserList = async (ctx, next) => {
    // console.log('ctx.params.id', ctx.params.id)
    // throw new GValidationError('XXXName', 'xxxField');

    const body = ctx.request.body
    // GDataChecker.token(body.token)

    ctx.body  = await MBlockUserCountFindP({})
}




/**
 * 创建一个屏蔽用户数据
 */

exports.createNewBlockedUser = async (ctx, next) => {

    // console.log(ctx.userAgent);
    console.log(ctx.request.body)

    const body = ctx.request.body

    GDataChecker.token(body.token)
    GDataChecker.username(body.submitUsername, 'submitUsername')
    GDataChecker.username(body.blockedUsername, 'blockedUsername')


    const newBlockedUser = {
        token: body.token,
        localId: body.localId,
        uuid: nanoid(),
        submitUsername: body.submitUsername,
        blockedUsername: body.blockedUsername,
        remark: body.remark || '',
        createTime: moment().format(),
        submitUserIpv4: ctx.ipv4 || '',
        submitUserIpv6: ctx.ipv6 || '',
        userAgent : ctx.header['user-agent'] || '',
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

        if (newBlockedUser.remark) {
            tempNewRemark = tempNewRemark + ',' + newBlockedUser.remark
        }
        await MBlockUserCountUpdateP(tempQueryCount, { $set: { count: tempUserCount.count + 1, remark: tempNewRemark  } })

    } else {
        await MBlockUserCountCreateP({
            blockedUsername: body.blockedUsername,
            count: 1,
            remark : newBlockedUser.remark
        })
    }

    ctx.body = {
        uuid : newBlockedUser.uuid,
        submitUsername : newBlockedUser.submitUsername,
        blockedUsername : newBlockedUser.blockedUsername,
        remark : newBlockedUser.remark,
        createTime : newBlockedUser.createTime,
    }

}

