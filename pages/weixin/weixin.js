//index.js
//获取应用实例
var app = getApp();
var util = require('../../util.js')
Page({
  data: {
    isClose: true, //判断当前页面是打开还是返回页
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    list: [],
    sentence: {},
    page: 1,
    num: 20,
    fields: {
      _id: true,
      title: true,
      articleurl: true,
      imageurl: true,
      content: true
    },
    loading: false,
    isOver: false,
    field: 'opened',
    order: 'desc',
    imagemode: 'widthFix'
  },


  bindViewTap: util.throttle(function (e) {
    let articleurl = e.currentTarget.dataset.articleurl;
    let articletitle = e.currentTarget.dataset.articletitle;
    wx.setStorageSync("articleurl", articleurl);
    wx.setStorageSync("articletitle", articletitle);
    wx.navigateTo({
      url: `../weixinlink/weixinlink`
      //  url: '../logs/logs'
    })
  }, 1000),

  onLoad: function () {
    wx.setNavigationBarTitle({
      title: "文章列表" //页面标题为路由参数
    })
    this.getList();
  },
  getList() {
    if (!this.data.isOver) {
      let {
        list,
        page,
        fields,
        field,
        order,
        num
      } = this.data
      let that = this
      this.setData({
        loading: true
      })
      wx.cloud.callFunction({
          name: 'collection_get_field_orderby',
          data: {
            database: 'article',
            page,
            num,
            fields,
            field,
            order,
            condition: {

            }
          },
        }).then(res => {
          if (!res.result.data.length) {
            that.setData({
              loading: false,
              isOver: true
            })
          } else {
            let res_data = res.result.data
            list.push(...res_data)
            that.setData({
              list,
              page: page + 1,
              loading: false
            })
          }
        })
        .catch(console.error)
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getList()
  },

  onShareAppMessage: function () {
    util.ShareAppMessage()
  },
  onShareTimeline: function () {
    util.ShareTimeline()
  },
  handlerGobackClick() {
    util.handlerGobackClick(function (e) {}, 1000)
  },
  handlerGohomeClick() {
    util.handlerGohomeClick(function (e) {

    }, 1000)
  },


})