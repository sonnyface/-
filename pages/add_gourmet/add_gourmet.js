var app = getApp();
var Bmob = require('../../utils/bmob.js');
var utils = require('../../utils/util.js');

var gourmet_address = "";
var gourmet_title = "";

Page({
    data:{     
    }
    ,onLoad: function(){
      var that = this;
  
  }
  ,onReady: function() {
    this.chooseLocation()
  }
  
  ,chooseLocation: function(){
    var that = this;
    wx.chooseLocation({
      success: function(ret){
        console.log('chooseLocation',ret)
        gourmet_address = ret.address;
        gourmet_title = ret.name;
        that.setData({
          address: gourmet_address
          ,title: gourmet_title
        })
        geopoint = {
          latitude: +ret.latitude //数值
          ,longitude: +ret.longitude //数值
        }
      }
      ,cancel: function(){
        geopoint = null;//退出之后对象清空
      }
    })
  }

 
});