// ==========================================
// V195 认知能力模型
// 5个核心维度，用于雷达图展示
// ==========================================

window.ABILITY_DIMENSIONS = {
  attention: {
    id: 'attention',
    name: '专注力',
    icon: '🎯',
    color: '#667eea',
    sources: ['schulte', 'visualSearch', 'colorMatch'],
    weight: 0.25,
    desc: '抗干扰能力与持续专注时长'
  },
  memory: {
    id: 'memory',
    name: '记忆力',
    icon: '🧠',
    color: '#f093fb',
    sources: ['imageMemory', 'numberMemory'],
    weight: 0.25,
    desc: '短时记忆与长时记忆能力'
  },
  thinking: {
    id: 'thinking',
    name: '思维力',
    icon: '💡',
    color: '#43e97b',
    sources: ['reasoning'],
    weight: 0.20,
    desc: '逻辑推理与问题解决能力'
  },
  speed: {
    id: 'speed',
    name: '反应力',
    icon: '⚡',
    color: '#fa709a',
    sources: ['quickClick'],
    weight: 0.15,
    desc: '信息处理与反应速度'
  },
  persistence: {
    id: 'persistence',
    name: '坚持力',
    icon: '🔥',
    color: '#fee140',
    sources: ['streakDays', 'totalDuration'],
    weight: 0.15,
    desc: '持续训练的毅力与韧性'
  }
};

// 计算用户能力得分
window.calculateAbilityScores = function(userData) {
  const scores = {};
  const trainingHistory = userData?.trainingHistory || [];
  
  Object.keys(ABILITY_DIMENSIONS).forEach(dimId => {
    const dim = ABILITY_DIMENSIONS[dimId];
    
    if (dimId === 'persistence') {
      // 坚持力基于训练天数和时长
      const streak = userData?.streakDays || 0;
      const duration = (userData?.totalDuration || 0) / 60; // 分钟
      const streakScore = Math.min(streak * 5, 50); // 最多50分
      const durationScore = Math.min(duration * 0.5, 50); // 最多50分
      scores[dimId] = Math.round(streakScore + durationScore);
    } else {
      // 其他维度基于训练历史
      const recentTrainings = trainingHistory.filter(t => 
        dim.sources.includes(t.type)).slice(-7);
      
      if (recentTrainings.length === 0) {
        scores[dimId] = 50; // 默认中等
      } else {
        // 最近7次60% + 历史所有40%
        const recentAvg = recentTrainings.reduce((sum, t) => 
          sum + (t.accuracy || 70), 0) / recentTrainings.length;
        const allTrainings = trainingHistory.filter(t => 
          dim.sources.includes(t.type));
        const allAvg = allTrainings.length > 0 
          ? allTrainings.reduce((sum, t) => 
            sum + (t.accuracy || 70), 0) / allTrainings.length 
          : 70;
        scores[dimId] = Math.round(recentAvg * 0.6 + allAvg * 0.4);
      }
    }
    
    // 限制0-100
    scores[dimId] = Math.max(0, Math.min(100, scores[dimId]));
  });
  
  return scores;
};

// 获取能力等级文字
window.getAbilityLevel = function(score) {
  if (score >= 80) return { text: '优秀', color: '#43e97b' };
  if (score >= 60) return { text: '良好', color: '#667eea' };
  if (score >= 40) return { text: '中等', color: '#f5af19' };
  return { text: '需加强', color: '#ff6b6b' };
};
