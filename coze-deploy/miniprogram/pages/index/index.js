Page({
  data: {
    url: ''
  },
  
  onLoad: function() {
    var app = getApp()
    var openid = app.globalData.openid
    var envId = app.globalData.cloudEnvId
    var h5Url = app.globalData.h5Url
    var phone = wx.getStorageSync('boundPhone') || app.globalData.phone || ''
    
    // 构建URL，带上openid、env和phone
    var params = [];
    if (openid) params.push('openid=' + openid);
    if (envId) params.push('env=' + envId);
    if (phone) params.push('phone=' + phone);
    
    if (openid) {
      this.setData({
        url: h5Url + (params.length ? '?' + params.join('&') : '')
      });
    } else {
      this._waitForOpenId();
    }
  },
  
  // 手机号绑定成功回调
  onPhoneBound: function(phone) {
    var app = getApp();
    app.globalData.phone = phone;
    wx.setStorageSync('boundPhone', phone);
    
    // 刷新web-view URL，带上phone参数
    var openid = app.globalData.openid;
    var envId = app.globalData.cloudEnvId;
    var h5Url = app.globalData.h5Url;
    var params = [];
    if (openid) params.push('openid=' + openid);
    if (envId) params.push('env=' + envId);
    params.push('phone=' + phone);
    params.push('_t=' + Date.now()); // 防缓存
    
    this.setData({
      url: h5Url + '?' + params.join('&')
    });
  },
  
  _waitForOpenId: function() {
    var self = this
    var retryCount = 0
    var timer = setInterval(function() {
      var app = getApp()
      if (app.globalData.openid) {
        clearInterval(timer)
        var openid = app.globalData.openid;
        var envId = app.globalData.cloudEnvId;
        var h5Url = app.globalData.h5Url;
        var phone = wx.getStorageSync('boundPhone') || app.globalData.phone || '';
        var params = ['openid=' + openid];
        if (envId) params.push('env=' + envId);
        if (phone) params.push('phone=' + phone);
        self.setData({
          url: h5Url + '?' + params.join('&')
        });
      }
      retryCount++;
      if (retryCount > 30) {
        clearInterval(timer);
        var app = getApp();
        var h5Url = app.globalData.h5Url;
        var phone = wx.getStorageSync('boundPhone') || '';
        var params = [];
        if (phone) params.push('phone=' + phone);
        self.setData({
          url: h5Url + (params.length ? '?' + params.join('&') : '')
        });
        console.warn('获取openid超时，降级为无云同步模式');
      }
    }, 1000);
  },
  
  // 接收 H5 页面消息
  onMessage: function(e) {
    var data = e.detail.data;
    if (data && data.length > 0) {
      var msg = data[data.length - 1];
      if (msg.action === 'syncData') {
        this._syncToCloud(msg.payload);
      } else if (msg.action === 'bindPhone') {
        // H5请求绑定手机号，跳转到绑定页面
        wx.navigateTo({ url: '/pages/bind-phone/index' });
      }
    }
  },
  
  _syncToCloud: function(payload) {
    if (!payload) return;
    var db = wx.cloud.database();
    var openid = getApp().globalData.openid;
    
    db.collection('user_data').where({
      _openid: openid,
      type: payload.type
    }).get({
      success: function(res) {
        var updateData = {
          data: payload.data,
          version: db.command.inc(1),
          updatedAt: new Date().toISOString()
        };
        
        if (res.data && res.data.length > 0) {
          db.collection('user_data').doc(res.data[0]._id).update({
            data: updateData
          });
        } else {
          updateData.type = payload.type;
          db.collection('user_data').add({
            data: updateData
          });
        }
      }
    });
  }
});
