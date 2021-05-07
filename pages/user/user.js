// pages/user/user.js
const app = getApp();
var util = require('../../util.js')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        avatarUrl: "./user-unlogin.png",
        openid: "",
        logged: false,
        username: "",
        place: "",
        showImg: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log("进入用户页检查是否登录:", app.globalData.isLogin);
        console.log("是否已授权：", wx.getStorageSync("isLogin"));
        console.log("是否已有用户openId：", app.globalData.openid);

        
        wx.showLoading({
            title: "正在加载...",
            mask: true,
        });

        if (app.globalData.isLogin) {
            this.setData({
                logged: true,
                avatarUrl: app.globalData.userInfo.avatarUrl,
                username: app.globalData.userInfo.nickName,
            });
        }
   
        wx.hideLoading();
        if (app.globalData.openid) {
            this.setData({
                openid: app.globalData.openid,
            });
        }
    },
    handleContact(e) {
        console.log(e.detail.path)
        console.log(e.detail.query)
    },
    onGetUserInfo: async function (e) {

        if (await app.hasUserInfo()) {
            var temp = app.globalData.userInfo;
            this.setData({
                logged: true,
                avatarUrl: temp.avatarUrl,
                userInfo: temp,
                username: temp.nickName,
            });

            console.log("this.data.avatarUrl" + this.data.avatarUrl)
            console.log("this.data.username" + this.data.username)

            wx.setStorageSync("isLogin", this.data.logged);
            wx.setStorageSync("avatarUrl", this.data.avatarUrl);
            wx.setStorageSync("username", this.data.username);
            app.globalData.isLogin = wx.getStorageSync("isLogin");
            app.globalData.avatarUrl = wx.getStorageSync("avatarUrl");
            app.globalData.username = wx.getStorageSync("username");

        } else return

    },

    goAbout() {
        wx.navigateTo({
            url: `/pages/aboutme/aboutme`
        })
    },


    goWeXin() {
        wx.navigateTo({
            url: `/pages/weixin/weixin`
        })
    },

    goSuggestList() {
        if (!app.globalData.isLogin) {
            wx.showToast({
                icon: 'warn',
                title: '请您先登录',
            })
        } else {
            wx.navigateTo({
                url: `/pages/suggest/suggest`
            })

        }
    },
    goAddSuggest() {
        if (!app.globalData.isLogin) {
            wx.showToast({
                icon: 'warn',
                title: '请您先登录',
            })
        } else {
            wx.navigateTo({
                url: `/pages/addsuggest/addsuggest`
            })
        }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () { },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        if (app.globalData.isLogin) {
            this.setData({
                logged: true,
                avatarUrl: app.globalData.userInfo.avatarUrl,
                username: app.globalData.userInfo.nickName,
            });
        }

        if (app.globalData.openid) {
            this.setData({
                openid: app.globalData.openid,
            });
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () { },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () { },


    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        util.ShareAppMessage()
    },
    onShareTimeline: function () {
        util.ShareTimeline()
    },
});