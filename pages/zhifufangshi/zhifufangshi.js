// pages/zhifufangshi/zhifufangshi.js
var request=require("../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:''
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      id:options.id
    })    
    console.log(wx.getStorageSync('session'))
  },
  weixinzhifu(e){
    var that=this;
    wx.request({
      url: request.dataUrl + '/api/User/pay',
      methods: 'POST',
      data: {
        wx_code: wx.getStorageSync('session'),
        id: that.data.id,
        type:2
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (data) {
        console.log(data)
        console.log(JSON.parse(data.data.data))
        var data = JSON.parse(data.data.data)
        wx.requestPayment({
          'timeStamp': data.timeStamp,
          'nonceStr': data.nonceStr,
          'package': data.package,
          'signType': data.signType,
          'paySign': data.paySign,
          'success': function (res) {
            console.log(res)
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
  yuezhifu(e){
    console.log(e)
    var that=this
    wx.request({
      url: request.dataUrl + '/api/User/pay',
      methods: 'POST',
      data: {
        wx_code: wx.getStorageSync('session'),
        id: that.data.id,
        type:1
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (data) {             
        console.log(data)  
        if (data.data.status == 1){
          wx.showToast({
            title: data.data.data,
            image:'../../image/success.png',
            duration:1500,
            success: function () {
              setTimeout(function () {
               wx.navigateBack()
              }, 2000)
            }
          })
        }else{
          wx.showToast({
            title: data.data.data,
            image: '../../image/fail.png',
            duration:1500,
            success:function(){
              setTimeout(function(){
                  wx.navigateTo({
                    url: '../wallet/wallet',                  
                  })
              },2000)
            }
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