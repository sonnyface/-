// pages/zhichumingxi/zhichumingxi.js
var request = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    this.getData();
  },
  getData() {
    var that=this
    wx.request({
      url: request.dataUrl + '/api/User/accountLog',
      data: {
        wx_code: wx.getStorageSync('session')       
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
         if (res.data.status == 1) {
           var lis = res.data.data
           for(var i in lis){
             if (lis[i].desc =='余额支付'){
               lis[i].user_money = '-' + lis[i].user_money
             } else if (lis[i].desc == '用户提现') {
               lis[i].user_money =  lis[i].user_money
             } else if (lis[i].desc == '在线充值') {
               lis[i].user_money = '+' + lis[i].user_money
             } else {
               lis[i].user_money = '+' + lis[i].user_money
             }
           }

           that.setData({
             list:lis
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