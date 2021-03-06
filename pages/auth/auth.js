// pages/auth/auth.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    avatarUrl: "./user-unlogin.png",
    openid: "",
    logged: false,
    nickname: "",
    place: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  onPullDownRefresh: function () {

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

  },
  //新增wx.getUserProfile接口
  getUserProfile: function (e) {
    wx.getUserProfile({
      desc: '业务需要',
      success: res => this.onSaveUserInfo(res.userInfo)
    })
  },


  //保存userInfo到DB
  onSaveUserInfo: function (userInfo) {
    console.log(app.globalData.userInfo = userInfo)
    wx.setStorageSync("avatarUrl", userInfo.avatarUrl);
    wx.setStorageSync("username", userInfo.nickName);
    app.globalData.userInfo.openid = app.globalData.openid

    wx.cloud.callFunction({
      name: 'collection_get',
      data: {
        database: 'user',
        page: 1,
        num: 1,
        condition: {
          _id: app.globalData.openid
        }
      },
    }).then(res => {
      if (!res.result.data.length) {
        wx.cloud.callFunction({
          name: 'collection_add',
          data: {
            database: 'user',
            record: app.globalData.userInfo
          },
        })
      } else {
        wx.cloud.callFunction({
          name: 'collection_update',
          data: {
            database: "user",
            id: app.globalData.openid,
            values: {
              userInfo: userInfo
            }
          }

        })

      }
    })
    wx.setStorageSync("isLogin", true);

    app.globalData.isLogin = wx.getStorageSync("isLogin");
    app.globalData.avatarUrl = wx.getStorageSync("avatarUrl");
    app.globalData.username = wx.getStorageSync("username");

    wx.navigateBack({
      delta: 0,
    })
  },

})