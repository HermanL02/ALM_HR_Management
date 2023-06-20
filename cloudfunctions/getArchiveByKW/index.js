// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database();

const MAX_LIMIT = 100; // 设定云函数每次返回数据的最大限制

// 云函数入口函数
exports.main = async (event, context) => {
  const keyword = event.keyword; // 获取搜索关键词
  let total = 0; // 用户数量
  let tasks = []; // 承载所有读操作的 promise 的数组

  // 先取出集合记录总数
  total = (await db.collection('archive').where({
   name: db.RegExp({ // 搜索用户名
      regexp: keyword, // 从外部传入的关键词
      options: 'i', // 不区分大小写
    })
  }).count()).total;

  // 计算需分几次取
  const batchTimes = Math.ceil(total / MAX_LIMIT);

  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('archive')
    .where({
      name: db.RegExp({
        regexp: '.*' + keyword + '.*', 
        options: 'i',
      })
    })
    .skip(i * MAX_LIMIT)
    .limit(MAX_LIMIT)
    .get();  
    tasks.push(promise);
  }

  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    };
  }, {data: [], errMsg: ''}); // 这是reduce函数的初始值
};
