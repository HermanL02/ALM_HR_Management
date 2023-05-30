Page({
  data: {
    employees: []
  },

  onLoad: function() {
    this.fetchUsers();
  },

  onshow: function(){
    this.onLoad();
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
  }
});
