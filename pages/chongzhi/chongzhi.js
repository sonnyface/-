// pages/chongzhi/chongzhi.js
var request = require('../../utils/request.js');

Page({
  data: {
    money:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  money(e){
    console.log(e.detail.value)
    this.setData({
      money: e.detail.value
    })
  },
  chongzhi(e){
    console.log(e)
    var that=this;
    wx.request({      
      url: request.dataUrl + '/api/User/charge', 
      methods: 'POST',
      data: {
        wx_code: wx.getStorageSync('session'),        
        money :that.data.money
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (data) {
        console.log(data)
        var data = JSON.parse(data.data.data)
        wx.requestPayment({
          'timeStamp': data.timeStamp,
          'nonceStr': data.nonceStr,
          'package': data.package,
          'signType': data.signType,
          'paySign': data.paySign,
          'success': function (res) {
            wx.showToast({
              title: '支付成功',
              image: '../../image/success.png',
              duration: 1500,
              success: function () {
                setTimeout(function () {
                  wx.reLaunch({
                    url: '../wode/wode',
                  })
                }, 2500)
              }
            })

          },
          'fail': function (res) {
            wx.showToast({
              title: '支付失败',
              image: '../../image/fail.png',
              duration: 1500,
              success: function () {
                setTimeout(function () {
                  wx.reLaunch({
                    url: '../logs/logs'
                  })
                }, 2500)
              }
            })
          }
        })


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