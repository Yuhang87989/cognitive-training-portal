Page({
  getPhoneNumber: function(e) {
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      wx.showToast({ title: '已取消授权', icon: 'none' });
      setTimeout(function() { wx.navigateBack(); }, 1500);
      return;
    }
    
    var cloudID = e.detail.cloudID;
    if (!cloudID) {
      wx.showToast({ title: '获取失败，请重试', icon: 'none' });
      return;
    }
    
    wx.showLoading({ title: '绑定中...' });
    
    // 通过云函数解密手机号
    wx.cloud.callFunction({
      name: 'getPhone',
      data: { cloudID: cloudID },
      success: function(res) {
        wx.hideLoading();
        var phone = res.result && res.result.phoneNumber;
        if (phone) {
          // 存到全局和本地
          var app = getApp();
          app.globalData.phone = phone;
          wx.setStorageSync('boundPhone', phone);
          
          wx.showToast({ title: '绑定成功', icon: 'success' });
          
          // 返回上一页，通知web-view刷新
          setTimeout(function() {
            var pages = getCurrentPages();
            if (pages.length > 1) {
              var prevPage = pages[pages.length - 2];
              if (prevPage && prevPage.onPhoneBound) {
                prevPage.onPhoneBound(phone);
              }
            }
            wx.navigateBack();
          }, 1500);
        } else {
          wx.showToast({ title: '获取手机号失败', icon: 'none' });
        }
      },
      fail: function(err) {
        wx.hideLoading();
        console.error('getPhone cloud function failed:', err);
        wx.showToast({ title: '服务异常，请重试', icon: 'none' });
      }
    });
  }
});
