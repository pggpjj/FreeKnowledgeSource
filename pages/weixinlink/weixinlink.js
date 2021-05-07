
var util = require('../../util.js')

Page({
  data: {
    articleSrc: ""
  },
  onLoad: function (option) {

    let articleurl = wx.getStorageSync("articleurl");
    let articletitle = wx.getStorageSync("articletitle");


    wx.setNavigationBarTitle({
      title: articletitle,
    })
    this.setData({
      articleSrc: articleurl
    })


  },
  handlerGobackClick() {
    util.handlerGobackClick(function (e) {}, 1000)
  },
  handlerGohomeClick() {
    util.handlerGohomeClick(function (e) {

    }, 1000)
  },

})