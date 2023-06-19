// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})

// 获取数据库引用
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    // 检查是否已存在该openid的纪录
    const queryResult = await db.collection('admin').where({
      _openid: event.useropenid
    }).get()

    if (queryResult.data.length > 0) {
      // 如果已经存在，则返回错误信息
      return {
        code: -1,
        message: '该openid已存在，无法添加'
      }
    }

    // 如果不存在，则添加新纪录
    const addResult = await db.collection('admin').add({
      data: {
        _openid: event.useropenid,
        role: 'viceadmin'
      }
    })

    return addResult
  } catch(e) {
    console.error(e)
    return {
      code: -2,
      message: '云函数执行错误'
    }
  }
}