// pages/unfinishJob/unfinishJob.js
var request = require('../../utils/request.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;

var arrImg = [];
Page({
  data: {
    id: '',
    isClick: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)  
    var that = this;

    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: '3RGBZ-SZ4KR-3BDWV-WXQZI-HXQEE-CZBVD' //此处使用你自己申请的key
    })

    // 获取标题
    wx.setNavigationBarTitle({
      title: options.title,
    })
    wx.request({
      url: request.dataUrl + '/api/User/allTaskdetails',
      data: {
        wx_code: wx.getStorageSync('session'),
        id: options.id
      },
      method: 'POST',
      success: function (res) {
        // console.log(res.data.data)        
        console.log(res.data.data)

        that.setData({
          list: res.data.data,
          id: options.id
        })
      }
    })
  },



  // 预览
  previewImage: function (e) {
    console.log(e.currentTarget.dataset.img)
    var img = []
    img.push(e.currentTarget.dataset.img)
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: img // 需要预览的图片http链接列表
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