const order = ['green', 'red', 'blue']
var util = require('../../util.js')

Page({
    onShareAppMessage() {
        util.ShareAppMessage()
    },

    onShareTimeline: function () {
        util.ShareTimeline()
    },

    data: {
        toView: 'green',
        list: null,
        selectedid: "001"
    },

    onLoad: function (options) {
        wx.cloud.callFunction({
                name: 'collection_get',
                data: {
                    database: 'menu',
                    page: 1,
                    num: 1,
                    condition: {

                    }
                },
            }).then(res => {
                if (!res.result.data.length) {
                    wx.showToast({
                        icon: 'warn',
                        title: '加载失败',
                    })
                } else {

                    let result = res.result.data[0];
                    console.log('result.items', result.items)
                    this.setData({
                        list: JSON.parse(JSON.stringify(result.items))
                    })

                    wx.hideLoading()
                }

            })
            .catch(err => {
                console.log('失败' + err)
                that.setData({
                    isExist: false
                })
            })
    },


    SwitchMain(e) {
        console.log("e.target.dataset.cellid:", e.target.dataset.cellid);
        if (this.data.selectedid === e.target.dataset.cellid) {
            return false
        } else {
            this.data.scrollTop = 0;
            this.setData({
                selectedid: e.target.dataset.cellid
            })
        }
    },
    upper(e) {
        console.log(e)
    },

    lower(e) {
        console.log(e)
    },

    scroll(e) {
        console.log(e)
    },

    scrollToTop() {
        this.setAction({
            scrollTop: 0
        })
    },

    goidiomTags(e) {
        wx.navigateTo({
            url: `/pages/idiomlist/idiomlist?tags=${e.currentTarget.dataset.tags}`,
        })
    },

    gocoupletKeyword(e) {
        wx.navigateTo({
            url: `/pages/coupletlist/coupletlist?tags=${e.currentTarget.dataset.tags}`,
        })
    },
    goKnowledge(e) {
        wx.navigateTo({
            url: `/pages/knowledgelist/knowledgelist?&tags=${e.currentTarget.dataset.tags}`,
        })
    },


    goWaiting(e) {
        wx.showToast({
            icon: 'warn',
            title: '敬请期待',
        })
    },

    goPostList(e) {
        let p = e.currentTarget.dataset.classifyname;
        let c = e.currentTarget.dataset.tags;
        console.log("province" + p);
        console.log("city" + c);
        wx.navigateTo({
            url: `/pages/postlist/postlist?province=${p}&city=${c}`,
        })

    },

    tap() {
        for (let i = 0; i < order.length; ++i) {
            if (order[i] === this.data.toView) {
                this.setData({
                    toView: order[i + 1],
                    scrollTop: (i + 1) * 200
                })
                break
            }
        }
    },

    tapMove() {
        this.setData({
            scrollTop: this.data.scrollTop + 10
        })
    }
})