Page({
  data: {
    id: '',
    leaderReview: null,
  },

  onLoad: function (options) {
    this.setData({
      form: wx.getStorageSync('form')
    })
    this.fetchLeaderReviewDetails();
  },
  createOnboardReview: function(e) {
    const id = this.data.form._id; // 你需要根据实际情况获取id的值
    wx.navigateTo({
        url: `/pages/onoffboardNew/onoffboardNew?id=${id}&type=0`,
    });
},

    createOffboardReview: function(e) {
        const id = this.data.form._id; // 你需要根据实际情况获取id的值
        wx.navigateTo({
            url: `/pages/onoffboardNew/onoffboardNew?id=${id}&type=1`,
        });
    },
// Date to string
dateToString: function (timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
},
// Add interview review
addSecondReview() {
  const id = this.data.form._id;
  const type = 1;
  
  // Navigate to the new page with parameters
  wx.navigateTo({
    url: `/pages/interviewReviewNew/interviewReviewNew?id=${id}&type=${type}`,
  });
},
// Add interview review
addThirdReview() {
  const id = this.data.form._id;
  const type = 2;
  // Navigate to the new page with parameters
  wx.navigateTo({
    url: `/pages/interviewReviewNew/interviewReviewNew?id=${id}&type=${type}`,
  });
},

// Fetch Leader Review details
fetchLeaderReviewDetails: function() {

        // 判断存在条件，屎山代码
        let hasLeaderReview = this.data.form.leaderReview ? true : false;
        let hasOnboardReview = hasLeaderReview && this.data.form.leaderReview.onboardReview ? true : false;
        let hasOffboardReview = hasLeaderReview && this.data.form.leaderReview.offboardReview ? true : false;
        let hasfirstReview = hasLeaderReview && this.data.form.leaderReview.firstReview ? true : false;
        let firstReview = hasfirstReview ? this.data.form.leaderReview.firstReview : null;
        let firstReviewDateString = hasfirstReview ? this.dateToString(firstReview.date) : null;
        let hassecondReview = hasLeaderReview && this.data.form.leaderReview.secondReview ? true : false;
        let secondReview = hassecondReview ? this.data.form.leaderReview.secondReview : null;
        let secondReviewDateString = hassecondReview ? this.dateToString(secondReview.date) : null;
        let hasthirdReview = hasLeaderReview && this.data.form.leaderReview.thirdReview ? true : false;
        let thirdReview = hasthirdReview ? this.data.form.leaderReview.thirdReview : null;
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
  
  }
  
});
