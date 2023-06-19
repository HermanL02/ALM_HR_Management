// pages/interviewReviewNew/interviewReviewNew.js
Page({

  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
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

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },
  // 初始建议 Radio Change
  reviewRadioChange(e) {
    const { field } = e.currentTarget.dataset;
    console.log(this.data);
    this.setData({
      [`review.${field}`]: e.detail.value,
    });
  },
  /**
   * Lifecycle function--Called when page show
   */
  onShow() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },
  submit(){
    wx.showLoading({
      title: '正在提交',
    });

    wx.cloud.callFunction({
      name: 'interviewReview',
      data: {
        id: this.data.id,
        type: Number(this.data.type),
        review: this.data.review
      },
    })
    .then(res => {
      wx.hideLoading();
      console.log(res.result);  // 输出云函数返回结果
      wx.showToast({
        title: '提交成功',
        icon: 'success'
      });
      wx.navigateBack({
        delta: 2  // Return one page back
      });
    })
    .catch(err => {
      wx.hideLoading();
      console.error(err);  // 打印错误信息
      wx.showToast({
        title: '提交失败',
        icon: 'none'
      });
    });
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})