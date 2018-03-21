// pages/publishJob/publishJob.js
var request = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 1,
    refreshTime: '', // 刷新的时间 
    allPages: '',    // 总页数
    contentlist:[],
    currentPage: 1,  // 当前页数  默认是1
    loadMoreData: '加载更多……'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
      refreshTime: date.toLocaleTimeString()     
    })

    this.getData();
  },
  changTasp(e) {
    var that = this;
    if (that.data.currentIndex == e.currentTarget.dataset.index) {
      return false;
    } else {
      that.setData({
        currentIndex: e.currentTarget.dataset.index
      })
    }
    this.getData();
    if (e.currentTarget.dataset.index==3){
      this.fubudone();
    }

  },
  // 任务结束
  // 获取数据  pageIndex：页码参数
  fubudone: function () {
    var that = this;
    var pageIndex = that.data.currentPage;   
    wx.request({
      url: request.dataUrl + '/api/User/allTasklist',
      data: {
        wx_code: wx.getStorageSync('session'),
        goods_status: that.data.currentIndex
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
        } else {
          that.setData({
            datalis: res.data.data
          })
        }
      },
      fail: function () {

      }
    })
  },
  // 接受方任务列表
  getData: function () {
    var that = this;
    var url = request.dataUrl + '/api/User/mytask';
    var params = {
      wx_code: wx.getStorageSync('session'),
      goods_status: that.data.currentIndex
    }
    request.requestLoading(url, params, '正在加载数据', function (res) {
      //res就是我们请求接口返回的数据
      console.log(res)
      if (res.status == 1) {
        var publishing = []
        var going = []
        // var haveDone = []
        // var needP = []
        for (var i in res.data) {         
          if (res.data[i].status==-1){
            publishing.push(res.data[i])
          } else if (res.data[i].status == 1 ) {           
            going.push(res.data[i])                       
          } 
          // else if (res.data[i].status == 4 || res.data[i].need_people == '0') {
          //   haveDone.push(res.data[i])
          // }
        }
       


        that.setData({
          publishing: publishing,
          going: going         
        })
      }


    }, function (res) {
      wx.showToast({
        title: '加载数据失败',
      })
    })
  },
  toDetail(e) {
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '../yifubuDetail/yifubuDetail?id=' + e.currentTarget.dataset.id + '&title=' + e.currentTarget.dataset.title,
    })

  },
  fabudoned(e) {
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '../fubudone/fubudone?id=' + e.currentTarget.dataset.id + '&title=' + e.currentTarget.dataset.title,
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