const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { module, action, data, pointsEarned } = event
  
  await db.collection('training_records').add({
    data: {
      _openid: openid,
      module: module,
      action: action,
      data: data || {},
      pointsEarned: pointsEarned || 0,
      createdAt: new Date().toISOString()
    }
  })
  
  // 更新用户最后活跃时间
  const userRes = await db.collection('users')
    .where({ _openid: openid })
    .get()
  
  if (userRes.data.length > 0) {
    await db.collection('users').doc(userRes.data[0]._id).update({
      data: {
        lastActiveAt: new Date().toISOString()
      }
    })
  }
  
  return { success: true }
}
