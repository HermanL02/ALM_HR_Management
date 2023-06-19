// pages/archiveOverview/archiveOverview.js
Page({

  /**
   * Page initial data
   */
  data: {
    form:{

    },
    role:'',
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      role: getApp().globalData.role
    });
    // Get _id from options
    const id = options.id;
    // Set _id as page data
    this.setData({
      'id': id
    });
    console.log("Overview Page Received ID:"+ id);
    this.fetchEmployeeDetails(id);
  },

  fetchEmployeeDetails: function(id) {
    wx.showLoading({
      title: '正在获取信息',
    });

    wx.cloud.callFunction({
      name: 'getArchiveByID',
      data: {
        id: id 
      },
      success: res => {
        wx.hideLoading();
        console.log('form:', res.result);
        if (!res.result.reviews) {
          res.result.reviews = [];
        }
        this.setData({
          form: res.result
        });
      },
      fail: err => {
        wx.hideLoading();
        console.error('Failed to get employee:', err);
        wx.showToast({
          title: '获取员工信息失败',
          icon: 'none'
        });
      }
    });
  },


  navigateToDetail: function (event) {
    // Get _id from event.currentTarget.dataset
    const id = event.currentTarget.dataset.id;
    console.log(id);
    // Navigate to employeeDetail page with _id as a parameter
    wx.navigateTo({
      url: `/pages/archiveDetail/archiveDetail?id=${id}`,
    });
  },
  handleCommentInput: function(e) {
    // 当用户输入评论时，更新newComment
    console.log("正在更新新comment");
    this.setData({
      newComment: e.detail.value
    });
  },
  // 提交评价
  submitComment: function() {
    wx.showLoading({
      title: '正在提交评论',
    });

    wx.cloud.callFunction({
      name: 'addReview',
      data: {
        id: this.data.id,
        review: this.data.newComment,
      },
      
      success: res => {
        wx.hideLoading();
        console.log(res);
        wx.showToast({
          title: "提交成功",
          icon: 'success',
          duration: 2000
        });
        if (!res.result.success){
          // Operation failed, can display error message
          wx.showToast({
            title: res.result.message,
            icon: 'none',
            duration: 2000
          });
        }else{
          // 临时显示这条评论 (与后台实际脱钩) 同时删除输入框内内容
          let newReviews = this.data.form.reviews;
          newReviews.push({ content: this.data.newComment, openid: getApp().globalData.openid});
          this.setData({ 'form.reviews': newReviews, 'newComment': '' });
          //
        }
      },
      fail: err => {
        wx.hideLoading();
        console.error('Failed to add review:', err);
        wx.showToast({
          title: '提交评论失败',
          icon: 'none'
        });
      }
    });
  },

  //删除档案
  deleteArchive: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认',
      content: '确定要删除这个档案吗?',
      success: function(res) {
        if (res.confirm) {
          // 用户点击了确认
          wx.cloud.callFunction({
            name: 'deleteArchive',
            data: {
              id: id
            },
            success: function(res) {
              // 检查云函数返回的状态
              if (res.result.status === 'success') {
                // 如果删除成功，返回上一页
                wx.navigateBack({
                  delta: 1
                });
              } else {
                // 如果删除失败，显示一个toast
                wx.showToast({
                  title: '删除失败，请重试',
                  icon: 'none',
                  duration: 2000
                });
              }
            },
            fail: function(err) {
              // 如果云函数调用失败，显示一个toast
              wx.showToast({
                title: '删除失败，请重试',
                icon: 'none',
                duration: 2000
              });
            }
          })
        } else if (res.cancel) {
          // 用户点击了取消
        }
      }
    })
  },

  // 查看入职离职评价
  navigateToLeaderReview: function (event) {
    // Get _id from event.currentTarget.dataset
    const id = event.currentTarget.dataset.id;
    console.log(id);
    // Navigate to review page with _id as a parameter
    wx.navigateTo({
      url: `/pages/leaderReview/leaderReview?id=${id}`,
    });
  },
  
  
})