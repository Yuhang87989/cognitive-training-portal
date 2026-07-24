const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { type, data, action } = event
  
  if (action === 'save') {
    // 保存用户数据
    const existing = await db.collection('user_data')
      .where({ _openid: openid, type: type })
      .get()
    
    if (existing.data.length > 0) {
      // 更新
      await db.collection('user_data').doc(existing.data[0]._id).update({
        data: {
          data: data,
          version: _.inc(1),
          updatedAt: new Date().toISOString()
        }
      })
    } else {
      // 新增
      await db.collection('user_data').add({
        data: {
          _openid: openid,
          type: type,
          data: data,
          version: 1,
          updatedAt: new Date().toISOString()
        }
      })
    }
    return { success: true }
  }
  
  if (action === 'load') {
    // 加载用户数据
    const result = await db.collection('user_data')
      .where({ _openid: openid })
      .get()
    return { success: true, data: result.data }
  }
  
  return { success: false, message: 'unknown action' }
}
