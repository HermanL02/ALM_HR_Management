// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 获取数据库引用
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { id, type, form } = event
  const archiveCollection = db.collection('archive')

  // 查找archive集合中的指定记录
  const archive = await archiveCollection.doc(id).get().then(res => res.data)

  if (!archive) {
    throw new Error('Archive not found')
  }

  // 如果type为0，设置archive.leaderReview.onboardReview为form
  // 如果type为1，设置archive.leaderReview.offboardReview为form
  let updatedData = {}

  if (type === 0) {
    updatedData = { 'leaderReview.onboardReview': form }
  } else if (type === 1) {
    updatedData = { 'leaderReview.offboardReview': form }
  }

  // 更新记录
  return archiveCollection.doc(id).update({
    data: updatedData
  })
}
