// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const id = event.id // 获取传入的 id 参数
  console.log(id)
  try {
    // 在 archive 集合中查找 _id 等于传入 id 的记录
    const result = await db.collection('archive').doc(id).get()

    // 返回查找到的记录
    return result.data
  } catch (err) {
    console.error(err)
    return err
  }
}
