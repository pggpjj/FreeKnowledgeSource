// pages/detail/detail.js
const app = getApp()
var util = require('../../util.js')
Page({


  data: {
    id: '',
    currentData: 0,
    detail: null,
    thisIndex: -1,
    page: 1,
    num: 1,
    logged: false,
    openid: '',
    isCollect: false,
    isDown: false,
    loading: false,
    changing: false,
    isExist: true,
    article: "",
    isMarkDown: false,
    isHtml: false,
    noteid: "",
    title: "",
    /*标题*/
    noteState: 1 /* 1 无记录 2 收藏 3 取消收藏*/
  },

  onLoad: function (options) {

    let isLogin = app.globalData.isLogin
    let noteState = this.data.noteState

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


    if (options.id) {
      wx.setStorageSync('shareId', options.id)
      this.loadDetail(options.id, options.classify)
    }

  },


  loadDetail(id, classify) {
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
        name: 'collection_leftjoin',
        data: {
          database: 'knowledge',
          fromdb: 'knowledgenote',
          condition: {
            _id: id
          },
          localField: '_id',
          foreignField: 'knowledgeid',
          asfield: 'note'
        },
      }).then(res => {
        if (!res.result.list.length) {
          wx.showToast({
            icon: 'warn',
            title: '加载失败',
          })
        } else {
          this.setData({
            detail: res.result.list[0],
            isMarkDown: res.result.list[0].isMarkDown,
            title: res.result.list[0].classify.indexOf('cold') > -1 ? '冷知识' : res.result.list[0].subject
          })

          wx.setNavigationBarTitle({
            title: this.data.title //页面标题为路由参数
          })
          detail = this.data.detail
          if (detail.isMarkDown || detail.isHtml) {
            wx.cloud.downloadFile({
              fileID: app.CloudPathPre + detail.fileUrl
            }).then(res => {
              console.log(res.tempFilePath)
              let fs = wx.getFileSystemManager()
              let result1 = fs.readFileSync(res.tempFilePath, "utf-8")
              let result = app.towxml(result1, detail.isMarkDown ? 'markdown' : "html");
              // 更新解析数据
              this.setData({
                article: result,
              });
            })

          }
          console.log("this.data.detail['note'].length" + this.data.detail['note'].length)
          if (this.data.detail['note'].length == 0) {
            this.setData({
              noteState: 1
            })
          } else {

            let bool1 = false;
            let tempnoteid = "";
            let tempnoted = false;
            this.data.detail['note'].forEach(element => {
              if (element.openid == app.globalData.openid) {
                bool1 = true;
                tempnoteid = element._id;
                tempnoted = element.noted;
              }
            });
            if (bool1) {
              this.setData({
                noteid: tempnoteid,
                noteState: tempnoted ? 2 : 3
              })
            }
          }

          wx.hideLoading()
        }
        that.setData({
          isDown: true
        })
      })
      .catch(err => {
        console.log('加载详情失败')
        that.setData({
          isExist: false
        })
      })
  },

  updateNoteState: util.throttle(function (e) {

    if (!this.data.changing) {
      this.setData({
        changing: true
      })

      if (this.data.noteState == 1) {
        let record = {
          knowledgeid: this.data.id,
          noted: true,
          openid: app.globalData.openid
        }
        wx.cloud.callFunction({
            name: 'collection_add',
            data: {
              database: 'knowledgenote',
              record: record
            },
          }).then(res => {

            console.log("noteid res.result._id" + res.result._id)
            if (res.result._id) {
              wx.showToast({
                icon: 'success',
                title: '已添加收藏'
              })
              this.setData({
                noteState: 2,
                noteid: res.result._id
              })
            }

          })
          .catch(console.error)
      } else {
        console.log(this.data.noteState == 2 ? '现状是存在收藏' : '现状是不存在收藏')
        let boolValue = this.data.noteState == 2 ? false : true
        let noteid = e.currentTarget.dataset.noteid
        let values = {
          noted: boolValue
        }

        wx.cloud.callFunction({
            name: 'collection_update',
            data: {
              database: "knowledgenote",
              id: noteid,
              values: {
                noted: boolValue
              }
            }

          }).then(res => {


            this.setData({
              noteState: boolValue ? 2 : 3
            })
            wx.showToast({
              icon: 'success',
              title: boolValue ? '已添加收藏' : '已取消收藏',
            })

          })
          .catch(console.error)
      }
      this.setData({
        changing: false
      })
    }

  }, 3000),

  goList(e) {
    wx.navigateTo({
      url: `/pages/knowledgelist/knowledgelist?parenttags=${e.currentTarget.dataset.parenttags}&tags=${e.currentTarget.dataset.tags}`,
    })
  },

  goPoet(e) {
    let poet = e.currentTarget.dataset.poet
    if (poet == '佚名') {
      return false;
    } else {
      wx.navigateTo({
        url: `/pages/poet/poet?poet=${e.currentTarget.dataset.poet}`,
      })
    }
  },

  //点击切换 Tab
  checkCurrent(e) {
    if (this.data.currentData === e.target.dataset.current) {
      return false
    } else {
      this.setData({
        currentData: e.target.dataset.current
      })
    }
  },

  onCopyData() {
    let result = this.data.detail;
    let str = '';


    if (result.subject != undefined) {
      str += "主题：" + " \n " + result.subject + " \n ";
    }
    if (result.content.length > 0) {
      str += "内容：" + " \n ";
      result.content.forEach(element => {
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

  onBackhome(e) {
    util.goBackHome(e)
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
  onShareAppMessage: function () {
    util.ShareAppMessage()
  },
  onShareTimeline: function () {
    util.ShareTimeline()
  },
  handlerGobackClick() {
    util.handlerGobackClick(function (e) {
      util.goSearch(e)
    }, 1000)
  },
  handlerGohomeClick() {
    util.handlerGohomeClick(function (e) {
      util.goSearch(e)
    }, 1000)
  },

})