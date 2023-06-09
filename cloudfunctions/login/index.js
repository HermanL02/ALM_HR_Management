// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
// index.js

exports.main = async (event, context) => {
  // 这里获取到的 openId、 appId 和 unionId 是可信的，注意 unionId 仅在满足 unionId 获取条件时返回
  let { OPENID, APPID, UNIONID } = cloud.getWXContext()
  const db = cloud.database()
  const admins = await db.collection('admin').where({
    _openid: OPENID
  }).get()
  let ROLE = 'user';
  if(admins.data.length > 0){
    ROLE = admins.data[0].role || 'user'; // 从数据库中读取role，如果不存在则默认为'user'
  }
  return {
    OPENID,
    APPID,
    UNIONID,
    ROLE,
  }
}

