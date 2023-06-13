// /pages/onoffboardNew/onoffboardNew.js
Page({
  onLoad: function (options) {
      console.log(options);
      // id 和 type 通过 url 参数传入，将会在 options 对象中
      const id = options.id;
      const type = options.type;
      //设置openid，来填写面试人
      this.setData({
        openid: getApp().globalData.openid
      });
      //获取日期，来填写其他
      let that = this;
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      month = month < 10 ? '0' + month : month;
      day = day < 10 ? '0' + day : day;
      that.setData({
        date: year + '-' + month + '-' + day
      });
      console.log("id: ", id);
      console.log("type: ", type);
  },
  // 输入改变
  inputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [field]: e.detail.value,
    });
  },

  // 单选按钮改变
  radioChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [field]: e.detail.value,
    });
  },

  // 提交
  submit() {
    that.setData({
      timestamp: timestamp
    });
    console.log(this.data);
    // 处理提交逻辑...
  },

});
