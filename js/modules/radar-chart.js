// ==========================================
// V195 五边形能力雷达图
// 纯Canvas实现，无第三方依赖
// ==========================================

window.renderAbilityRadar = function(canvasId, scores) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.38;
  
  ctx.clearRect(0, 0, width, height);
  
  const dimensions = Object.keys(ABILITY_DIMENSIONS);
  const dimCount = dimensions.length;
  const angleStep = (Math.PI * 2) / dimCount;
  
  ctx.strokeStyle = 'rgba(102, 126, 234, 0.15)';
  ctx.lineWidth = 1;
  for (let i = 1; i <= 5; i++) {
    ctx.beginPath();
    const r = radius * (i / 5);
    for (let j = 0; j <= dimCount; j++) {
      const angle = j * angleStep - Math.PI / 2;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      if (j === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }
  
  ctx.strokeStyle = 'rgba(102, 126, 234, 0.2)';
  for (let i = 0; i < dimCount; i++) {
    const angle = i * angleStep - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
    ctx.stroke();
  }
  
  ctx.beginPath();
  dimensions.forEach((dimId, i) => {
    const score = scores[dimId] || 0;
    const scoreRatio = score / 100;
    const angle = i * angleStep - Math.PI / 2;
    const x = centerX + radius * scoreRatio * Math.cos(angle);
    const y = centerY + radius * scoreRatio * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
  gradient.addColorStop(0, 'rgba(102, 126, 234, 0.4)');
  gradient.addColorStop(1, 'rgba(240, 147, 251, 0.2)');
  ctx.fillStyle = gradient;
  ctx.fill();
  
  ctx.strokeStyle = 'rgba(102, 126, 234, 0.8)';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  dimensions.forEach((dimId, i) => {
    const score = scores[dimId] || 0;
    const scoreRatio = score / 100;
    const angle = i * angleStep - Math.PI / 2;
    const x = centerX + radius * scoreRatio * Math.cos(angle);
    const y = centerY + radius * scoreRatio * Math.sin(angle);
    
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = ABILITY_DIMENSIONS[dimId].color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    const labelAngle = i * angleStep - Math.PI / 2;
    const labelR = radius + 30;
    const labelX = centerX + labelR * Math.cos(labelAngle);
    const labelY = centerY + labelR * Math.sin(labelAngle);
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '18px sans-serif';
    ctx.fillText(ABILITY_DIMENSIONS[dimId].icon, labelX, labelY - 10);
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#333';
    ctx.fillText(ABILITY_DIMENSIONS[dimId].name, labelX, labelY + 10);
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = ABILITY_DIMENSIONS[dimId].color;
    ctx.fillText(score + '分', labelX, labelY + 28);
  });
};

window.renderAbilityCards = function(containerId, scores) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  let html = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;padding:16px;">';
  
  Object.keys(ABILITY_DIMENSIONS).forEach(dimId => {
    const dim = ABILITY_DIMENSIONS[dimId];
    const score = scores[dimId] || 0;
    const level = getAbilityLevel(score);
    
    html += `
      <div onclick="switchToModule('${dim.sources[0]}')" 
           style="background:linear-gradient(135deg,${dim.color}20,${dim.color}05);
                  border-radius:12px;padding:16px;cursor:pointer;
                  border-left:4px solid ${dim.color};
                  transition:transform 0.2s,box-shadow 0.2s;"
           onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'"
           onmouseout="this.style.transform='';this.style.boxShadow=''">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <span style="font-size:24px;">${dim.icon}</span>
          <span style="font-weight:600;font-size:14px;color:#333;">${dim.name}</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-weight:bold;font-size:24px;color:${dim.color}">${score}</span>
          <span style="font-size:12px;color:${level.color};background:${level.color}20;padding:2px 8px;border-radius:10px;">${level.text}</span>
        </div>
        <div style="height:6px;background:#eee;border-radius:3px;margin-top:8px;overflow:hidden;">
          <div style="width:${score}%;height:100%;background:linear-gradient(90deg,${dim.color},${dim.color}cc);border-radius:3px;"></div>
        </div>
        <div style="font-size:11px;color:#999;margin-top:6px;">${dim.desc}</div>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
};
