import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 修复 renderTopics 函数
old_render_topics = '''function renderTopics() {
    const topicKey = currentGradeTab + '_' + currentSubjectTab;
    const topicList = topics[topicKey] || [];
    const container = document.getElementById('topic-list-' + currentSubjectTab);
    
    if (topicList.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-gray);">暂无该科目题目</div>';
        updateTopicPagination(topicList.length);
        return;
    }
    
    // 分页计算
    const totalPages = Math.ceil(topicList.length / TOPICS_PER_PAGE);
    if (currentTopicPage > totalPages) currentTopicPage = totalPages || 1;
    if (currentTopicPage < 1) currentTopicPage = 1;
    
    const startIndex = (currentTopicPage - 1) * TOPICS_PER_PAGE;
    const endIndex = startIndex + TOPICS_PER_PAGE;
    const pageTopics = topicList.slice(startIndex, endIndex);
    
    container.innerHTML = pageTopics.map(t => `
        <div class="topic-item" onclick="showTopicDetail('${t.id}')">
            <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-size:24px;">${t.icon}</span>
                <div style="flex:1;">
                    <div style="font-weight:600;font-size:14px;">${t.title}</div>
                    <div style="font-size:11px;color:var(--text-light);">${t.difficulty}</div>
                </div>
                <div style="color:var(--blue);">→</div>
            </div>
        </div>
    `).join('');
    
    updateTopicPagination(topicList.length, totalPages);
}'''

new_render_topics = '''function renderTopics() {
    const topicKey = currentGradeTab + '_' + currentSubjectTab;
    const topicList = topics[topicKey] || [];
    const container = document.getElementById('topic-list-' + currentSubjectTab);
    
    if (topicList.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-gray);">暂无该科目题目</div>';
        updateTopicPagination(topicList.length);
        return;
    }
    
    // 分页计算
    const totalPages = Math.ceil(topicList.length / TOPICS_PER_PAGE);
    if (currentTopicPage > totalPages) currentTopicPage = totalPages || 1;
    if (currentTopicPage < 1) currentTopicPage = 1;
    
    const startIndex = (currentTopicPage - 1) * TOPICS_PER_PAGE;
    const endIndex = startIndex + TOPICS_PER_PAGE;
    const pageTopics = topicList.slice(startIndex, endIndex);
    
    let html = '';
    pageTopics.forEach(t => {
        html += '<div class="topic-item" onclick="showTopicDetail(\\'' + t.id + '\\')">';
        html += '<div style="display:flex;align-items:center;gap:10px;">';
        html += '<span style="font-size:24px;">' + t.icon + '</span>';
        html += '<div style="flex:1;">';
        html += '<div style="font-weight:600;font-size:14px;">' + t.title + '</div>';
        html += '<div style="font-size:11px;color:#999;">' + t.difficulty + '</div>';
        html += '</div>';
        html += '<div style="color:#3377FF;">→</div>';
        html += '</div></div>';
    });
    container.innerHTML = html;
    
    updateTopicPagination(topicList.length, totalPages);
}'''

content = content.replace(old_render_topics, new_render_topics)

# 更新标题
content = content.replace('<title>认知训练V122</title>', '<title>认知训练V123</title>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('V123修复完成 - 母题列表渲染')
