// archiveNew.js
Page({
  submitForm: function(e) {
    console.log(e.detail.value);  
    let formData = e.detail.value;
    wx.cloud.callFunction({
      name:'addArchive',
      data:{
        name: formData.name,
        genderIndex: genderIndex,
        birthdate: this.data.birthdate,
        ethnicity: formData.ethnicity,
        height:formData.height,
        weight:formData.weight,
        politicalStatus:formData.politicalStatus,
        bloodType:formData.bloodType,
        professionalTitle:formData.professionalTitle,
        IDtype: this.data.currentIDtype,
        currentHouseholdNature: this.data.currentHouseholdNature,
        openid:wx.getUserInfo().openid,
      }
    })
  },
    data: {
      imgUrl: '',
      context1: null,
      hasDraw:false, //默认没有画
      src:null,
      avatar:'',
      genderArray: ['男', '女'],
      genderIndex: 0,
      birthdate: '请选择日期',
      IDtypes: ['身份证', '驾照', '护照', '其他'],
      currentIDtype: '请选择证件类型',
      householdNatures: ['农', '非农'],
    currentHouseholdNature: '请选择户籍性质',
    canDrives: ['是', '否'],
    currentCanDrive: '请选择是否可熟练驾驶',
    hasChilds: ['是', '否'],
    currentHasChild: '请选择是否生育',
    supportDeployments: ['是', '否'],
    currentSupportDeployment: '请选择是否支持外派',
    availabilities: ['1周内', '2周内', '1月内', '2月内', '其他'],
    currentAvailability: '请选择可到岗时间'
    },
    handleSupportDeploymentChange(e) {
      const { value } = e.detail;
      this.setData({
        currentSupportDeployment: this.data.supportDeployments[value]
      });
    },
    
    handleAvailabilityChange(e) {
      const { value } = e.detail;
      this.setData({
        currentAvailability: this.data.availabilities[value]
      });
    },
    handleCanDriveChange(e) {
      const { value } = e.detail;
      this.setData({
        currentCanDrive: this.data.canDrives[value]
      });
    },
    handleHasChildChange(e) {
      const { value } = e.detail;
      this.setData({
        currentHasChild: this.data.hasChilds[value]
      });
    },
    handleHouseholdNatureChange(e) {
      const { value } = e.detail;
      this.setData({
        currentHouseholdNature: this.data.householdNatures[value]
      });
    },
    handlePickerChange(e) {
      const { value } = e.detail;
      this.setData({
        currentIDtype: this.data.IDtypes[value]
      });
    },
    bindBirthChange: function(e) {
      this.setData({
        birthdate: e.detail.value
      });
    },
    genderChange(e) {
      this.setData({
        genderIndex: e.detail.value,
      });
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
      var that = this
      wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success(res) {
              const tempFilePaths = res.tempFilePaths[0]
  
              // 生成一个随机的文件路径
              const cloudPath = 'headImg/' + Date.now() + '-' + Math.floor(Math.random(0, 1) * 1000) + tempFilePaths.match(/\.[^.]+?$/)[0]
              wx.cloud.uploadFile({
                  cloudPath, //文件存储的路径
                  filePath: tempFilePaths, // 文件路径
                  success: res => {
                      console.log('[上传文件] 成功：', res)
  
                      wx.showToast({
                          title: '上传成功',
                          icon: 'success'
                      })
  
                      that.setData({
                          imgUrl: res.fileID
                      })
                  },
                  fail: err => {
                      wx.showToast({
                          icon: 'none',
                          title: '上传失败',
                      })
                      console.error('[上传文件] 失败：', err)
                  }
              })
          },
          fail: err => {
              wx.showToast({
                  icon: 'none',
                  title: '选择图片失败',
              })
              console.error('[选择图片] 失败：', err)
          }
      })
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

},
  });

