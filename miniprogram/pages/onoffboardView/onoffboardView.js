Page({
  data: {
    form: null,
    type: null
  },
  onLoad: function(options) {
    let newData = JSON.parse(options.formStr);
    newData['type'] = options.type;
    this.setData(newData);

    // ...其他函数和页面配置信息...
  },
  

  // ...其他函数和页面配置信息...
});
