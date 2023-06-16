// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
// 获取数据库引用
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let { OPENID, APPID, UNIONID } = cloud.getWXContext()
  const { id, type, review } = event
  console.log(review);
  // 设置review.date为当前时间的时间戳
  review.date = Date.now()

  // 设置review.interviewer为当前用户的openid
  review.interviewer = OPENID

  const archiveCollection = db.collection('archive')

  // 查找archive集合中的指定记录
  const archive = await archiveCollection.doc(id).get().then(res => res.data)

  if (!archive) {
    throw new Error('Archive not found')
  }

  // 根据type的值，设置不同的review
  let updatedData = {}

  if (type === 0) {
    updatedData = { 'leaderReview.firstReview': review }
  } else if (type === 1) {
    updatedData = { 'leaderReview.secondReview': review }
  } else if (type === 2) {
    updatedData = { 'leaderReview.thirdReview': review }
  }

  // 更新记录
  return archiveCollection.doc(id).update({
    data: updatedData
  })
}