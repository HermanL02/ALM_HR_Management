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
// Date to string
dateToString: function (timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
},
//

  fetchLeaderReviewDetails: function(id) {
    wx.cloud.callFunction({
      name: 'getArchiveByID',
      data: {
        id: id 
      },
      success: res => {
        console.log('form:', res.result);
  
        // 判断存在条件，屎山代码
        let hasLeaderReview = res.result.leaderReview ? true : false;
        let hasOnboardReview = hasLeaderReview && res.result.leaderReview.onboardReview ? true : false;
        let hasOffboardReview = hasLeaderReview && res.result.leaderReview.offboardReview ? true : false;
          let hasfirstReview = hasLeaderReview && res.result.leaderReview.firstReview ? true : false;
          let firstReview = hasfirstReview ? res.result.leaderReview.firstReview : null;
          let firstReviewDateString = hasfirstReview ? this.dateToString(firstReview.date) : null;
          let hassecondReview = hasLeaderReview && res.result.leaderReview.secondReview ? true : false;
          let secondReview = hassecondReview ? res.result.leaderReview.secondReview : null;
          let secondReviewDateString = hassecondReview ? this.dateToString(secondReview.date) : null;
          let hasthirdReview = hasLeaderReview && res.result.leaderReview.thirdReview ? true : false;
          let thirdReview = hasthirdReview ? res.result.leaderReview.thirdReview : null;
          let thirdReviewDateString = hasthirdReview ? this.dateToString(thirdReview.date) : null;
        this.setData({
          hasfirstReview,
          firstReview,
          hassecondReview,
          secondReview,
          hasthirdReview,
          thirdReview,
          firstReviewDateString,
          secondReviewDateString,
          thirdReviewDateString
        })
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
