Page({
  data: {
    url: ''
  },
  
  onLoad: function() {
    var app = getApp()
    var openid = app.globalData.openid
    var envId = app.globalData.cloudEnvId
    var h5Url = app.globalData.h5Url
    
    // 等待 openid 获取完成后再加载 web-view
    if (openid) {
      this.setData({
        url: h5Url + '?openid=' + openid + '&env=' + envId
      })
    } else {
      // openid 还没获取到，等一下
      this._waitForOpenId()
    }
  },
  
  _waitForOpenId: function() {
    var self = this
    var retryCount = 0
    var timer = setInterval(function() {
      var app = getApp()
      if (app.globalData.openid) {
        clearInterval(timer)
        self.setData({
          url: app.globalData.h5Url + '?openid=' + app.globalData.openid + '&env=' + app.globalData.cloudEnvId
        })
      }
      retryCount++
      if (retryCount > 30) {
        // 30秒还没获取到openid，直接加载H5（无云同步模式）
        clearInterval(timer)
        self.setData({
          url: app.globalData.h5Url
        })
        console.warn('获取openid超时，降级为无云同步模式')
      }
    }, 1000)
  },
  
  // 接收 H5 页面消息
  onMessage: function(e) {
    var data = e.detail.data
    if (data && data.length > 0) {
      var msg = data[data.length - 1]
      if (msg.action === 'syncData') {
        // H5请求同步数据到云端
        this._syncToCloud(msg.payload)
      } else if (msg.action === 'getUserInfo') {
        // H5请求获取用户信息
        this._getUserInfo()
      }
    }
  },
  
  _syncToCloud: function(payload) {
    if (!payload) return
    var db = wx.cloud.database()
    var openid = getApp().globalData.openid
    
    db.collection('user_data').where({
      _openid: openid,
      type: payload.type
    }).get({
      success: function(res) {
        var updateData = {
          data: payload.data,
          version: db.command.inc(1),
          updatedAt: new Date().toISOString()
        }
        
        if (res.data && res.data.length > 0) {
          db.collection('user_data').doc(res.data[0]._id).update({
            data: updateData
          })
        } else {
          updateData.type = payload.type
          db.collection('user_data').add({
            data: updateData
          })
        }
      }
    })
  },
  
  _getUserInfo: function() {
    // 获取微信用户信息
    // 2026年使用 getUserProfile
    // 这里仅作为消息通道，实际用户信息在H5端通过openid关联
  }
})
