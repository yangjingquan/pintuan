//mine.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow: function () {
    var that = this
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      that.setData({
        userInfo: app.globalData.userInfo,
        rec_id: app.globalData.rec_id,
        openid: app.globalData.openid
      })
    }

  },
  myOrderTap: function () {
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      wx.navigateTo({
        url: '../orders/myorder',
      })
    }

  },
  myAddressTap: function () {
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      wx.navigateTo({
        url: '../address/address?from=mine',
      })
    }
  },
  getService: function () {
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      wx.navigateTo({
        url: '../service/service',
      })
    }
  },
  myAcode: function () {
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      wx.navigateTo({
        url: '/pages/acode/acode',
      })
    }
  },
  getRecOrders: function () {
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      wx.navigateTo({
        url: '/pages/rec_orders/order',
      })
    }
  },
  getMyIncome: function () {
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      //获取可提现金额和提现中金额
      wx.request({
        url: app.globalData.requestUrl + '/index/getMyIncome',
        data: { openid: app.globalData.openid },
        header: {
          'content-type': ''
        },
        method: 'post',
        success: function (res) {
          var result = res.data.result
          var ketixian = result.ketixian
          var tixianzhong = result.tixianzhong
          wx.navigateTo({
            url: '/pages/income/income?ketixian=' + ketixian + '&tixianzhong=' + tixianzhong,
          })
        }
      })
    }
  },
  replyTixian: function () {
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      //获取可提现金额和提现中金额
      wx.request({
        url: app.globalData.requestUrl + '/index/getMyIncome',
        data: { openid: app.globalData.openid },
        header: {
          'content-type': ''
        },
        method: 'post',
        success: function (res) {
          var result = res.data.result
          var ketixian = result.ketixian
          var tixianzhong = result.tixianzhong
          wx.navigateTo({
            url: '/pages/tixian/tixian?ketixian=' + ketixian,
          })
        }
      })
    }
  }
})
