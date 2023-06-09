// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext() // 获取操作者的openid
  const db = cloud.database()
  try {
    // 先从原集合中读取这个档案的数据
    const archiveDoc = await db.collection('archive').doc(event.id).get()
    const archiveData = archiveDoc.data

    // 删除原集合中的这个档案
    await db.collection('archive').doc(event.id).remove()

    // 将读取到的数据添加到新的集合中
    await db.collection('deletedArchive').add({
      data: archiveData
    })

    // 向"log"集合中添加操作日志
    await db.collection('log').add({
      data: {
        operator: OPENID,
        archiveID: event.id,
        operation: 'Delete'
      }
    })

    return { status: 'success' }
  } catch (err) {
    return { status: 'error', error: err }
  }
}
