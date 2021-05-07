// pages/idiomdetail/idiomdetail.js
var util = require('../../util.js')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        currentData: 0,
        detail: {},
        thisIndex: -1,
        page: 1,
        num: 1,
        logged: false,
        openid: '',
        title: '',
        isCollect: false,
        isDown: false,
        loading: false,
        isExist: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        let isLogin = app.globalData.isLogin

        console.log('用户是否授权：', app.globalData.isLogin)
        console.log('是否已有用户openId：', app.globalData.openid)

        this.setData({
            id: options.id
        })

        this.setData({
            logged: isLogin ? true : false
        })

        if (app.globalData.openid) {
            this.setData({
                openid: app.globalData.openid
            })
        }
        if (options.name) {
            wx.setNavigationBarTitle({
                title: "上联: " + options.name //页面标题为路由参数
            })
        }

        if (options.id) {
            wx.setStorageSync('shareId', options.id)
            this.loadDetail(options.id, options.name)
        }

    },
    handlerGobackClick() {
        util.handlerGobackClick(function (e) {}, 1000)
    },
    handlerGohomeClick() {
        util.handlerGohomeClick(function (e) {

        }, 1000)
    },

    formatResult() {

    },

    onCopyData() {
        let result = this.data.detail;
        let str = '';
        if (result.top != undefined) {
            str += "横批：" + " \n " + result.top + " \n ";
        }
        str += "上联：" + " \n " + result.left + " \n ";
        let rightrpe = result.rights.length > 1 ? "可选下联：" : "下联："
        str += rightrpe + " \n "
        result.rights.forEach(element => {
            str += element + " \n "
        });
        if (result.desc != undefined) {
            str += "描述" + " \n " + result.desc + " \n ";
        }
        if (result.author != undefined) {
            str += "作者" + " \n " + result.author;
        }
        str+=" \n "+'---数据采集整理于中国对联网https://www.duilian.com---';
        console.log('设置的剪切板的内容' + str) // data
        wx.setClipboardData({
            //准备复制的数据内容
            data: str,
            success: function (res) {
                wx.showToast({
                    icon: 'success',
                    title: '复制成功',
                  })
            },
        })
    },

    loadDetail(id, name) {
        let {
            detail,
            page,
            num
        } = this.data
        let that = this
        wx.showLoading({
            title: '详情加载中...',
        })

        wx.cloud.callFunction({
                name: 'collection_get',
                data: {
                    database: 'couplet',
                    page,
                    num,
                    condition: {
                        _id: id
                    }
                },
            }).then(res => {
                if (!res.result.data.length) {
                    wx.showToast({
                        icon: 'warn',
                        title: '加载失败',
                    })
                } else {


                    this.setData({
                        detail: res.result.data[0]
                    })

                    this.setData({
                        title: this.data.detail.left.length > 8 ? "对联信息" : "上联:" + this.data.detail.left
                    })


                    wx.hideLoading()
                }
                that.setData({
                    isDown: true
                })
            })
            .catch(err => {
                console.log('失败' + err)
                that.setData({
                    isExist: false
                })
            })
    },


    goList: util.throttle(function (e) {
        wx.navigateTo({
            url: `/pages/idiomlist/idiomlist?tags=${e.currentTarget.dataset.tags}`,
        })
    }, 1000),


    onBackhome(e) {
        util.goBackHome(e)
    },


    goOtherIdiom: util.throttle(function (e) {
        let name = e.currentTarget.dataset.name
        let page1 = this.data.page
        let num1 = this.data.num
        wx.cloud.callFunction({
                name: 'collection_get',
                data: {
                    database: 'idiom',
                    page: page1,
                    num: num1,
                    condition: {
                        t: name
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
                    let gotoid = res_data[0]._id;

                    wx.cloud.callFunction({
                            name: 'collection_count_opened',
                            data: {
                                database: 'idiom',
                                id: gotoid
                            },
                        }).then(res => {
                            wx.navigateTo({
                                url: `/pages/idiomdetail/idiomdetail?id=${gotoid}&name=${name}`
                            })
                        })
                        .catch(console.error)
                }
            })
            .catch(console.error)
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
        this.getList()
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