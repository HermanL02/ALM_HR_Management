Page({
  data: {
    employees: [],
    searchKeyword: '', // 用户输入的搜索关键词
  },

  onLoad: function() {
    this.showModal();
    console.log( getApp().globalData.role);
    this.fetchUsers();

  },
 // 当用户输入时，更新搜索关键词
 bindSearchInput: function(e) {
  this.setData({
    searchKeyword: e.detail.value
  });
},

// 当用户点击搜索按钮时，调用云函数搜索用户
onSearchTap: function() {
  const that = this;
  const keyword = this.data.searchKeyword;

  wx.showLoading({
    title: '搜索中...',
  });

  wx.cloud.callFunction({
    name: 'getArchiveByKW',
    data: {
      keyword: keyword,
    },
    success: function(res) {
      console.log(res.result.data);
      that.setData({
        employees: res.result.data
      });
      wx.hideLoading();
    },
    fail: function(res) {
      console.log('Error fetching users:', res);
      wx.hideLoading();
    }
  });
},
  showModal() {
    this.setData({
      modalName: 'Modal'
    })
  },
  hideModal() {
    this.setData({
      modalName: null
    })
  },
  onShow: function(){
    console.log( getApp().globalData.role);
    this.fetchUsers();
  },

  fetchUsers: function() {
    wx.showLoading({
      title: '',
    });
    let that = this;
    wx.cloud.callFunction({
      name: 'getArchive',
      success: function(res) {
        console.log(res.result.data);
        that.setData({
          employees: res.result.data
        });
        wx.hideLoading();
      },
      fail: function(res) {
        console.log('Error fetching users:', res);
        wx.hideLoading();
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
