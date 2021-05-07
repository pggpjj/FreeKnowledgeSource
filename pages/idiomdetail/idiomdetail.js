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
                title: "成语： " + options.name //页面标题为路由参数
            })
        }

        if (options.id) {
            wx.setStorageSync('shareId', options.id)
            this.loadDetail(options.id, options.name)
        }

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
                    database: 'idiom',
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

                    let length1 = res.result.data[0].tags.length;
                    console.log('标签长度', length1)
                    this.setData({
                        detail: res.result.data[0]
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

    handlerGobackClick() {
        util.handlerGobackClick(function (e) {}, 1000)
    },
    handlerGohomeClick() {
        util.handlerGohomeClick(function (e) {

        }, 1000)
    },


    onBackhome(e) {
        util.goBackHome(e)
    },
    onCopyData() {
        let result = this.data.detail;
        let str = '';

        str += "成语：" + " \n " + result.t + " \n ";
        if (result.j != undefined) {
            str += "解释：" + " \n " + result.j + " \n ";
        }
        if (result.q!= undefined) {
            str += "拼音：" + " \n " + result.q + " \n ";
        }
        
        if (result.s != undefined) {
            str += "拼音缩写：" + " \n " + result.s + " \n ";
        }

        if (result.c != undefined) {
            str += "出处：" + " \n " + result.c + " \n ";
        }
        if(result.jys.length>0)
        {
            str += "近义成语：" + " \n ";
            result.jys.forEach(element => {
                str += element + " \n ";
            });
        }

        if(result.fys.length>0)
        {
            str += "反义成语：" + " \n ";
            result.fys.forEach(element => {
                str += element + " \n ";
            });
        }

        if(result.sequence.length>0)
        {
            str += "接龙示例：" + " \n ";
            result.sequence.forEach(element => {
                str += element + " \n ";
            });
        }
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