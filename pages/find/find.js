// pages/find/find.js
const app = getApp()
var util = require('../../util.js')
Page({
    data: {
        logged: false,
        avatarUrl: '',
        username: '',
    },

    onLoad: function (options) {
        let isLogin = app.globalData.isLogin
        this.setData({
            logged: isLogin ? true : false
        })
    },

    goJielong(e) {
        if (this.data.logged) {
            wx.navigateTo({
                url: `/pages/idiom-jielong/idiom-jielong`,
            })
        } else {
            this.onGetUserInfo(e)
            wx.navigateTo({
                url: `/pages/idiom-jielong/idiom-jielong`,
            })
        }
    },

    goRecord(e) {
        if (this.data.logged) {
            let type = e.currentTarget.dataset.type
            wx.navigateTo({
                url: `/pages/myRecord/myrecord?type=${type}`,
            })
        } else {
            this.onGetUserInfo(e)
        }
    },

    goRanking(e) {
        let type = e.currentTarget.dataset.type
        if (this.data.logged) {
            wx.navigateTo({
                url: `/pages/ranking/ranking?type=${type}`,
            })
        } else {
            this.onGetUserInfo(e)
            wx.navigateTo({
                url: `/pages/ranking/ranking?type=${type}`,
            })
        }
    },

    goFeihuaSelect(e) {
        wx.navigateTo({
            url: `/pages/feihua-select/feihua-select`,
        })
    },

    onGetUserInfo(e) {
        wx.getUserInfo({
            success: (res) => {
                this.setData({
                    logged: true,
                    avatarUrl: e.detail.userInfo.avatarUrl,
                    username: e.detail.userInfo.nickName,
                })

                wx.setStorageSync('isLogin', 'isLogin')
                wx.setStorageSync('avatarUrl', this.data.avatarUrl)
                wx.setStorageSync('username', this.data.username)
                app.globalData.isLogin = wx.getStorageSync('isLogin')
                app.globalData.avatarUrl = wx.getStorageSync('avatarUrl')
                app.globalData.username = wx.getStorageSync('username')
            },
            fail: res => {
                console.log(res)
            }
        })
    },

    gocangtoushi() {
        wx.navigateTo({
            url: `/pages/cangtoushi/cangtoushi`,
        })
    },

    /**
     * ??????????????????--??????????????????????????????
     */
    onReady: function () {

    },

    /**
     * ??????????????????--??????????????????
     */
    onShow: function () {
        console.log('??????????????????openId???', app.globalData)
        let isLogin = app.globalData.isLogin
        this.setData({
            logged: isLogin ? true : false
        })
    },

    /**
     * ??????????????????--??????????????????
     */
    onHide: function () {

    },

    /**
     * ??????????????????--??????????????????
     */
    onUnload: function () {

    },

    /**
     * ??????????????????????????????--????????????????????????
     */
    onPullDownRefresh: function () {

    },

    /**
     * ???????????????????????????????????????
     */
    onReachBottom: function () {

    },

    /**
     * ???????????????????????????
     */
    onShareAppMessage: function () {
        util.ShareAppMessage()
    },
    onShareTimeline: function () {
        util.ShareTimeline()
    },
})