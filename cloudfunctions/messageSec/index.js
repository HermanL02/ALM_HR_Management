// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
exports.main = async (event, context) => {
  try {
    const { openid, content } = event;  // 从event中提取openid和content
    const result = await cloud.openapi.security.msgSecCheck({
        "openid": openid,
        "scene": 1,
        "version": 2,
        "content": content
    })
    return result
  } catch (err) {
    return err
  }
}
