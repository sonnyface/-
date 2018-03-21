var util = require('../../utils/util.js');
var request = require('../../utils/request.js');

var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    price:''  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: '3RGBZ-SZ4KR-3BDWV-WXQZI-HXQEE-CZBVD' //此处使用你自己申请的key
    })

    that.setData({
      id: options.id
    })
   
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
  // 调用腾讯地图api
  addMap(e){
    //  console.log(e)
    var add = e.currentTarget.dataset.add;  
    console.log(add)

    // 调用腾讯接口
    qqmapsdk.geocoder({
      address: add,
      success: function (res) {
        console.log(res);

        var latitude = res.result.location.lat;
        var longitude = res.result.location.lng;
        //  console.log(latitude, longitude);

        wx.getLocation({
          type: 'wgs84',
          success: function (res) {
            var latnum = Number(latitude);
            var longnum = Number(longitude);
            wx.openLocation({
              latitude: latnum,
              longitude: longnum,
              scale: 28,
              name: '任务目的地'
            })
          }
        })

      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        // console.log(res);
      }
    });




  },
  formSubmit(e) {
    var that=this;   
    console.log(e.detail.formId)
    wx.request({
      url: request.dataUrl + '/api/User/takeTask',
      data: {
        id: that.data.id,
        wx_code: wx.getStorageSync('session'),
        amount: that.data.price,
        formId: e.detail.formId
      },
      success: function (res) {
        console.log(res.data.status)
        if (res.data.status==1){
          wx.showToast({
            title: res.data.data,            
            image: '../../image/success.png',
            duration: 1500,
            success: function () {              
              setTimeout(function () {
               wx.navigateTo({             
                 url: '../accpetjob/accpetjob',
               })
              }, 2500)
            }
          })
        }else{
          wx.showToast({
            title: res.data.data,
            image: '../../image/fail.png',
            duration: 2000,
            success: function () {
              setTimeout(function () {
                wx.navigateBack()
              }, 2000)
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