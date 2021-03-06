const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const goKnowledgeDetail = e => {
  let _id = e.currentTarget.dataset.id
  wx.cloud.callFunction({
      name: 'collection_count_opened',
      data: {
        database: e.currentTarget.dataset.db,
        id: _id
      },
    }).then(res => {
      wx.navigateTo({
        url: `/pages/knowledgedetail/knowledgedetail?id=${e.currentTarget.dataset.id}&classify=${e.currentTarget.dataset.classify}&subject=${e.currentTarget.dataset.subject}`
      })
    })
    .catch(console.error)
}

const goPostDetailByAddr = e => {
  let id = e.currentTarget.dataset.id
  wx.cloud.callFunction({
      name: 'collection_get',
      data: {
        database: 'post',
        page: 1,
        num: 1,
        condition: {
          _id: id
        }
      },
    }).then(res => {
      if (!res.result.data.length) {
        wx.showToast({
          icon: 'warn',
          title: '跳转失败',
        })
      } else {
        let data = res.result.data[0];
        let infos = JSON.stringify(data.addrInfos)
        wx.navigateTo({
          url: `/pages/postdetail/postdetail?id=${id}&list=${infos}&province=${data.province}&city=${data.city}&district=${data.district}`
        })
      }

    })
    .catch(err => {
      console.log('失败' + err)
    })

}




const goPostDetail = e => {
  let _id = e.currentTarget.dataset.id
  let city = e.currentTarget.dataset.city
  let district = e.currentTarget.dataset.district
  let province = e.currentTarget.dataset.province
  console.log("addrInfos" + e.currentTarget.dataset.addrinfos)
  let infos = JSON.stringify(e.currentTarget.dataset.addrinfos)
  wx.cloud.callFunction({
      name: 'collection_count_opened',
      data: {
        database: e.currentTarget.dataset.db,
        id: _id
      },
    }).then(res => {
      wx.navigateTo({
        url: `/pages/postdetail/postdetail?id=${_id}&list=${infos}&province=${province}&city=${city}&district=${district}`
      })
    })
    .catch(console.error)
}


const goSearch = e => {
  let type = e.currentTarget.dataset.type
  let inputvalue = e.detail.value
  wx.navigateTo({
    url: `/pages/search/search?type=${type}&inputvalue=${inputvalue}`,
  })
}

const goBackHome = e => {
  wx.switchTab({
    url: `/pages/index/index`,
  })
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const isEmpty = obj => {
  if (typeof obj == "undefined" || obj == null || obj == "") {
    return true;
  } else {
    return false;
  }
}

const handlerGohomeClick = e => {
  wx.switchTab({
    url: '/pages/index/index'
  });
}

const handlerGobackClick = e => {
  const pages = getCurrentPages();
  if (pages.length >= 2) {
    wx.navigateBack({
      delta: 1
    });
  } else {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
}




const goIdiomDetail = e => {
  let _id = e.currentTarget.dataset.id
  wx.cloud.callFunction({
      name: 'collection_count_opened',
      data: {
        database: e.currentTarget.dataset.db,
        id: _id
      },
    }).then(res => {
      wx.navigateTo({
        url: `/pages/idiomdetail/idiomdetail?id=${e.currentTarget.dataset.id}&name=${e.currentTarget.dataset.name}`
      })
    })
    .catch(console.error)
}

const goCoupletDetail = e => {
  let _id = e.currentTarget.dataset.id
  wx.cloud.callFunction({
      name: 'collection_count_opened',
      data: {
        database: e.currentTarget.dataset.db,
        id: _id
      },
    }).then(res => {
      wx.navigateTo({
        url: `/pages/coupletdetail/coupletdetail?id=${e.currentTarget.dataset.id}&name=${e.currentTarget.dataset.name}`
      })
    })
    .catch(console.error)
}

//避免页面重复跳转
function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }
  let _lastTime = null // 返回新的函数 
  return function () {
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments) //将this和参数传给原函数 
      _lastTime = _nowTime
    }
  }
}

function ShareAppMessage() {
  wx.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  })
  return {
    title: '让知识触手可及',
    path: 'pages/index/index'
  }
}


function ShareTimeline() {
  return {
    title: '让知识触手可及',
    query: {},
    imageUrl: ''
  }
}

module.exports = {
  ShareAppMessage: ShareAppMessage,
  ShareTimeline: ShareTimeline,
  formatTime: formatTime,
  goKnowledgeDetail: goKnowledgeDetail,
  isEmpty: isEmpty,
  goSearch: goSearch,
  goIdiomDetail: goIdiomDetail,
  goCoupletDetail:goCoupletDetail,
  goPostDetail: goPostDetail,
  goPostDetailByAddr: goPostDetailByAddr,
  throttle: throttle,
  goBackHome: goBackHome,
  handlerGohomeClick: handlerGohomeClick,
  handlerGobackClick: handlerGobackClick
}