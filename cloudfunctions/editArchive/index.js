// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})

// 云函数入口函数
exports.main = async (event, context) => {
  const { form } = event;
  const wxContext = cloud.getWXContext()
  try {
    // 获取archive集合实例
    const db = cloud.database();
    const archiveCollection = db.collection('archive');

    // 从form对象中删除_id字段
    const formWithoutID = { ...form };
    delete formWithoutID._id;
    console.log(formWithoutID);

    // 根据传入的form._id查找对应的archive对象
    const archive = await archiveCollection.doc(form._id).get();

    // 获取archive对象中的数据
    const archiveData = archive.data;

    // 遍历传入的form对象
    Object.keys(formWithoutID).forEach(key => {
      let flag = false;
      // 如果form对象的key不存在于archive对象中，则将该key添加到archive对象中
      if (!(key in archiveData)) {
        archiveData[key] = formWithoutID[key];
        flag = true;
      } else {
        // 如果form对象的key存在于archive对象中且值不同，则更新archive对象的对应值
        if (JSON.stringify(archiveData[key]) !== JSON.stringify(formWithoutID[key])) {
          flag=true;
          archiveData[key] = formWithoutID[key];
        }
      }
      if (flag==true){
      // 记录修改的日志
      const logData = {
        archiveID: form._id,
        operation: "modify",
        operator: wxContext.OPENID,
        variable: key,
        beforeValue: archive.data[key] || "",  // 对于archive中不存在的值，修改前的值为空
        afterValue: formWithoutID[key]
      };

      // 存入log集合中
      const logCollection = db.collection('log');
      logCollection.add({ data: logData });
    }
    });

    // 更新archive对象
    delete archiveData._id; 
    await archiveCollection.doc(form._id).update({ data: archiveData });

    return { 
      statusCode: 200,  // 添加statusCode字段，代表成功
      result: "success" 
    };
  } catch (error) {
    console.error(error);
    return { 
      statusCode: 500,  // 添加statusCode字段，代表失败
      result: "error" 
    };
  }
}
