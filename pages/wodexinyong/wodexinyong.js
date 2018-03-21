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
    var that=this;

    that.xinyong(); 
    that.getData();
  
  },
  // 我的信用
  xinyong: function () {
    var that = this;

    var url = request.dataUrl + '/api/User/myrest';
    var params={
      wx_code: wx.getStorageSync('session')      
    }
    request.requestLoading(url,params, '正在加载数据', function (res) {
      console.log(res)
      that.setData({
        content: res.data
      })   

    }, function (res) {
      wx.showToast({
        title: '加载数据失败',
      })
    })
  },

  //信用列表
  getData: function () {
    var that = this;  
    var url = request.dataUrl + '/api/User/creditList';
    var params={
      wx_code:wx.getStorageSync('session')
    }
    request.requestLoading(url, params, '正在加载数据', function (res) {
      //res就是我们请求接口返回的数据
     console.log(res)
     if (res.data !='暂时没有数据'){
       that.setData({
         lists: res.data
       })
     }     

    }, function (res) {
      wx.showToast({
        title: '加载数据失败',
      })
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