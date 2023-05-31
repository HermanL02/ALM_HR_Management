// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境



const crypto = require('crypto')

exports.main = async (event, context) => {
    const {OPENID} = cloud.getWXContext()
    const result = await cloud.openapi.wxa.decrypt({
        openid: OPENID,
        encryptData: event.weRunData.data,
        iv: event.weRunData.iv,
        sessionKey: event.weRunData.sessionKey,
    })

    return result.phoneNumber
}
