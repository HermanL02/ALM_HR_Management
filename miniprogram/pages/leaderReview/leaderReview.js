Page({
  data: {
    id: '',
    leaderReview: null,
  },

  onLoad: function (options) {
    // Get id from navigation parameter
    const id = options.id;
    this.setData({
      id: id,
    });

    this.fetchLeaderReviewDetails(id);
  },
  createOnboardReview: function(e) {
    const id = this.data.id; // 你需要根据实际情况获取id的值
    wx.navigateTo({
        url: `/pages/onoffboardNew/onoffboardNew?id=${id}&type=0`,
    });
},

    createOffboardReview: function(e) {
        const id = this.data.id; // 你需要根据实际情况获取id的值
        wx.navigateTo({
            url: `/pages/onoffboardNew/onoffboardNew?id=${id}&type=1`,
        });
    },

  fetchLeaderReviewDetails: function(id) {
    wx.cloud.callFunction({
      name: 'getArchiveByID',
      data: {
        id: id 
      },
      success: res => {
        console.log('form:', res.result);
  
        // 判断存在条件
        let hasLeaderReview = res.result.leaderReview ? true : false;
        let hasOnboardReview = hasLeaderReview && res.result.leaderReview.onboardReview ? true : false;
        let hasOffboardReview = hasLeaderReview && res.result.leaderReview.offboardReview ? true : false;
        
        // 根据条件更新界面元素
        if (!hasLeaderReview) {
          this.setData({
            message: '该员工暂时没有入离职评价',
            onboardButton: {
              label: '新建入职评价',
              exists: false
            },
            offboardButton: {
              label: '新建离职评价',
              exists: false
            }
          });
        } else {
          this.setData({
            onboardButton: {
              label: hasOnboardReview ? '查看入职评价' : '新建入职评价',
              exists: hasOnboardReview
            },
            offboardButton: {
              label: hasOffboardReview ? '查看离职评价' : '新建离职评价',
              exists: hasOffboardReview
            }
          });
        }
  
        this.setData({
          form: res.result
        });
      },
      fail: err => {
        console.error('Failed to get employee:', err);
      }
    });
  }
  
});
