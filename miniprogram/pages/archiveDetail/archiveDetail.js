Page({
  data: {
    form: {
      _id: '',
      name: '',
      birthdate: '',
      // other attributes...
    },
    // 管理员可以解禁disabled
    disabled: true, 
    // archiveNew的签名预留variable，预计也要部分传入form
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
  // onload自动获取信息
  onLoad: function (options) {
    this.setData({
      form: JSON.parse(options.formStr)
    })
    // Get _id from options
    const id = this.data.form._id;
    // Set _id as page data
    // Fetch employee details with _id...

    // Confirm Role
    this.setData({
      role: getApp().globalData.role
    });
    // 原属archiveNew代码
    var context1 = wx.createCanvasContext('handWriting1');
    context1.setStrokeStyle("#000000")
    context1.setLineWidth(3);
    this.setData({
      context1: context1,
    })
  },
  // 管理员点击修改
  onEditTap: function() {
    if(this.data.role=="admin" || role=="viceadmin"){
      this.setData({
        disabled: false,
      });
    }
  },


  //原属archiveNew的function
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



// 提交
submitForm: function() {
  let self = this;
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
},





//上传头图
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
                      'form.imgUrl': res.fileID
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
});
