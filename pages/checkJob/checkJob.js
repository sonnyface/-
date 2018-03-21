// pages/publishJob/publishJob.js
var request = require('../../utils/request.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },
  // 未通过的跳转

  changTasp(e) {
    var that = this;
    if (that.data.currentIndex == e.currentTarget.dataset.index) {
      return false;
    } else {
      that.setData({
        currentIndex: e.currentTarget.dataset.index
      })
    }
    if (e.currentTarget.dataset.index==5){
      wx.request({
        url: request.dataUrl + '/api/User/leaveTasklist',
        data: {
          wx_code: wx.getStorageSync('session'),
        },       
        method: 'GET',      
        success: function(res) {
          console.log(res)
          if (res.data.status==1){
            that.setData({
              doneDel:res.data.data
            })
          }else{
            // wx.showToast({
            //   title: res.data.data,
            // })
          }
        }
      })
    }

    this.getData();
  },
  // 雇主审核任务列表
  getData: function () {
    var that = this;
    var url = request.dataUrl + '/api/User/checktasklist';
    console.log(that.data.currentIndex)
    var params = {
      wx_code: wx.getStorageSync('session'),
      order_status: that.data.currentIndex,
      p:1

    }
    request.requestLoading(url, params, '正在加载数据', function (res) {
      //res就是我们请求接口返回的数据
      console.log(res)

      var noCheck = [];
      var noPass = [];
      var doneCheck = [];

      for (var i in res.data) {
       var  nochecking=[];
        if (res.data[i].order_status == 0 ) {
          nochecking.push(res.data[i])
          console.log(nochecking)
          for (var j in nochecking){
            if (nochecking[j].is_check == 1) {
              noCheck.push(nochecking[j])
            }
          }       
        } else if (res.data[i].order_status == 3) {
          noPass.push(res.data[i])
        } else if (res.data[i].order_status == 4) {

          doneCheck.push(res.data[i])
        }
      }
      

      that.setData({
        noCheck: noCheck,
        noPass: noPass,
        doneCheck: doneCheck

      })

    }, function (res) {
      wx.showToast({
        title: '加载数据失败',
      })
    })
  },
  toDetail(e) {
    console.log(e.currentTarget.dataset.id);
    console.log(e.currentTarget.dataset.title)
    wx.navigateTo({
      url: '../checkDetail/checkDetail?id=' + e.currentTarget.dataset.id + '&title=' + e.currentTarget.dataset.title,
    })
  },
  checkNopass(e) {
    console.log(e.currentTarget.dataset.id);
    console.log(e.currentTarget.dataset.title)
    wx.navigateTo({
      url: '../checkNopass/checkNopass?id=' + e.currentTarget.dataset.id + '&title=' + e.currentTarget.dataset.title,
    })
  },
  jilizhifu(e) {
    console.log(e)
    var that = this;
    wx.navigateTo({
      url: '../zhifufangshi/zhifufangshi?id=' + e.currentTarget.dataset.id  
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