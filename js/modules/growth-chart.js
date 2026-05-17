// ==========================================
// V195 成长曲线图
// 展示日/周/月三个维度的进步趋势
// ==========================================

window.renderGrowthChart = function(canvasId, dataType) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const padding = 40;
  
  ctx.clearRect(0, 0, width, height);
  
  const user = getCurrentUserData();
  const history = user?.trainingHistory || [];
  
  let data = [];
  let labels = [];
  
  if (dataType === 'day') {
    const today = new Date();
    const todayStr = today.toDateString();
    const todayTrainings = history.filter(t => 
      new Date(t.timestamp || Date.now()).toDateString() === todayStr
    );
    
    for (let h = 8; h <= 22; h++) {
      const hourTrainings = todayTrainings.filter(t => {
        const d = new Date(t.timestamp || Date.now());
        return d.getHours() === h;
      });
      const avgAcc = hourTrainings.length > 0
        ? hourTrainings.reduce((s, t) => s + (t.accuracy || 70), 0) / hourTrainings.length
        : null;
      data.push(avgAcc);
      labels.push(h + ':00');
    }
  } else if (dataType === 'week') {
    for (let d = 6; d >= 0; d--) {
      const date = new Date();
      date.setDate(date.getDate() - d);
      const dateStr = date.toDateString();
      const dayTrainings = history.filter(t => 
        new Date(t.timestamp || Date.now()).toDateString() === dateStr
      );
      const avgAcc = dayTrainings.length > 0
        ? dayTrainings.reduce((s, t) => s + (t.accuracy || 70), 0) / dayTrainings.length
        : null;
      data.push(avgAcc);
      labels.push(date.getMonth() + 1 + '/' + date.getDate());
    }
  } else {
    const now = new Date();
    for (let m = 3; m >= 0; m--) {
      const date = new Date(now.getFullYear(), now.getMonth() - m, 1);
      const monthStr = (date.getMonth() + 1) + '月';
      const monthTrainings = history.filter(t => {
        const d = new Date(t.timestamp || Date.now());
        return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
      });
      const avgAcc = monthTrainings.length > 0
        ? monthTrainings.reduce((s, t) => s + (t.accuracy || 70), 0) / monthTrainings.length
        : null;
      data.push(avgAcc);
      labels.push(monthStr);
    }
  }
  
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  const validData = data.filter(d => d !== null);
  const minVal = validData.length > 0 ? Math.max(0, Math.min(...validData) - 10) : 0;
  const maxVal = validData.length > 0 ? Math.min(100, Math.max(...validData) + 10) : 100;
  
  ctx.strokeStyle = 'rgba(0,0,0,0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding + (chartHeight / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
    
    ctx.fillStyle = '#999';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(maxVal - ((maxVal - minVal) / 4) * i) + '%', padding - 5, y + 3);
  }
  
  ctx.beginPath();
  let hasValidPoints = false;
  data.forEach((val, i) => {
    if (val === null) return;
    hasValidPoints = true;
    const x = padding + (chartWidth / (data.length - 1)) * i;
    const y = padding + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;
    if (i === 0 || data.slice(0, i).every(d => d === null)) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  
  if (hasValidPoints) {
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(102, 126, 234, 0.3)');
    gradient.addColorStop(1, 'rgba(102, 126, 234, 0.05)');
    
    ctx.lineTo(padding + chartWidth, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.beginPath();
    data.forEach((val, i) => {
      if (val === null) return;
      const x = padding + (chartWidth / (data.length - 1)) * i;
      const y = padding + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;
      if (i === 0 || data.slice(0, i).every(d => d === null)) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    data.forEach((val, i) => {
      if (val === null) return;
      const x = padding + (chartWidth / (data.length - 1)) * i;
      const y = padding + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#667eea';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }
  
  ctx.fillStyle = '#999';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'center';
  labels.forEach((label, i) => {
    const x = padding + (chartWidth / (data.length - 1)) * i;
    ctx.fillText(label, x, height - 15);
  });
};

window.renderGrowthStats = function(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const user = getCurrentUserData();
  const history = user?.trainingHistory || [];
  
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  
  const thisWeek = history.filter(t => new Date(t.timestamp || Date.now()) > weekAgo);
  const lastWeek = history.filter(t => {
    const d = new Date(t.timestamp || Date.now());
    return d > twoWeeksAgo && d <= weekAgo;
  });
  
  const thisWeekAvg = thisWeek.length > 0
    ? Math.round(thisWeek.reduce((s, t) => s + (t.accuracy || 70), 0) / thisWeek.length)
    : 0;
  const lastWeekAvg = lastWeek.length > 0
    ? Math.round(lastWeek.reduce((s, t) => s + (t.accuracy || 70), 0) / lastWeek.length)
    : 0;
  
  const diff = thisWeekAvg - lastWeekAvg;
  const diffText = diff > 0 ? `↑ ${diff}%` : diff < 0 ? `↓ ${Math.abs(diff)}%` : '-';
  const diffColor = diff > 0 ? '#43e97b' : diff < 0 ? '#ff6b6b' : '#999';
  
  container.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:16px;">
      <div style="text-align:center;padding:16px;background:linear-gradient(135deg,#667eea10,#764ba210);border-radius:12px;">
        <div style="font-size:28px;font-weight:bold;color:#667eea;">${thisWeek.length}</div>
        <div style="font-size:12px;color:#666;margin-top:4px;">本周训练次数</div>
      </div>
      <div style="text-align:center;padding:16px;background:linear-gradient(135deg,#43e97b10,#38f9d710);border-radius:12px;">
        <div style="font-size:28px;font-weight:bold;color:#43e97b;">${thisWeekAvg}%</div>
        <div style="font-size:12px;color:#666;margin-top:4px;">本周正确率</div>
      </div>
      <div style="text-align:center;padding:16px;background:linear-gradient(135deg,#fa709a10,#fee14010);border-radius:12px;">
        <div style="font-size:28px;font-weight:bold;color:${diffColor};">${diffText}</div>
        <div style="font-size:12px;color:#666;margin-top:4px;">环比上周</div>
      </div>
    </div>
  `;
};
