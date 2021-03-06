//app.js
App({
  onLaunch: function () {
    var that = this;
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        if (!res.data || res.data == '') {
          //获取用户信息
          // var loginStatus = true;
          that.getUserInfo()
        } else {
          that.globalData.openid = res.data
          wx.getStorage({
            key: 'userInfo',
            success: function (ress) {
              if (!ress.data || ress.data.length == 0) {
                //获取用户信息
                // var loginStatus = true;
                that.getUserInfo()
              } else {
                that.globalData.userInfo = ress.data
              }
            },
            fail: function (ress) {
              //获取用户信息
              // var loginStatus = true;
              that.getUserInfo()
            }
          })
        }

      },
      fail: function (res) {
        //获取用户信息
        // var loginStatus = true;
        that.getUserInfo()
      }
    })
  },
  getUserInfo: function (loginStatus) {
    wx.navigateTo({
      url: '/pages/auth/index',
    })
  },
  getOpenId: function (userInfo) {
    var that = this
    var userInfo = that.globalData.userInfo
    var userinfo = {
      avatarUrl: userInfo.avatarUrl,
      city: userInfo.city,
      country: userInfo.country,
      gender: userInfo.gender,
      nickName: userInfo.nickName,
      province: userInfo.province
    }
    //调用登录接口
    wx.login({
      success: function (res) {
        var postdata = {
          appid: that.globalData.appid,
          secret: that.globalData.secret,
          code: res.code,
          bis_id: that.globalData.bis_id,
          avatarUrl: userInfo.avatarUrl,
          city: userInfo.city,
          country: userInfo.country,
          gender: userInfo.gender,
          nickName: userInfo.nickName,
          province: userInfo.province
        }

        wx.request({
          url: that.globalData.requestUrl + '/index/getOpenIdNew',
          data: postdata,
          header: {
            'content-type': ''
          },
          method: 'post',
          success: function (res) {
            that.globalData.openid = res.data.openid
            if (!res.data.openid) {
              that.getOpenId()
            } else {
              //将openid存入缓存
              wx.setStorage({
                key: "openid",
                data: res.data.openid
              })
            }
          }
        })
      }
    })
  },

  globalData: {
    userInfo: null,
    bis_id : '34',
    appid: "wxef01e62c2b3428d5",
    secret: "d093df2145cdafcec281cf128dca3880",
    openid : '',
    acode : '',
    rec_id : '',
    //测试
    // imgUrl: "http://mall.dxshuju.com:8000/",
    // requestUrl: "https://wxapp.dxshuju.com/index",
    // acodeUrl: "https://wxapp.dxshuju.com/",
    // payUrl: "https://wxapp.dxshuju.com/index/grouppay/pay",
    //腾讯云正式
    imgUrl: "http://cp.dxshuju.com/",
    requestUrl: "https://xcx001.dxshuju.com/index",
    acodeUrl: "https://xcx001.dxshuju.com/",
    payUrl: "https://xcx001.dxshuju.com/index/grouppay/pay",
  }
})