Page({
  data: {
    employees: []
  },

  onLoad: function() {
    console.log( getApp().globalData.role);
    this.fetchUsers();
  },

  onShow: function(){
    console.log( getApp().globalData.role);
    this.fetchUsers();
  },

  fetchUsers: function() {
    let that = this;
    wx.cloud.callFunction({
      name: 'getArchive',
      success: function(res) {
        console.log(res.result.data);
        that.setData({
          employees: res.result.data
        });
      },
      fail: function(res) {
        console.log('Error fetching users:', res);
      }
    });
  },
  // 查看员工详情
  navigateToOverview: function (event) {
    // Get _id from event.currentTarget.dataset
    const id = event.currentTarget.dataset.id;
    console.log(id);
    // Navigate to employeeDetail page with _id as a parameter
    wx.navigateTo({
      url: `/pages/archiveOverview/archiveOverview?id=${id}`,
    });
  },
});
