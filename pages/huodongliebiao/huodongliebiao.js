// pages/huodongliebiao/huodongliebiao.js
var request = require('../../utils/request.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    params:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.getData();
  },

  // //获取接口   轮播图 
  getData: function () {
    var that = this;
    var url = request.dataUrl + '/api/Activity/promote_goods';
    request.requestLoading(url, that.data.params, '正在加载数据', function (res) {
      //res就是我们请求接口返回的数据
    
      for(var i in res.data){
        res.data[i].original_img = request.dataUrl + res.data[i].original_img
      }
      console.log(res)
      that.setData({       
        lists: res.data
      })

    }, function (res) {
      wx.showToast({
        title: '加载数据失败',
      })
    })
    
  },
  huodongguanggao(e){
    wx.navigateTo({
      url: '../huodongguanggao/huodongguanggao?id=' + e.currentTarget.dataset.id,
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