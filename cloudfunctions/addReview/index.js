// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const { id, review } = event; // 获取员工ID, 新的评论

  try {
    // 调用messageSec函数进行评论审核
    const secCheckResult = await cloud.callFunction({
      name: 'messageSec',
      data: {
        openid: openid,
        scene:2,
        version:2,
        content: review
      }
    });
    console.log(secCheckResult.result.result.suggest);
    // 如果评论被标记为高风险，则抛出一个错误并终止操作
    if (secCheckResult.result.result.suggest != 'pass') {
      throw new Error('评论内容不符合要求');
      
    }

    // 创建一个新的review对象，包含openid和评论内容
    const newReview = { openid: openid, content: review };

    // 找到对应的员工记录，并将新的评论添加到reviews数组中
    const res = await db.collection('archive').doc(id).update({
      data: {
        reviews: db.command.push(newReview)
      }
    });
    
    return {
      success: true,
      stats: { updated: 1 } 
    };// 返回操作结果
  } catch (error) {
    console.log('error>>>添加评论到数据库', error);
    return { 
      success: false, 
      message: '评论添加失败：' + error.message 
    }; // 如果发生错误，返回包含错误信息的对象
  }
}
