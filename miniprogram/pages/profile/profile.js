// pages/profile/profile.js
Page({

  /**
   * Page initial data
   */
  data: {
      openid:'',
      role:'',
  }, 

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function() {
    let that = this;
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        console.log('callFunction test result: ', res);
        let role = that.getRole();
        that.setData({
          openid: res.result.OPENID,
          role:role
        });
        
      }
     
    });
  },
  // Todo: 需要设置getRole
  getRole: function() {
    console.log("鉴权中...");
      return '用户';
    
  },
  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

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

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})