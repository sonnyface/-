//app.js
App({


  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    /**
   * 登录
   */
    function wxLogin(func) {
      //调用登录接口
      //1.小程序调用wx.login得到code.
      wx.login({
        success: function (res) {
          var code = res['code'];
          //2.小程序调用wx.getUserInfo得到rawData, signatrue, encryptData.
          wx.getUserInfo({
            success: function (info) {
              // console.log(info);
              var nick = JSON.parse(info.rawData)
              var rawData = info['rawData'];
              var signature = info['signature'];
              var encryptData = info['encryptData'];
              var encryptedData = info['encryptedData']; //注意是encryptedData不是encryptData...坑啊
              var iv = info['iv'];

              //3.小程序调用server获取token接口, 传入code, rawData, signature, encryptData.
              wx.request({
                url: "https://d.chuangkegf.com/api/User/login",
                method: "POST",
                data: {
                  'code': code,
                  'userinfo': rawData
                },
                success: function (res) {              
                  if (res.statusCode != 200) {
                    wx.showModal({
                      title: '登录失败'
                    });
                  }
                  console.log(res)
                  wx.setStorageSync('session', res.data.data)
                  typeof func == "function" && func(res.data);
                }
              });
            }
          });

        }
      });
    }
    wxLogin();
    
  //检查登录是否过期
  wx.checkSession({
    success: function (e) {   //登录态未过期
      console.log("没过期");
    },
    fail: function () {   //登录态过期了
      console.log("过期了");
      wxLogin();
    }
  })
    
  },
  globalData: {
    userInfo: null
  }
})


