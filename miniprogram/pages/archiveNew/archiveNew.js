// archiveNew.js
Page({
  submitForm: function(e) {
    console.log(e.detail.value);  
    let formData = e.detail.value;
    wx.cloud.callFunction({
      name:'addArchive',
      data:{
        name: formData.name,
        birthdate: formData.birthdate,
        openid:wx.getUserInfo().openid,
      }
    })
  },
    data: {
      context1: null,
      hasDraw:false, //默认没有画
      src:null,
      avatar:''
    },
    onLoad: function() {
      var context1 = wx.createCanvasContext('handWriting1');
      context1.setStrokeStyle("#000000")
      context1.setLineWidth(3);
      this.setData({
        context1: context1,
      })
    },
    touchstart1: function(e) {
      var context1 = this.data.context1;
      context1.moveTo(e.touches[0].x, e.touches[0].y);
      this.setData({
        context1: context1,
        hasDraw : true, //要签字了
      });
    },
    touchmove1: function(e) {
      var x = e.touches[0].x;
      var y = e.touches[0].y;
      var context1 = this.data.context1;
      context1.setLineWidth(3);
      context1.lineTo(x, y);
      context1.stroke();
      context1.setLineCap('round');
      context1.draw(true);
      context1.moveTo(x, y);
    },
    reSign1: function() { //重新画
      var that = this;
      var context1 = that.data.context1;
      context1.draw(); //清空画布
      that.setData({
        hasDraw: false, //没有画
        src: null
      });
    },
    sign1ok: function () {
      var that = this;
      if(!that.data.hasDraw){
        console.log("签字是空白的 没有签字")
      }else{
        var context1 = that.data.context1;
        context1.draw(true, wx.canvasToTempFilePath({
          canvasId: 'handWriting1',
          success(res) {
            console.log(res.tempFilePath) //得到了图片下面自己写上传吧
            that.setData({
              src: res.tempFilePath
            })
             
          }
        }))
      }
    },


    uploadHeadImg: function() {
      let a = this;
      wx.showActionSheet({
          itemList: [ "从相册中选择", "拍照" ],
          itemColor: "#f7982a",
          success: function(e) {
          //album:相册   //camera拍照
              e.cancel || (0 == e.tapIndex ? a.chooseWxImageShop("album") : 1 == e.tapIndex && a.chooseWxImageShop("camera"));
          }
      });
  },
  chooseWxImageShop: function(a) {
    var e = this;
    wx.chooseImage({
        sizeType: [ "original", "compressed" ],
        sourceType: [ a ],//类型
        count:1,
        success: function(a) {
            if(a.tempFiles[0].size> 2097152){
                wx.showModal({
                    title: "提示",
                    content: "选择的图片过大，请上传不超过2M的图片",
                    showCancel: !1,
                    success: function(a) {
                        a.confirm;
                    }
                })
            }else{
                //把图片上传到服务器
                e.upload_file(a.tempFilePaths[0])
            }
        }
    });
},
upload_file: function(e) {
  wx.showLoading({
      title: "上传中"
  });
  wx.uploadFile({
      url:url,
      filePath: e,//图片路径
      name: "user_avatar",
      formData: {
          token: a.globalData.token,
          user_avatar: "filePath"
      },
      header: {
          "Content-Type": "multipart/form-data"
      },
      success: function(a) {
          wx.hideLoading();
          wx.showToast({
              title: "上传成功",
              icon: "success",
              duration: 3000
          });
      },
      fail: function(a) {
          wx.hideLoading();
          wx.showToast({
              title: "上传失败",
              icon: "none",
              duration: 3000
          });
      }
  });
},
  });

