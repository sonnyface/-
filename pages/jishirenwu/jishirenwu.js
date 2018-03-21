// pages/jishirenwu/jishirenwu.js
var request = require('../../utils/request.js');
var util = require('../../utils/util.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    hideHeader: true,
    hideBottom: true,
    refreshTime: '', // 刷新的时间 
    contentlist: [], // 列表显示的数据源
    allPages: '',    // 总页数
    currentPage: 1,  // 当前页数  默认是1
    loadMoreData: '加载更多……'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;

    // 改变标题
    wx.setNavigationBarTitle({
      title: options.title
    })

    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)        
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    });  

    var date = new Date();
    this.setData({
      refreshTime: date.toLocaleTimeString(),
      id: options.id,
      city:options.city
    })
    this.getData();
  },
  // 获取数据  pageIndex：页码参数
  getData: function () {
    var that = this;
    var pageIndex = that.data.currentPage;
    var local_city = wx.getStorageSync('city');
    wx.request({
      url: request.dataUrl + '/api/Goods/ajaxGoodsList',
      data: {
        id: that.data.id,
        p: pageIndex,
        cityName: that.data.city ? that.data.city : local_city
      },
      success: function (res) {
        console.log(res.data.data)
        console.log(res)
        var dataModel = res.data;
        if (dataModel.status == 1) {
          if (res.statusCode == 200) {
            if (pageIndex == 1) { // 下拉刷新
              that.setData({
                allPages: dataModel.data.allPages,
                contentlist: dataModel.data,
                hideHeader: true
              })
            } else { // 加载更多
              console.log('加载更多');
              var tempArray = that.data.contentlist;
              tempArray = tempArray.concat(dataModel.data);
              that.setData({
                allPages: dataModel.data.allPages,
                contentlist: tempArray,
                hideBottom: true
              })
            }
          }
        }else{
          that.setData({
            datalis: '暂时没有更多任务'
          })
        }
      },
      fail: function () {

      }
    })
  },
  // 价格排序
  valueSort(e) {
    var that = this;
    var contentlist = that.data.contentlist
    contentlist.sort(function (a, b) {
      return b.shop_price - a.shop_price;
    });
    that.setData({
      contentlist: contentlist
    })

  },
  // 时间检索
  timeSort(e) {
    var that = this;
    var local_city = wx.getStorageSync('city');
    wx.request({
      url: request.dataUrl + '/api/Goods/ajaxGoodsList',
      data: {
        id: that.data.id,        
        sort:2,
        cityName: that.data.city ? that.data.city : local_city
      },
      success: function (res) {
        console.log(res.data.data)
        that.setData({
          contentlist: res.data.data
        })
      }
    }) 

  },
  jishirenwuDetail(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../jishirenwuDetail/jishirenwuDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  // 上拉加载更多
  loadMore: function () {
    var that = this;
    // 当前页是最后一页
    if (that.data.currentPage == that.data.allPages) {
      that.setData({
        loadMoreData: '已经到顶'
      })
      return;
    }
    setTimeout(function () {
      console.log('上拉加载更多');
      var tempCurrentPage = that.data.currentPage;
      tempCurrentPage = tempCurrentPage + 1;
      that.setData({
        currentPage: tempCurrentPage,
        hideBottom: false
      })
      that.getData();
    }, 300);
  },
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
 
  /* 用户点击右上角分享
    */
  onShareAppMessage: function () {

  }
})