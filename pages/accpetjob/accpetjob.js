// pages/accpetjob/accpetjob.js
var request = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 1, 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();   
  },
 // 点击tab切换
  changTasp(e){
    var that=this;
    // console.log(e)
    if (that.data.currentIndex == e.currentTarget.dataset.index){
      return false;
    }else{
      that.setData({
        currentIndex: e.currentTarget.dataset.index
      })
    }
  },
  toDetail(e){
    wx.navigateTo({
      url: '../unfinishJob/unfinishJob?id=' + e.currentTarget.dataset.id + '&title=' + e.currentTarget.dataset.title,
    })

  },

  // 接受方任务列表
  getData: function () {
    var that = this;
    var url = request.dataUrl + '/api/User/myaccepttask';
    var params = {
      wx_code: wx.getStorageSync('session'),
      p:'1'
    }
    request.requestLoading(url, params, '正在加载数据', function (res) {
      //res就是我们请求接口返回的数据
      console.log(res)

      var finish=[]
      var isgoing=[]
      var nofinish=[]
      for(var i in res.data){
        if (res.data[i].order_status ==0){
          isgoing.push(res.data[i]) 
        } else if (res.data[i].order_status == 3){
          nofinish.push(res.data[i])
        } else if (res.data[i].order_status == 4) {
          finish.push(res.data[i])
       }
      }
      console.log(nofinish)
      that.setData({
        finish: finish ,
        isgoing: isgoing,
        nofinish: nofinish

      })
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
    this.getData();
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
  // 下拉刷新
  onPullDownRefresh: function (e) {
    var that = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载   
    console.log('下拉刷新');
    that.setData({
      currentPage: 1,
      hideHeader: false
    })
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
    that.getData();

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