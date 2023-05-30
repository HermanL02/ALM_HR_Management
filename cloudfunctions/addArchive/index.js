// 云函数入口文件
const cloud = require('wx-server-sdk');
const { eventBridge } = require('XrFrame/kanata/lib/index');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
try{
  return await db.collection('archive').add({
    data: {
      name:event.name,
      birthdate: event.birthdate,
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
    }
  });
}catch(error){
  console.log('error>>>存储到数据库', error);
}
}