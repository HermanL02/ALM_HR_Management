// archiveNew.js
Page({
    data: {
      // 预留上传至云函数
      form: {
        declarationChecked: false,
        imgUrl: '',
      },
      // 签名预留variable，预计也要部分传入form
      context1: null,
      hasDraw:false, //默认没有画
      src:null,
      avatar:'',
      // 预留选项
      educationTypes: ['统招', '自考', '成人'],
      genderArray: ['男', '女'],
      IDtypes: ['身份证', '驾照', '护照', '其他'],
      householdNatures: ['农', '非农'],
      canDrives: ['是', '否'],
      hasChilds: ['是', '否'],
      supportDeployments: ['是', '否'],
      availabilities: ['1周内', '2周内', '1月内', '2月内', '其他'],

    },
    // 所有输入性change统一函数
    handleInputChange: function(e) {
      let field = e.currentTarget.dataset.field;  // 获取字段名称
      console.log(field);
      let value = e.detail.value;  // 获取输入的值
      this.setData({
        [`form.${field}`]: value
      });
    },  
    // 所有picker的函数
    handleSupportDeploymentChange(e) {
      const { value } = e.detail;
      this.setData({
        'form.currentSupportDeployment': this.data.supportDeployments[value]
      });
    }, 
    handleAvailabilityChange: function(e) {
      console.log('handleAvailabilityChange is called');
      this.setData({
        'form.currentAvailability': this.data.availabilities[e.detail.value]
      });
    },
    handleCanDriveChange(e) {
      const { value } = e.detail;
      this.setData({
        'form.currentCanDrive': this.data.canDrives[value]
      });
    },
    education1TypeChange(e) {
      const { value } = e.detail;
      this.setData({
        'form.education1Type': this.data.educationTypes[value]
      });
    },
    confirmSubmit: function(e) {
      let self = this;
      wx.showModal({
        title: '确认',
        content: '您确认授权沈阳爱乐盟工程顾问有限公司收集并处理您的个人信息吗？我们将仅将您的信息用于处理入职申请以及人才库共享的相关目的。请您在理解并同意我们的数据处理政策后进行确认。',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定');
            // 如果用户点击确定，你可以在这里提交表单
            self.submitForm();
          } else if (res.cancel) {
            console.log('用户点击取消');
            // 如果用户点击取消，你可以在这里做一些清理工作
            // 比如重置表单
          }
        }
      })
    },
    education2TypeChange(e) {
      const { value } = e.detail;
      this.setData({
        'form.education2Type': this.data.educationTypes[value]
      });
    },
    handleHasChildChange(e) {
      const { value } = e.detail;
      this.setData({
        'form.currentHasChild': this.data.hasChilds[value]
      });
    },
    handleHouseholdNatureChange(e) {
      const { value } = e.detail;
      this.setData({
        'form.currentHouseholdNature': this.data.householdNatures[value]
      });
    },
    handlePickerChange(e) {
      const { value } = e.detail;
      this.setData({
        'form.currentIDtype': this.data.IDtypes[value]
      });
    },
    bindBirthChange: function(e) {
      this.setData({
        'form.birthdate': e.detail.value
      });
    },
    bindEduStartDate1: function(e) {
      this.setData({
        'form.EduStartDate1': e.detail.value
      });
    },
    bindEduEndDate1: function(e) {
      this.setData({
        'form.EduEndDate1': e.detail.value
      });
    },
    bindEduStartDate2: function(e) {
      this.setData({
        'form.EduStartDate2': e.detail.value
      });
    },
    bindEduEndDate2: function(e) {
      this.setData({
        'form.EduEndDate2': e.detail.value
      });
    },
    bindWorkStartDate1: function(e) {
      this.setData({
        'form.WorkStartDate1': e.detail.value
      });
    },
    bindWorkEndDate1: function(e) {
      this.setData({
        'form.WorkEndDate1': e.detail.value
      });
    },
    bindWorkStartDate2: function(e) {
      this.setData({
        'form.WorkStartDate2': e.detail.value
      });
    },
    bindWorkEndDate2: function(e) {
      this.setData({
        'form.WorkEndDate2': e.detail.value
      });
    },
    bindWorkStartDate3: function(e) {
      this.setData({
        'form.WorkStartDate3': e.detail.value
      });
    },
    bindWorkEndDate3: function(e) {
      this.setData({
        'form.WorkEndDate3': e.detail.value
      });
    },
    bindWorkStartDate4: function(e) {
      this.setData({
        'form.WorkStartDate4': e.detail.value
      });
    },
    bindWorkEndDate4: function(e) {
      this.setData({
        'form.WorkEndDate4': e.detail.value
      });
    },
    genderChange(e) {
      this.setData({
        'form.genderIndex': e.detail.value,
      });
    },
    // Checkbox change
  // 监听复选框状态改变的事件
  checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    // 在这里添加你的代码，比如改变数据或者显示提示等
  },
  uploadSign:function(){
    return new Promise((resolve, reject) => {
    // 上传文件到云存储
    let that = this;
    wx.cloud.uploadFile({
    cloudPath: 'archive/sign/' + new Date().getTime() + '.png', // 这里请按你的需求自定义路径和文件名
    filePath: that.data.src,
    success: res => {
      that.setData({
        'form.signature': res.fileID
      })
      resolve();
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '上传签名失败，请确认已签名',
      })
      console.error('[上传签名] 失败：', err);

      reject(err);
    }
    })
    })
  },
  uploadImg:function(){
    let that = this;
    return new Promise((resolve, reject) => {
  if (that.data.localPath === undefined) {
    wx.showToast({
        icon: 'none',
        title: '上传头像失败，请确认已上传头像',
    });
    reject(new Error('localPath is undefined'));
  }
 // 生成一个随机的文件路径
 const cloudPath = 'headImg/' + Date.now() + '-' + Math.floor(Math.random(0, 1) * 1000) + that.data.localPath.match(/\.[^.]+?$/)[0]
 wx.cloud.uploadFile({
  cloudPath, //文件存储的路径
  filePath: that.data.localPath, // 文件路径
  success: res => {
      that.setData({
          'form.imgUrl': res.fileID
      })
    resolve();
  },
  fail: err => {
      wx.showToast({
          icon: 'none',
          title: '上传头像失败，请确认已上传头像',
      })
      console.error('[上传头像] 失败：', err)
      reject(err);
  }
})

})
  },
    
    
    // 提交
    submitForm: async function() {
      let self = this;
      try {
        await Promise.all([this.uploadImg(), this.uploadSign()]);
      console.log(this.data.form);
      wx.getUserInfo({
        success: function(userInfoRes) {
          wx.showLoading({
            title: '正在提交...',
          });
          wx.cloud.callFunction({
            name:'addArchive',
            data: {
              ...self.data.form,
              openid: userInfoRes.userInfo.openid
            },
            
            success: function(cloudRes) {
              console.log(cloudRes);
              if (cloudRes.result && cloudRes.result.statusCode == 200) {
                wx.showToast({
                  title: '成功提交',
                  icon: 'success',
                  duration: 2000
                });
                self.setData({
                  form: {}
                });
                
              } else {
                console.log(cloudRes.result.statusCode);
                wx.showToast({
                  title: '提交失败',
                  icon: 'none',
                  duration: 2000
                });
              }
            },
            fail: function(error) {
              wx.showToast({
                title: '网络错误',
                icon: 'none',
                duration: 2000
              });
            }
          });
        }
      });
    }catch(err){
      console.error('[上传表格] 失败：', err)
    }
  },
  


    // 签字部分
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
        console.log("签字无法读取，请重新签字")
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

//上传头图
    SelectHeadImg: function() {
      console.log("upload");
      var that = this
      wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success(res) {
            const tempFilePaths = res.tempFilePaths[0]
             that.setData({
               localPath: tempFilePaths
              }); 
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

