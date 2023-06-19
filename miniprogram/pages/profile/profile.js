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

        that.setData({
          openid: res.result.OPENID,
          role: res.result.ROLE,
        });
  
        //设置全局变量role
        getApp().globalData.role = that.data.role;
        getApp().globalData.openid = that.data.openid;
        console.log(getApp().globalData.role);
      }
     
    });
  },
  copyOpenId: function () {
    wx.setClipboardData({
        data: this.data.openid,
        success (res) {
            wx.getClipboardData({
                success (res) {
                    console.log(res.data) // data
                    wx.showToast({
                        title: '已复制',
                        icon: 'success',
                        duration: 2000
                    })
                }
            })
        }
    })
},

  // Todo: 需要设置getRole

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

  },
  bindInputOpenId: function(e) {
    this.setData({
      useropenid: e.detail.value
    });
  },
  onAddviceadminTap: function() {
    wx.showLoading({
      title: '正在上传',
    });

    wx.cloud.callFunction({
      name: 'addViceAdmin',
      data: {
        useropenid: this.data.useropenid
      },
      success: res => {
        wx.hideLoading();
        
        // 检查云函数返回的结果
        if (res.result.code && res.result.code < 0) {
          // 如果云函数返回了错误码，显示错误信息
          wx.showToast({
            title: res.result.message,
            icon: 'none'
          });
        } else {
          // 如果云函数成功执行，显示上传完成信息
          wx.showToast({
            title: '上传完成',
          });
          this.setData({
            openid: ''
          });
        }
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({
          title: '上传失败',
        });
        console.error('[云函数] [addViceAdmin] 调用失败', err);
      }
    });
}

})