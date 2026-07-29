// 云函数：通过cloudID获取微信手机号
exports.main = async (event) => {
  try {
    var cloudID = event.cloudID;
    if (!cloudID) {
      return { success: false, message: '缺少cloudID' };
    }
    
    // 云开发直接通过cloudID解密获取手机号
    var res = await wx.cloud.getOpenData({
      list: [cloudID]
    });
    
    if (res.list && res.list.length > 0 && res.list[0].data) {
      var phoneInfo = res.list[0].data;
      var phoneNumber = phoneInfo.phoneNumber || '';
      return { success: true, phoneNumber: phoneNumber };
    }
    
    return { success: false, message: '解密失败' };
  } catch (err) {
    console.error('getPhone error:', err);
    return { success: false, message: err.message || '服务异常' };
  }
};
