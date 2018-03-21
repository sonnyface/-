// pages/huodongguanggao/huodongguanggao.js
var request = require('../../utils/request.js');
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    params: '',
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    id: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.id
    })
    that.getData();
  },

  // 活动详情
  getData: function () {
    var that = this;
    // console.log(that.data.id)
    var url = request.dataUrl + '/api/Activity/promoteInfo';
    var params = {
      id: that.data.id
    }
    request.requestLoading(url, params, '正在加载数据', function (res) {
      //res就是我们请求接口返回的数据
      console.log(res)
      res.data.prom_img = request.dataUrl + res.data.prom_img
      res.data.start_time = util.toDate(res.data.start_time)
      res.data.end_time = util.toDate(res.data.end_time)

      that.setData({
        detaLis: res.data
      })

    }, function (res) {
      wx.showToast({
        title: '加载数据失败',
      })
    })
  },

  toindex(e) {
    var that = this;
    wx.request({
      url: request.dataUrl + '/api/Activity/takeActivity',
      data: {
        id: that.data.id,
        wx_code: wx.getStorageSync('session')
      },
      success: function (res) {
        console.log(res)
        if (res.data.status == 1) {
          wx.showToast({
            title: res.data.data,
            image: '../../image/success.png',
            duration: 1500,
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
            duration: 2000
          })
        }
      }
    })

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