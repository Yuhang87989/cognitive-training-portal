App({
  onLaunch: function() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      return
    }
    
    wx.cloud.init({
      env: 'cloudbase-d4g0dkg6n553af199',  // 替换为实际环境ID
      traceUser: true
    })
    
    // 获取 openid
    this.getOpenId()
  },
  
  getOpenId: function() {
    var self = this
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: function(res) {
        self.globalData.openid = res.result.openid
        console.log('获取openid成功:', res.result.openid)
      },
      fail: function(err) {
        console.error('获取openid失败:', err)
      }
    })
  },
  
  globalData: {
    openid: '',
    cloudEnvId: 'cloudbase-d4g0dkg6n553af199',
    h5Url: 'https://6mz7txgx3f.coze.site'
  }
})
