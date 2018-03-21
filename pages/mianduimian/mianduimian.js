// pages/mianduimian/mianduimian.js
var request = require('../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 页面配置  
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    goods_id: '',
    gsn:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取系统信息 
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  // 点击tab切换 
  swichNav: function (e) {
    console.log(e)
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  // 发布任务
  formSubmit: function (e) {
    var that = this;
    console.log(e)
    var biaoti = e.detail.value.biaoti;
    var neirong = e.detail.value.neirong;
    var yongjin = e.detail.value.yongjin;
    if (biaoti == '' || neirong == '' || yongjin == '') {
      wx.showToast({
        title: '请输入任务需求',
        image: '../../image/fail.png',
        duration: 3000
      })
    } else {
      wx.request({
        url: request.dataUrl + '/api/User/addfaceTask',
        data: {
          wx_code: wx.getStorageSync('session'),
          goods_name: biaoti,
          goods_content: neirong,
          shop_price: yongjin
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          if (res.data.status == 1) {
            wx.showModal({
              content: '发布成功生成邀请码 ' + ' ' + res.data.data.goods_sn,
              image: '../../image/success.png',
              success: function () {
               
                that.setData({
                  inputValue: ''//将data的inputValue清空
                });
             
                wx.navigateTo({                                         
                  url: '../publishJob/publishJob',
                })
              },
              fail: function () {
              }

            })
          } else {
            wx.showToast({
              title: res.data.data,
              image: '../../image/fail.png',
              duration: 3000
            })
          }
        }

      })

    }
  },
  accpetInput(e) {
    console.log(e.detail.value)
    var that = this;
    // console.log(e.detail.cursor)
    if (e.detail.cursor == 6) {
      wx.request({
        url: request.dataUrl + '/api/User/faceTaskdetails',
        data: {
          wx_code: wx.getStorageSync('session'),
          gsn : e.detail.value
        },
        method: "GET",
        success: function (res) {
          console.log(res.data.data)
          that.setData({
            acceptJob: res.data.data,
            goods_id: res.data.data.goods_id,
            gsn: e.detail.value
          })
        }
      })

    }
  },
  // 接受任务
  formsumit(e) {
    var that = this;
    console.log(e.detail.value.yaoqingma)
    console.log(e.detail.formId)
    if (e.detail.value.yaoqingma= "") {
      wx.showToast({
        title: '邀请码不能为空',
        image: '../../image/fail.png',
        duration: 3000
      })
    } else {
      wx.request({
        url: request.dataUrl + '/api/User/takefaceTask',
        data: {
          wx_code: wx.getStorageSync('session'),
          id: that.data.goods_id,
          formId:e.detail.formId
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          if (res.data.status == 1) {
            wx.showToast({
              title: res.data.data,
              image: '../../image/success.png',
              duration: 1500,
              success:function(){
                that.setData({
                  inputVal: '',//将data的inputVal清空
                  gsn:''
                });

                setTimeout(function(){
                 wx.navigateTo({              
                    url: '../accpetjob/accpetjob'
                  })
                },2000)
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
    }
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