//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    hidden: true,
    scrollTop: 0
  },
  onLoad: function (options) { 
    var that = this
    var bis_id = app.globalData.bis_id
    that.getOpenid(options)

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    //获取分类信息
    that.getCategoryInfo()
    //首页banner
    wx.request({
      url: app.globalData.requestUrl + '/index/getBannersInfo',
      data: {bis_id : bis_id},
      header: {
        'content-type': ''
      },
      success: function (res) {
        that.setData({
          recommend_pics: res.data.result
        })
      }
    }),
    //推荐商品列表
    wx.request({
      url: app.globalData.requestUrl + '/index/getRecProByGroup',
      data: { bis_id: bis_id },
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        that.setData({
          recommend_info: res.data.result,
          hasMore: res.data.has_more,
          page: 1
        })
      }
    }) 
  },
  //获取详情
  getProDetail: function(event){
    var pro_id = event.currentTarget.dataset.proid;
    wx.navigateTo({
      url: '/pages/index/pro_detail/pro_detail?pro_id='+pro_id,
    })
  },
  //下拉刷新
  topLoad: function () {
    var that = this
    var bis_id = app.globalData.bis_id
    wx.showNavigationBarLoading()
    wx.request({
      url: app.globalData.requestUrl + '/index/getBannersInfo',
      data: { bis_id: bis_id },
      header: {
        'content-type': ''
      },
      success: function (res) {
        that.setData({
          recommend_pics: res.data.result
        })
      }
    }),
    //推荐商品列表
    wx.request({
      url: app.globalData.requestUrl + '/index/getRecProByGroup',
      data: { bis_id: bis_id },
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        that.setData({
          recommend_info: res.data.result,
          hasMore: res.data.has_more,
          page: 1
        })
      },
      complete: function () {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  //分享
  onShareAppMessage: function () {
    return {
      title: '轻商拼团，小程序技术。自由拼、快速拼！',
      path: '/pages/index/index'
    }
  },
  //获取openid
  getOpenid: function (options){
    var that = this
    //获取openid
    wx.login({
      success: function (res) {
        var postdata = {
          appid: app.globalData.appid,
          secret: app.globalData.secret,
          code: res.code
        }

        wx.request({
          url: app.globalData.requestUrl + '/index/getOpenIdOnly',
          data: postdata,
          header: {
            'content-type': ''
          },
          method: 'post',
          success: function (res) {
            var openid = res.data.openid
            that.checkRecStatus(options, openid)
          }
        })
      }
    })
  },
  //判断是否被推荐
  checkRecStatus: function (options, openid){
    var that = this
    var bis_id = app.globalData.bis_id
    
    //判断是否获取到推荐人参数
    if (!options.id || options.id == 'undefined') {
      var postdata = {
        openid: openid,
        bis_id: bis_id
      }
    } else {
      var userid = options.id
      var postdata = {
        rec_id: userid,
        openid: openid,
        bis_id: bis_id
      }
    }
    //检验本用户是否被别人推荐，如果已被推荐，不操作；无被推荐，把推荐用户id更新到会员表中
    wx.request({
      url: app.globalData.requestUrl + '/members/checkRecStatus',
      data: postdata,
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        app.globalData.rec_id = res.data.result
      }
    })
  },
  //页面滑动到底部
  bindDownLoad: function () {
    var that = this;
    that.loadMore()
  },
  scroll: function (event) {
    //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    this.setData({
      crollTop: event.detail.scrollTop
    });
  },
  //加载更多
  loadMore: function (e) {
    var that = this
    var bis_id = app.globalData.bis_id
    that.setData({
      hidden: false
    });
    var page = that.data.page
    page++
    var url = app.globalData.requestUrl + '/index/getRecProByGroup'
    var postData = {
      bis_id: bis_id,
      page: page
    }
    if (that.data.hasMore == true) {
      that.setData({
        hasMore: false
      })
      wx.request({
        url: url,
        data: postData,
        header: {
          'content-type': ''
        },
        method: 'post',
        success: function (res) {
          var list = that.data.recommend_info;
          if (res.data.statuscode == 1) {
            for (var i = 0; i < res.data.result.length; i++) {
              list.push(res.data.result[i]);
            }
            that.setData({
              recommend_info: list,
              page: page,
              hidden: true,
              hasMore: res.data.has_more
            });
          } else {
            that.setData({
              recommend_info: list,
              hidden: false,
              hasMore: false
            });
          }
        }
      });
    } else {
      that.setData({
        hidden: true
      });
    }
  },
  //获取分类信息
  getCategoryInfo : function(){
    var that = this
    wx.request({
      url: app.globalData.requestUrl + '/category/getFirstCatInfo',
      data: {bis_id : app.globalData.bis_id},
      header: {
        'content-type': ''
      },
      success: function (res) {
        that.setData({
          cat_res : res.data.result
        })
      }
    })
  },
  //跳转到分类页
  goCategory : function(e){
    var that = this
    var cat_id = e.currentTarget.dataset.catid
    //设置缓存
    wx.setStorage({
      key: 'cat_id',
      data: cat_id,
    })
    wx.switchTab({
      url: '/pages/category/category',
    })
  }
})