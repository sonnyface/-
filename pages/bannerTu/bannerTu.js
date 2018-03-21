var util = require('../../utils/util.js');
var request = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    price: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.id
    })
    console.log(options.id)
    wx.request({
      url: request.dataUrl + '/api/Goods/goodsInfo?id=' + options.id,
      data: '',
      success: function (res) {
        console.log(res.data.data)
        that.setData({
          detaiLis: res.data.data,
          price: res.data.data.shop_price
        })
      }
    })
  },
  toindex(e) {
    var that = this;
    wx.request({
      url: request.dataUrl + '/api/User/takeTask',
      data: {
        id: that.data.id,
        wx_code: wx.getStorageSync('session'),
        amount: that.data.price
      },
      success: function (res) {
        console.log(res.data.status)
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