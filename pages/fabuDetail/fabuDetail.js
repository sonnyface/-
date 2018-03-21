// pages/fabuDetail/fabuDetail.js


var app = getApp();
// var Bmob = require('../../utils/bmob.js');
var utils = require('../../utils/util.js');
var request = require('../../utils/request.js');

Page({
  data: {
    id: '',
    isClick: false,
    isClicked: false,
    istap: false,
    istaped: false,
    dates: '',
    times: '',
    date: '',
    time: '',
    sex: '男',
    address: '' 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    console.log(wx.getStorageSync('session'))
  },
  //  点击日期组件确定事件  
  bindDateChange: function (e) {
    console.log(e)

    this.setData({
      dates: e.detail.value,
      isClick: true
    })
  },
  //  点击时间组件确定事件  
  bindTimeChange: function (e) {
    console.log(e)
    this.setData({
      times: e.detail.value,
      istap: true
    })
  },
  //  点击日期组件确定事件  
  bindDateChanged: function (e) {
    console.log(e)

    this.setData({
      date: e.detail.value,
      isClicked: true
    })
  },
  //  点击时间组件确定事件  
  bindTimeChanged: function (e) {
    console.log(e)
    this.setData({
      time: e.detail.value,
      istaped: true
    })
  },
  // 性别的选择  
  radioChange(e) {
    // console.log(e.detail.value)
    this.setData({
      sex: e.detail.value
    })
  },
  formSubmit(e) {
    var that = this;
    console.log(e)
    var addr = that.data.address    
    console.log(addr)
    var goods_content = e.detail.value.goods_content
    var goods_name = e.detail.value.goods_name
    var sex = that.data.sex;
    var peopleNum = e.detail.value.peopleNum
    var phone = e.detail.value.phone
    var shop_price = e.detail.value.shop_price
    var start_time = that.data.dates + ' ' + that.data.times
    var end_time = that.data.date + ' ' + that.data.time
    if (e.detail.value.age2 > e.detail.value.age1) {
      var age = e.detail.value.age1 + '-' + e.detail.value.age2
    }

    if ( age == '' || goods_content == '' || goods_name == '' || sex == '' || shop_price == '' || start_time.length == 1 || end_time.length == 1 || peopleNum == '' || phone == '') {
      wx.showToast({
        title: '数据填写完整',
        image: '../../image/fail.png',
        duration: 2000
      })
    } else {      
      var myreg = /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|18[0-9]|17[0-9]|19[0-9])\d{8}$/;
      if (!myreg.test(phone)) {
        wx.showToast({
          title: '手机号有误！',
          image: '../../image/fail.png',
          duration: 1500
        })
        return false;
      } else {

       
        wx.request({
          url: request.dataUrl + '/api/User/addTask',
          data: {
            wx_code: wx.getStorageSync('session'),
            cat_id: that.data.id,
            addr: addr,
            age: age,
            goods_content: goods_content,
            goods_name: goods_name,
            sex: sex,
            mobile: phone,
            shop_price: shop_price,
            take_people: peopleNum,
            end_time: end_time,
            start_time: start_time
          },
          method: 'POST',
          success: function (res) {
            console.log(res)
            if (res.data.status == 1) {
              wx.showToast({
                title: res.data.data,
                image: '../../image/success.png',
                duration: 1000,
                success: function () {
                  setTimeout(function () {
                    wx.redirectTo({
                      url: '../publishJob/publishJob',
                    })
                  }, 1500)

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

    }

  },
  // 调取地图 获取当前地理位置 
  toAddMap: function () {
    this.chooseLocation()
  },

  // 打开地图选择位置
  chooseLocation: function () {
    var that = this;
    wx.chooseLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (ret) {
       
        that.setData({
          address: ret.address
          // title: gourmet_title
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