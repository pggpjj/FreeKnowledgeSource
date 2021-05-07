var util = require('../../util.js')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        sentence: {},
        fitler: {},
        tags:null,
        sentencePage: 50,
        page: 1,
        num: 20,
        loading: false,
        jumping: false,
        isOver: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options) {
            this.data.fitler = {
                tags: options.tags
            }
            this.setData({
                tags:options.tags
            })
        }
        this.getList(this.data.fitler)
        app.globalData.menuPlaceholder = "成语"
    },

    handlerGobackClick() {
        util.handlerGobackClick(function (e) {
        }, 1000)
    },
    handlerGohomeClick() {
        util.handlerGohomeClick(function (e) {

        }, 1000)
    },

    confirmSearch(e) {
        util.goSearch(e)
    },

    lower(e) {
        if (!this.data.loading) {
            this.getList(this.data.fitler)
        }
    },

    getList(filter) {
        if (!this.data.isOver) {
            let {
                list,
                page,
                num
            } = this.data
            let that = this

            this.setData({
                loading: true
            })
            wx.cloud.callFunction({
                name: 'collection_get',
                data: {
                    database: 'idiom',
                    page,
                    num,
                    condition: filter
                },
            }).then(res => {
                if (!res.result.data.length) {
                    that.setData({
                        loading: false,
                        isOver: true
                    })
                } else {
                    let res_data = res.result.data
                    let over = res.result.data.length < num
                    list.push(...res_data)
                    that.setData({
                        list,
                        page: page + 1,
                        loading: false,
                        isOver: over
                    })
                }
            })
                .catch(console.error)
        }
    },




    goDetail: util.throttle(function (e) {
        util.goIdiomDetail(e)
    }, 1000),

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
        this.getList(this.data.fitler)
    },
    onBackhome(e) {
        util.goBackHome(e)
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        util.ShareAppMessage()
    },
    onShareTimeline: function () {
        util.ShareTimeline()
    },
})