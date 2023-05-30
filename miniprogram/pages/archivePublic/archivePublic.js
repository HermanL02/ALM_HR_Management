Page({
  data: {
    employees: []
  },

  onLoad: function() {
    this.fetchUsers();
  },

  fetchUsers: function() {
    let that = this;
    wx.cloud.callFunction({
      name: 'getArchive',
      success: function(res) {
        that.setData({
          employees: res.result.data
        });
      },
      fail: function(res) {
        console.log('Error fetching users:', res);
      }
    });
  }
});
