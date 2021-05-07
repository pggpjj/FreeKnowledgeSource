// pages/menu/menu.js


const tagsList = require('../../lib/tags')
var util = require('../../util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        showMore: -1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadList()
    },


    loadList() {
        let { list } = this.data;
        wx.showLoading({
            title: '正在加载...',
            mask: true
        });

        list = tagsList.tagsList

        this.setData({
            list
        })

        setTimeout(() => {
            wx.hideLoading()
        }, 200)
    },

    foldToggle(e) {
        this.setData({
            showMore: -1
        })
    },

    unfoldToggle(e) {
        this.setData({
            showMore: e.currentTarget.dataset.parentidx
        })
    },

    goList(e) {
        wx.navigateTo({
            url: `/pages/list/list?parenttags=${e.currentTarget.dataset.parenttags}&tags=${e.currentTarget.dataset.tags}`,
        })
    },

    goSearch(e) {
        util.goSearch(e)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */

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
        util.ShareAppMessage()
    },
    onShareTimeline: function () {
        util.ShareTimeline()
    },
})