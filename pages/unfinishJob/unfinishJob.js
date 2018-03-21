// pages/unfinishJob/unfinishJob.js

const app = getApp()
var sourceType = [['camera'], ['album'], ['camera', 'album']]

var request = require('../../utils/request.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;

// appid和密钥
// var appid = 'wx5fcb98c3688fe55b'
// var appSecret ='26c947979137978d4248e83edd544adb'

Page({
  data: {
    files: [],
    id: '',
    isClick: true,
    isclick: false,
    textVal: '',
    openID: '',
    token:'',
    pic:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)  
    var that = this;
    that.token();

    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: '3RGBZ-SZ4KR-3BDWV-WXQZI-HXQEE-CZBVD' //此处使用你自己申请的key
    })

    // 获取标题
    wx.setNavigationBarTitle({
      title: options.title,
    })
    wx.request({
      url: request.dataUrl + '/api/User/accepttaskDetail',
      data: {
        wx_code: wx.getStorageSync('session'),
        id: options.id
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        that.setData({
          list: res.data.data,
          id: options.id,
          openID: res.data.data.uopenid
        })
      }
    })

  },

   // 获取七牛token
  token(){
    var that=this;
    wx.request({
      url: request.dataUrl + '/api/User/keepdata',
      data: '',
      method: 'GET',
      success: function (res) {   
        that.setData({
          token: res.data.msg
        })
      }
    })

  },
  // 选取照片  上传七牛
  chooseImg: function (e) {
    var that = this;    
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)

        that.setData({
          files: that.data.files.concat(res.tempFilePaths),
          isClick: false
        });

        // 本次手机操作的图片临时地址
        var filePath = res.tempFilePaths[0];
        // fileName 为上传七牛云存储后的远程文件名
        var fileName = Math.random().toString(36).substr(2);

        // 微信 API 上传七牛图片    
        wx.uploadFile({
          url: 'https://up.qbox.me',
          filePath: filePath,
          name: 'file',
          count: 1,
          formData: {
            'token': that.data.token,
            key: fileName
          },
          success: function (res) {
            // console.log(res);
            var dataObject = JSON.parse(res.data);
            var imageUrl = 'http://ozpexz78z.bkt.clouddn.com/' + dataObject.key;
            
            that.setData({
              pic: imageUrl,
            })
            
          },
          fail: function (error) {
            console.error(error);
          }
        })
      }
    })
  },
  // 预览
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  // 点击完成任务
  toindex(e) {
    var that = this;
    console.log(e)
    wx.request({
      url: request.dataUrl + '/api/User/doneTask',
      data: {
        wx_code: wx.getStorageSync('session'),
        id: that.data.id,
        pic: that.data.pic,
        formId: e.detail.formId
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data.status == 1) {
          wx.showToast({
            title: '提交完成',
            duration: 1500,
            image: '../../image/success.png',
            success: function () {
              setTimeout(function () {
                wx.navigateBack()
              }, 2000)
            }
          })
        } else {
          wx.showToast({
            title: res.data.data,
            image: '../../image/fail.png',
            duration: 1500

          })
        }

      }
    })
  },

  // 确定取消任务
  cancelJob(e) {
    var that = this;
    that.setData({
      isclick: true
    })
  },
  formSubmit(e) {
    var that = this;
    console.log(wx.getStorageSync('session'))
    console.log(e.detail.formId)
    console.log(that.data.id)
    console.log(e.detail.value.neirong)
     
    wx.showModal({
      content: '任务开始前2小时内取消该任务扣除信用值5分，是否确定取消该任务？',
      success: function (res) {
        console.log(res)
        if (res.confirm) {
          if (e.detail.value.neirong.length>0){       
          wx.request({
            url: request.dataUrl + '/api/User/givedoneTask',
            data: {
              wx_code: wx.getStorageSync('session'),
              id: that.data.id,
              pic: e.detail.value.neirong,
              formId: e.detail.formId
            },
            header: {},
            method: 'post',
            success: function (res) {
              console.log(res)
              that.setData({
                isclick: false
              })
              if (res.data.status == 1) {
                wx.showToast({
                  title: '取消任务成功',
                  image: '../../image/success.png',
                  duration: 1000,
                  success: function () {
                    setTimeout(function () {
                      wx.navigateBack()
                    }, 1500)
                  }
                })
              } else {
                wx.showToast({
                  title: res.data.data,
                  image: '../../image/fail.png',
                  duration: 1000,
                  success: function () {
                    setTimeout(function () {
                      wx.navigateBack()
                    }, 1500)
                  }
                })
              }
            }
          })
          }else{
            wx.showToast({
              title: '请提交取消原因',
              image: '../../image/fail.png',
              duration: 1000,
              success: function () {
                setTimeout(function () {                
                }, 1500)
              }
            })
          }
        } else {
          wx.navigateBack()
        }
      }
    })
  },
  // 调用腾讯地图api
  addMap(e) {
    //  console.log(e)
    var add = e.currentTarget.dataset.add;
    console.log(add)

    // 调用腾讯接口
    qqmapsdk.geocoder({
      address: add,
      success: function (res) {
        console.log(res);

        var latitude = res.result.location.lat;
        var longitude = res.result.location.lng;
        //  console.log(latitude, longitude);

        wx.getLocation({
          type: 'wgs84',
          success: function (res) {
            var latnum = Number(latitude);
            var longnum = Number(longitude);
            wx.openLocation({
              latitude: latnum,
              longitude: longnum,
              scale: 28,
              name: '任务目的地'
            })
          }
        })

      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        // console.log(res);
      }
    });




  },
  formSub(e){


  },
  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})