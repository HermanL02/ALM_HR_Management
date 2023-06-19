// /pages/onoffboardNew/onoffboardNew.js
Page({
  data: {
    form:{

    },
    review:{

    },
  },
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
      // Set archive id
      that.setData({
        id: id,
        type:type,
      });

      console.log("id: ", id);
      console.log("type: ", type);
  },
  // 输入改变
  inputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`form.${field}`]: e.detail.value,
    });
  },

  // 单选按钮改变
  radioChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`form.${field}`]: e.detail.value,
    });
  },
 
  // 初始建议 Radio Change
  reviewRadioChange(e) {
    const { field } = e.currentTarget.dataset;
    console.log(this.data);
    this.setData({
      [`review.${field}`]: e.detail.value,
    });
  },
  // 提交
  submit() {
    console.log(this.data);
    // 处理提交逻辑...
    wx.cloud.callFunction({
      name: 'addOnOffBoard',
      data: {
        id: this.data.id,
        type: Number(this.data.type),
        form: this.data.form
      },
    })
    .then(res => {
      console.log(res.result)  // 输出云函数返回结果
    })
    .catch(console.error)  // 打印错误信息
    console.log( this.data.review);
    wx.cloud.callFunction({
      name: 'interviewReview',
      data: {
        id: this.data.id,
        type: Number('0'),
        review: this.data.review
      },
    })
    .then(res => {
      console.log(res.result)  // 输出云函数返回结果
      wx.navigateBack({
        delta: 2  // Return one page back
      });
    })
    .catch(console.error)  // 打印错误信息

  },

});
