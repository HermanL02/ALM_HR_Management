// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { data } = await db.collection('archive').get();
    return data;
  } catch (e) {
    console.error(e);
    return {
      code: 500,
      message: '读取数据库时出错'
    };
  }
}