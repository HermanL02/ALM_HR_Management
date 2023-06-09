// pages/archiveOverview/archiveOverview.js
Page({

  /**
   * Page initial data
   */
  data: {
    form:{

    }

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
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
    wx.cloud.callFunction({
      name: 'getArchiveByID',
      data: {
        id: id 
      },
      success: res => {
        console.log('form:', res.result);
        if (!res.result.reviews) {
          res.result.reviews = [];
        }
        this.setData({
          form: res.result
        });
      },
      fail: err => {
        console.error('Failed to get employee:', err);
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
  submitComment: function() {
    wx.cloud.callFunction({
      name: 'addReview',
      data: {
        id: this.data.id,
        review: this.data.newComment,
      },
      
      success: res => {
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
        }
      },
      fail: err => {
        console.error('Failed to add review:', err);
      }
    });
  },
  
})