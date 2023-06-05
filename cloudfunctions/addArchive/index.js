// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    const dbResult = await db.collection('archive').add({
      data: {
        ...event,
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,
      }
    });
    // 返回一个包含statusCode和dbResult的响应对象
    return { statusCode: 200, data: dbResult };
  } catch (error) {
    console.log('error>>>存储到数据库', error);
    // 返回一个包含错误状态码和错误消息的响应对象
    return { statusCode: 500, message: error.message };
  }
}

