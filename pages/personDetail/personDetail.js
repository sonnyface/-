// pages/personDetail/personDetail.js
var app = getApp()
var request = require('../../utils/request.js');
var sourceType = [['camera'], ['album'], ['camera', 'album']]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isClick: true,
    istap: true,
    files: [],
    file: [],
    token:'',
    pic_a:'',
    pic_b:'',
    lists:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    that.token();
    that.personDetail()
    
  },
   //获取个人信息 
  personDetail(){
    var that=this;
    wx.request({
      url: request.dataUrl + '/api/User/edit',
      data: {
        wx_code: wx.getStorageSync('session')
      },
      method: 'GET',
      success: function (res) {

        console.log(res.data)            
        that.setData({
          lists: res.data.data,         
        })
      }

    })
  },
  // 获取七牛token
  token(){
    var that=this;
    wx.request({
      url: request.dataUrl + '/api/User/keepdata',
      data: '',
      method: 'GET',
      success: function (res) {   
        that.setData({
          token: res.data.msg
        })
      }
    })

  },
  // 选取照片 身份证正面 上传七牛
  chooseImg: function (e) {
    var that = this;    
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)

        that.setData({
          files: that.data.files.concat(res.tempFilePaths),
          isClick: false
        });

        // 本次手机操作的图片临时地址
        var filePath = res.tempFilePaths[0];
        // fileName 为上传七牛云存储后的远程文件名
        var fileName = Math.random().toString(36).substr(2);

        // 微信 API 上传七牛图片    
        wx.uploadFile({
          url: 'https://up.qbox.me',
          filePath: filePath,
          name: 'file',
          count: 1,
          formData: {
            'token': that.data.token,
            key: fileName
          },
          success: function (res) {
            // console.log(res);
            var dataObject = JSON.parse(res.data);
            var imageUrl = 'http://ozpexz78z.bkt.clouddn.com/' + dataObject.key;
            
            that.setData({
              pic_a: imageUrl,
            })
            
          },
          fail: function (error) {
            console.error(error);
          }
        })
      }
    })
  },

  // 预览
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  // 选取照片 身份证反面 上传七牛
  chooseImging: function (e) {
    var that = this;  
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)

        that.setData({
          file: that.data.file.concat(res.tempFilePaths),
          istap: false
        });

        // 本次手机操作的图片临时地址
        var filePath = res.tempFilePaths[0];
        // fileName 为上传七牛云存储后的远程文件名
        var fileName = Math.random().toString(36).substr(2);

        // 微信 API 上传七牛图片    
        wx.uploadFile({
          url: 'https://up.qbox.me',
          filePath: filePath,
          name: 'file',
          count: 1,
          formData: {
            'token': that.data.token,
            key: fileName
          },
          success: function (res) {
            // console.log(res);
            var dataObject = JSON.parse(res.data);
            var imageUrl = 'http://ozpexz78z.bkt.clouddn.com/' + dataObject.key;

            that.setData({
              pic_b:imageUrl ,
            })

          },
          fail: function (error) {
            console.error(error);
          }
        })
      }
    })
  },
  // 预览
  previewImaging: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.file // 需要预览的图片http链接列表
    })
  },

  formSubmit(e) {
    var that = this;
    // console.log(e)
    var username = e.detail.value.username
    var mobile = e.detail.value.mobile
    var userIdNo = e.detail.value.userIdNo
    var addr = e.detail.value.addr
    var sex = e.detail.value.sex 
    if (that.data.pic_a==''){
      var pic01 = that.data.lists.pic_a
    }else{
      var pic01=that.data.pic_a
    }

    if (that.data.pic_b == '') {  ``
      var pic02 = that.data.lists.pic_b
    }else{
      var pic02 = that.data.pic_b
    }

    console.log(pic01)
    console.log(pic02)
    

    if (username.length == 0 || mobile.length == 0 || userIdNo.length == 0 || addr.length == 0 || sex.length == 0) {
      wx.showToast({
        title: '信息不能为空',
        // iconType:'warn',
        image: '../../image/fail.png',
        duration: 2000
      })
      // return false;
    } else {
      var myreg = /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|18[0-9]|17[0-9]|19[0-9])\d{8}$/;
      if (!myreg.test(mobile)) {
        wx.showToast({
          title: '手机号有误！',
          image: '../../image/fail.png',
          duration: 1500
        })
        return false;
      } else {
        var id_card =
          /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
        if (!id_card.test(userIdNo)) {
          wx.showToast({
            title: '身份证号有误！',
            image: '../../image/fail.png',
            duration: 1500
          })
          return false;
        } else {
          if (sex == "男") {
            sex = '1';
          } else if (sex == "女") {
            sex = '2'
          }
          wx.request({
            url: request.dataUrl + '/api/User/edit',
            data: {
              wx_code: wx.getStorageSync('session'),
              username: e.detail.value.username,
              mobile: e.detail.value.mobile,
              userIdNo: e.detail.value.userIdNo,
              addr: e.detail.value.addr,
              pic_a: pic01,
              pic_b: pic02,
              sex:sex
            },
            method: 'POST',
            success: function (res) {
              console.log(res.data)
              if (res.data.status == 1) {
                wx.showToast({
                  image: '../../image/success.png',
                  title: '完善信息成功',
                  duration: 1500,
                  success: function () {
                    that.setData({
                      list: res.data.data
                    })
                    setTimeout(function () {
                      wx.navigateBack()
                    }, 2000)
                  }
                })
              } else {
                wx.showToast({
                  image: '../../image/fail.png',
                  title: res.data.data,
                })
              }
            }
          })
        }

      }
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