// pages/cloudFile/cloudFile.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:  function () {

    wx.cloud.downloadFile({
      fileID: 'cloud://stonecloud-base.7374-stonecloud-base-1302588318/mdFile/国之大事，在祀与戎.md'
    }).then(res => {
      console.log(res.tempFilePath)
      let fs=wx.getFileSystemManager()
      let result1 = fs.readFileSync(res.tempFilePath,"utf-8")
      let result = app.towxml(result1,'markdown');
      // 更新解析数据
      this.setData({
        article:result,
        isLoading: false
      });

    })


		
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

  }
})