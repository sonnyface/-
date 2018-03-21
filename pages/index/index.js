// pages/index/index.js

 const app =getApp()
 var util =require('../../utils/util.js');
 var request=require('../../utils/request.js');
//  var City=require("../../utils/allcity.js");
var page = undefined;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    params:'',
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    indicatorColor:"#ffffff",
    indicatorActiveColor:"#77e5f7"  ,
    goods_id :'',
    city: '' ,
    doommData: [],
    scroll_height:'' ,
    arrlis:'',
    animationData: {}   
  },  
  //滚动监听  
  scroll: function (e) {
    var that=this;
    // console.log(e.detail.scrollTop)
    that.setData({
      scroll_height: e.detail.scrollTop
    })  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    page = this;
    // 登录获取用户信息
    if (app.globalData.userInfo) {
      // //consoel.log(app.globalData.userInfo)
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (that.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        //consoel.log(res.userInfo)
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          // //consoel.log(res.userInfo)
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    that.setData({
      logs: (wx.getStorageSync('logs') || []).map(function (log) {
        return util.formatTime(new Date(log))
      })      
    })

    if (options.city){
      that.setData({
        city: options.city
      })
    }else{
      that.loadInfo();
    }

  // 调取数据
    that.getData();
    that.getJob();
    that.finishJob();  
    that.getBarrage();    
  }, 
  // 弹幕接口
  getBarrage(){
    var that=this;
    wx.request({
      url: request.dataUrl + '/api/Index/barrage',
      data: '',      
      method: 'GET',      
      success: function(res) {
        console.log(res)
        for(var i in res.data){
          res.data[i].user_name =res.data[i].user_name.substring(-1, 1)+'** '
        }   
        that.setData({
          arrlis: res.data 
        })  
        var datalis = res.data            
          setInterval(function(){ 
            // var domlis=datalis.splice(datalis.indexOf(that), 1)            
            var dom = datalis.slice(0,1)           
            // console.log(datalis)
            datalis.push(dom[0])
            var domlis = datalis.splice(0, 1)              
            //  console.log(datalis)

            that.setData({
              barragelis: domlis
            })
           
          },10000)  
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  }, 

  //定位获取当前的省市
  loadInfo: function () {
    var that = this
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        //consoel.log(res)
        var longitude = res.longitude
        var latitude = res.latitude
        that.loadCity(longitude, latitude)
      }   
    })
  },
  loadCity: function (longitude, latitude) {
    var that = this
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=BW2Zgh2TlrkC4U6CSS0f9ukZjwY0e8AG&location=' + latitude + ',' + longitude + '&output=json',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        //consoel.log(res);
        var citys = res.data.result.addressComponent.city;
        that.setData({ 
          city: citys 
        });
        // wx.setStorageSync('city', citys)
      },
      fail: function () {
        that.setData({
          city: "获取定位失败" 
      });
      }
    })
  } ,
  // 城市列表
  tolistCity(){
    wx.navigateTo({
      url: '../citylist/citylist',
    })
  },
  // 轮播图 跳转
  topingtai(e){
    //consoel.log(e.currentTarget.dataset.index)
    if (e.currentTarget.dataset.index==0){
      wx.navigateTo({
        url: '../huodongliebiao/huodongliebiao'
      })
    } else if(e.currentTarget.dataset.index == 1){
      wx.navigateTo({
        url: '../pingtaiguanggao/pingtaiguanggao'
      })
    } else if (e.currentTarget.dataset.index == 2) {
      wx.navigateTo({       
         url: '../jishirenwuDetail/jishirenwuDetail?id=' + this.data.goods_id

      })
    }
  }, 

  // //获取接口   轮播图 
  getData: function () {
    var that=this;
    var url = request.dataUrl+ '/api/Ad/index';
    request.requestLoading(url, that.data.params, '正在加载数据', function (res) {
      //res就是我们请求接口返回的数据
      //  //consoel.log(res.data)
      for (var i in res.data) {
        res.data[i].ad_code = request.dataUrl + res.data[i].ad_code
        }
      that.setData({
        imgUrls: res.data
      })

    }, function (res) {
      wx.showToast({
        title: '加载数据失败',
      })
    })
  },
  // //获取接口   首页紧急任务
  getJob: function () {
    var that = this;
    var url = request.dataUrl + '/api/Index/index';
    var local_city = wx.getStorageSync('city');
    var params={
      cityName: that.data.city ? that.data.city : local_city
    }
    request.requestLoading(url,params, '正在加载数据', function (res) {
      //res就是我们请求接口返回的数据
      //consoel.log(res.data[0].goods_id)
      //consoel.log(res)
      if (res.status==1){       
        that.setData({
          rushJob: res.data,
          goods_id: res.data[0].goods_id
        })
      }     

    }, function (res) {
      wx.showToast({
        title: '加载数据失败',
        image: '../../image/fail.png',
        duration: 2000
      })
    })
  },
  // //获取接口   已完成任务
  finishJob: function () {
    var that = this;
    var url = request.dataUrl + '/api/Index/ftask';
    var local_city = wx.getStorageSync('city');
    var params = {
      cityName: that.data.city ? that.data.city : local_city
    }
    request.requestLoading(url, params, '正在加载数据', function (res) {
      //res就是我们请求接口返回的数据
      //consoel.log(res)
      if (res.status == 1) {
        that.setData({
          finishJob: res.data
        })
      }     

    }, function (res) {
      wx.showToast({
        title: '加载数据失败',
      })
    })
  },  

  toDetail(e){
    wx.navigateTo({
      url: '../jishirenwuDetail/jishirenwuDetail?id=' + e.currentTarget.dataset.id,
    }) 
  },
  toShehe(e){
    wx.navigateTo({
      url: '../doneJob/doneJob?id=' + e.currentTarget.dataset.id,
    }) 
  },

  // 下拉刷新回调接口
  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    var that = this    
    // 调取数据
    that.getData();
    that.getJob();
    that.finishJob();
    setTimeout(function(){
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    },1500)  
  },
  // 上拉加载回调接口
  onReachBottom: function () {


  },
  onShow: function () {
    var animation = wx.createAnimation({
      duration: 2000,
      timingFunction: 'ease',
    })
    this.animation = animation   
    this.setData({
      animationData: animation.export()
    })
    setInterval(function () {
      this.animation.translate(220).step({ duration: 5000 })
      this.animation.translate(-500).step({ duration: 5000 })
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 5000)
   
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {

  }
})