/**
 * DeepSeek 使用统计模块
 * 记录每次API调用的时间、Token消耗等信息
 * 提供统计展示、阈值提醒、数据导出功能
 */

var UsageStatsModule = {
  name: 'usage-stats',
  title: 'AI使用统计',
  icon: '📊',
  
  // localStorage key
  STORAGE_KEY: 'deepseek_usage_stats',
  SETTINGS_KEY: 'deepseek_usage_settings',
  
  // 统计数据
  state: {
    records: [],          // 使用记录
    settings: {           // 设置
      dailyTokenThreshold: 50000,  // 每日Token阈值
      alertEnabled: true,          // 启用提醒
      alertSound: false            // 声音提醒
    }
  },
  
  /**
   * 初始化
   */
  init: function() {
    this.loadRecords();
    this.loadSettings();
  },
  
  /**
   * 加载记录
   */
  loadRecords: function() {
    try {
      var stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.state.records = JSON.parse(stored);
      }
    } catch (e) {
      console.error('加载使用记录失败:', e);
      this.state.records = [];
    }
  },
  
  /**
   * 保存记录
   */
  saveRecords: function() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state.records));
  },
  
  /**
   * 加载设置
   */
  loadSettings: function() {
    try {
      var stored = localStorage.getItem(this.SETTINGS_KEY);
      if (stored) {
        var parsedSettings = JSON.parse(stored);
        for (var key in parsedSettings) {
          if (parsedSettings.hasOwnProperty(key)) {
            this.state.settings[key] = parsedSettings[key];
          }
        }
      }
    } catch (e) {
      console.error('加载使用设置失败:', e);
    }
  },
  
  /**
   * 保存设置
   */
  saveSettings: function() {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(this.state.settings));
  },
  
  /**
   * 记录一次API调用
   * @param {number} inputTokens - 输入Token数
   * @param {number} outputTokens - 输出Token数
   * @param {string} questionSummary - 问题摘要
   * @param {string} model - 使用的模型
   */
  recordUsage: function(inputTokens, outputTokens, questionSummary, model) {
    if (questionSummary === undefined) questionSummary = '';
    if (model === undefined) model = 'deepseek-chat';
    
    var record = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      timestamp: Date.now(),
      inputTokens: inputTokens || 0,
      outputTokens: outputTokens || 0,
      totalTokens: (inputTokens || 0) + (outputTokens || 0),
      questionSummary: this.truncateText(questionSummary, 100),
      model: model,
      estimatedCost: this.calculateCost(inputTokens, outputTokens)
    };
    
    this.state.records.unshift(record);
    
    // 最多保留1000条记录
    if (this.state.records.length > 1000) {
      this.state.records = this.state.records.slice(0, 1000);
    }
    
    this.saveRecords();
    
    // 检查是否超过当日阈值
    this.checkDailyThreshold();
    
    return record;
  },
  
  /**
   * 计算估算费用（人民币）
   * DeepSeek定价：输入约¥1/百万tokens，输出约¥2/百万tokens
   */
  calculateCost: function(inputTokens, outputTokens) {
    var inputCost = (inputTokens || 0) * 0.000001;
    var outputCost = (outputTokens || 0) * 0.000002;
    return inputCost + outputCost;
  },
  
  /**
   * 截断文本
   */
  truncateText: function(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  },
  
  /**
   * 检查当日Token使用是否超过阈值
   */
  checkDailyThreshold: function() {
    if (!this.state.settings.alertEnabled) return;
    
    var todayStats = this.getTodayStats();
    if (todayStats.totalTokens >= this.state.settings.dailyTokenThreshold) {
      this.showThresholdAlert(todayStats);
    }
  },
  
  /**
   * 显示阈值提醒
   */
  showThresholdAlert: function(stats) {
    var threshold = this.state.settings.dailyTokenThreshold;
    var percentage = Math.round((stats.totalTokens / threshold) * 100);
    
    // 使用全局toast显示
    if (window.showToast) {
      window.showToast(
        '⚠️ 今日Token使用已达 ' + percentage + '%\n当前: ' + stats.totalTokens.toLocaleString() + ' / 阈值: ' + threshold.toLocaleString(),
        'warning'
      );
    }
    
    // 触发自定义事件
    try {
      var event = new CustomEvent('token-threshold-exceeded', {
        detail: {
          stats: stats,
          threshold: threshold,
          percentage: percentage
        }
      });
      window.dispatchEvent(event);
    } catch (e) {
      // 忽略不支持CustomEvent的浏览器
    }
  },
  
  /**
   * 获取今日统计
   */
  getTodayStats: function() {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    
    var todayRecords = this.state.records.filter(function(r) {
      var recordDate = new Date(r.timestamp);
      return recordDate >= today;
    });
    
    return this.calculateStats(todayRecords);
  },
  
  /**
   * 获取本周统计
   */
  getWeekStats: function() {
    var weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    var weekRecords = this.state.records.filter(function(r) {
      return r.timestamp >= weekAgo.getTime();
    });
    
    return this.calculateStats(weekRecords);
  },
  
  /**
   * 获取本月统计
   */
  getMonthStats: function() {
    var monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    
    var monthRecords = this.state.records.filter(function(r) {
      return r.timestamp >= monthAgo.getTime();
    });
    
    return this.calculateStats(monthRecords);
  },
  
  /**
   * 计算统计数据
   */
  calculateStats: function(records) {
    return {
      totalCalls: records.length,
      totalTokens: records.reduce(function(sum, r) { return sum + (r.totalTokens || 0); }, 0),
      totalInputTokens: records.reduce(function(sum, r) { return sum + (r.inputTokens || 0); }, 0),
      totalOutputTokens: records.reduce(function(sum, r) { return sum + (r.outputTokens || 0); }, 0),
      totalCost: records.reduce(function(sum, r) { return sum + (r.estimatedCost || 0); }, 0)
    };
  },
  
  /**
   * 获取按日期分组的统计数据（用于图表）
   * @param {number} days - 最近多少天
   */
  getDailyStats: function(days) {
    if (days === undefined) days = 7;
    var result = [];
    var now = new Date();
    
    for (var i = days - 1; i >= 0; i--) {
      var date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      var nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      var dayRecords = this.state.records.filter(function(r) {
        return r.timestamp >= date.getTime() && r.timestamp < nextDate.getTime();
      });
      
      var stats = this.calculateStats(dayRecords);
      result.push({
        date: date.toISOString().split('T')[0],
        label: (date.getMonth() + 1) + '/' + date.getDate(),
        totalCalls: stats.totalCalls,
        totalTokens: stats.totalTokens,
        totalInputTokens: stats.totalInputTokens,
        totalOutputTokens: stats.totalOutputTokens,
        totalCost: stats.totalCost
      });
    }
    
    return result;
  },
  
  /**
   * 分页获取记录
   */
  getRecordsPaged: function(page, pageSize, filterDate) {
    if (page === undefined) page = 1;
    if (pageSize === undefined) pageSize = 20;
    if (filterDate === undefined) filterDate = null;
    
    var filtered = this.state.records;
    
    if (filterDate) {
      var filterStart = new Date(filterDate);
      filterStart.setHours(0, 0, 0, 0);
      var filterEnd = new Date(filterStart);
      filterEnd.setDate(filterEnd.getDate() + 1);
      
      filtered = this.state.records.filter(function(r) {
        return r.timestamp >= filterStart.getTime() && r.timestamp < filterEnd.getTime();
      });
    }
    
    var startIndex = (page - 1) * pageSize;
    var endIndex = startIndex + pageSize;
    
    return {
      records: filtered.slice(startIndex, endIndex),
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / pageSize),
      currentPage: page
    };
  },
  
  /**
   * 清空所有记录
   */
  clearAllRecords: function() {
    this.state.records = [];
    this.saveRecords();
  },
  
  /**
   * 导出数据为JSON
   */
  exportJSON: function() {
    var data = {
      exportDate: new Date().toISOString(),
      totalRecords: this.state.records.length,
      records: this.state.records,
      settings: this.state.settings
    };
    
    return JSON.stringify(data, null, 2);
  },
  
  /**
   * 导出数据为CSV
   */
  exportCSV: function() {
    var headers = ['日期', '时间', '输入Token', '输出Token', '总计Token', '模型', '问题摘要', '估算费用(元)'];
    
    var rows = this.state.records.map(function(r) {
      var date = new Date(r.timestamp);
      return [
        date.toLocaleDateString('zh-CN'),
        date.toLocaleTimeString('zh-CN'),
        r.inputTokens,
        r.outputTokens,
        r.totalTokens,
        r.model,
        '"' + (r.questionSummary || '').replace(/"/g, '""') + '"',
        r.estimatedCost.toFixed(4)
      ].join(',');
    });
    
    return '\uFEFF' + headers.join(',') + '\n' + rows.join('\n');
  },
  
  /**
   * 下载文件
   */
  downloadFile: function(content, filename, mimeType) {
    var blob = new Blob([content], { type: mimeType });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },
  
  /**
   * 下载JSON导出文件
   */
  downloadJSON: function() {
    this.downloadFile(this.exportJSON(), 'deepseek-usage-' + new Date().toISOString().split('T')[0] + '.json', 'application/json');
  },
  
  /**
   * 下载CSV导出文件
   */
  downloadCSV: function() {
    this.downloadFile(this.exportCSV(), 'deepseek-usage-' + new Date().toISOString().split('T')[0] + '.csv', 'text/csv');
  },
  
  /**
   * 格式化数字
   */
  formatNumber: function(num) {
    return num.toLocaleString('zh-CN');
  },
  
  /**
   * 格式化费用
   */
  formatCost: function(cost) {
    return '¥' + cost.toFixed(2);
  },
  
  /**
   * 打开使用统计模态框
   */
  openUsageStatsModal: function() {
    var self = this;
    self.init();
    
    var todayStats = self.getTodayStats();
    var weekStats = self.getWeekStats();
    var monthStats = self.getMonthStats();
    
    var modal = document.createElement('div');
    modal.className = 'modal-overlay show';
    modal.id = 'usage-stats-modal';
    modal.onclick = function(e) {
      if (e.target === modal) {
        modal.remove();
      }
    };
    
    var currentPage = 1;
    var pageSize = 10;
    
    function renderRecordsList() {
      var paged = self.getRecordsPaged(currentPage, pageSize);
      var html = '';
      
      if (paged.records.length === 0) {
        html = '<div style="text-align:center;padding:30px;color:#999;">暂无使用记录</div>';
      } else {
        html = '<div style="max-height:300px;overflow-y:auto;">';
        paged.records.forEach(function(r, index) {
          var date = new Date(r.timestamp);
          var timeStr = date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'});
          html += '<div style="padding:12px;border-bottom:1px solid #eee;' + (index === paged.records.length - 1 ? 'border-bottom:none;' : '') + '">';
          html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">';
          html += '<span style="font-size:13px;color:#666;">' + timeStr + '</span>';
          html += '<span style="font-size:14px;font-weight:600;color:#667eea;">' + self.formatNumber(r.totalTokens) + ' Tokens</span>';
          html += '</div>';
          if (r.questionSummary) {
            html += '<div style="font-size:12px;color:#999;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + escapeHtml(r.questionSummary) + '</div>';
          }
          html += '<div style="display:flex;gap:15px;font-size:11px;color:#bbb;margin-top:4px;">';
          html += '<span>输入: ' + r.inputTokens + '</span>';
          html += '<span>输出: ' + r.outputTokens + '</span>';
          html += '<span>费用: ¥' + r.estimatedCost.toFixed(4) + '</span>';
          html += '</div>';
          html += '</div>';
        });
        html += '</div>';
        
        // 分页
        if (paged.totalPages > 1) {
          html += '<div style="display:flex;justify-content:center;align-items:center;gap:10px;margin-top:15px;padding-top:15px;border-top:1px solid #eee;">';
          html += '<button class="btn-small btn-secondary" onclick="updateUsageStatsPage(' + (currentPage - 1) + ')" ' + (currentPage === 1 ? 'disabled' : '') + '>上一页</button>';
          html += '<span style="font-size:13px;color:#666;">' + currentPage + ' / ' + paged.totalPages + '</span>';
          html += '<button class="btn-small btn-secondary" onclick="updateUsageStatsPage(' + (currentPage + 1) + ')" ' + (currentPage === paged.totalPages ? 'disabled' : '') + '>下一页</button>';
          html += '</div>';
        }
      }
      
      var listEl = document.getElementById('usage-records-list');
      if (listEl) {
        listEl.innerHTML = html;
      }
    }
    
    window.updateUsageStatsPage = function(page) {
      if (page < 1) return;
      currentPage = page;
      renderRecordsList();
    };
    
    window.refreshUsageStats = function() {
      self.init();
      todayStats = self.getTodayStats();
      weekStats = self.getWeekStats();
      monthStats = self.getMonthStats();
      
      // 更新统计卡片
      var todayTokens = document.getElementById('today-tokens');
      if (todayTokens) todayTokens.textContent = self.formatNumber(todayStats.totalTokens);
      var todayCalls = document.getElementById('today-calls');
      if (todayCalls) todayCalls.textContent = todayStats.totalCalls + ' 次';
      var todayCost = document.getElementById('today-cost');
      if (todayCost) todayCost.textContent = self.formatCost(todayStats.totalCost);
      
      var weekTokens = document.getElementById('week-tokens');
      if (weekTokens) weekTokens.textContent = self.formatNumber(weekStats.totalTokens);
      var weekCalls = document.getElementById('week-calls');
      if (weekCalls) weekCalls.textContent = weekStats.totalCalls + ' 次';
      var weekCost = document.getElementById('week-cost');
      if (weekCost) weekCost.textContent = self.formatCost(weekStats.totalCost);
      
      var monthTokens = document.getElementById('month-tokens');
      if (monthTokens) monthTokens.textContent = self.formatNumber(monthStats.totalTokens);
      var monthCalls = document.getElementById('month-calls');
      if (monthCalls) monthCalls.textContent = monthStats.totalCalls + ' 次';
      var monthCost = document.getElementById('month-cost');
      if (monthCost) monthCost.textContent = self.formatCost(monthStats.totalCost);
      
      currentPage = 1;
      renderRecordsList();
    };
    
    window.clearAllUsageRecords = function() {
      if (confirm('确定要清空所有使用记录吗？此操作不可恢复！')) {
        self.clearAllRecords();
        window.refreshUsageStats();
        window.showToast('记录已清空');
      }
    };
    
    window.exportUsageJSON = function() {
      self.downloadJSON();
      window.showToast('JSON导出成功');
    };
    
    window.exportUsageCSV = function() {
      self.downloadCSV();
      window.showToast('CSV导出成功');
    };
    
    modal.innerHTML = `
      <div class="modal-content" style="max-width:650px;max-height:90vh;overflow-y:auto;">
        <div class="modal-header">
          <h3>📊 AI 使用统计</h3>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
        </div>
        <div class="modal-body" style="padding:20px;">
          <!-- 统计概览卡片 -->
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px;">
            <div style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:12px;padding:15px;color:white;text-align:center;">
              <div style="font-size:12px;opacity:0.8;margin-bottom:6px;">今日</div>
              <div style="font-size:20px;font-weight:bold;" id="today-tokens">` + self.formatNumber(todayStats.totalTokens) + `</div>
              <div style="font-size:11px;opacity:0.7;margin-top:4px;">
                <span id="today-calls">` + todayStats.totalCalls + ` 次</span> · 
                <span id="today-cost">` + self.formatCost(todayStats.totalCost) + `</span>
              </div>
            </div>
            <div style="background:linear-gradient(135deg,#11998e,#38ef7d);border-radius:12px;padding:15px;color:white;text-align:center;">
              <div style="font-size:12px;opacity:0.8;margin-bottom:6px;">本周</div>
              <div style="font-size:20px;font-weight:bold;" id="week-tokens">` + self.formatNumber(weekStats.totalTokens) + `</div>
              <div style="font-size:11px;opacity:0.7;margin-top:4px;">
                <span id="week-calls">` + weekStats.totalCalls + ` 次</span> · 
                <span id="week-cost">` + self.formatCost(weekStats.totalCost) + `</span>
              </div>
            </div>
            <div style="background:linear-gradient(135deg,#eb3349,#f45c43);border-radius:12px;padding:15px;color:white;text-align:center;">
              <div style="font-size:12px;opacity:0.8;margin-bottom:6px;">本月</div>
              <div style="font-size:20px;font-weight:bold;" id="month-tokens">` + self.formatNumber(monthStats.totalTokens) + `</div>
              <div style="font-size:11px;opacity:0.7;margin-top:4px;">
                <span id="month-calls">` + monthStats.totalCalls + ` 次</span> · 
                <span id="month-cost">` + self.formatCost(monthStats.totalCost) + `</span>
              </div>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap;">
            <button class="btn-small btn-primary" onclick="refreshUsageStats()">🔄 刷新</button>
            <button class="btn-small btn-secondary" onclick="exportUsageJSON()">📥 导出JSON</button>
            <button class="btn-small btn-secondary" onclick="exportUsageCSV()">📊 导出CSV</button>
            <button class="btn-small btn-danger" onclick="clearAllUsageRecords()">🗑️ 清空记录</button>
          </div>
          
          <!-- 使用记录列表 -->
          <div style="border:1px solid #e0e0e0;border-radius:12px;overflow:hidden;">
            <div style="background:#f8f9fa;padding:12px 15px;border-bottom:1px solid #e0e0e0;">
              <h4 style="margin:0;font-size:14px;color:#333;">📋 使用记录明细</h4>
            </div>
            <div id="usage-records-list" style="background:white;">
              <!-- 记录列表将在这里渲染 -->
            </div>
          </div>
          
          <!-- 说明 -->
          <div style="margin-top:20px;padding:15px;background:#fff9e6;border-radius:8px;border-left:4px solid #ffc107;">
            <div style="font-size:13px;color:#856404;font-weight:500;margin-bottom:8px;">💡 定价说明</div>
            <div style="font-size:12px;color:#856404;line-height:1.6;">
              • 输入Token：约 ¥1.00 / 百万 Token<br>
              • 输出Token：约 ¥2.00 / 百万 Token<br>
              • 以上为DeepSeek官方定价，实际费用以账单为准
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    modal.classList.add("show");
    renderRecordsList();
  }
};

// 暴露到全局
window.UsageStatsModule = UsageStatsModule;
