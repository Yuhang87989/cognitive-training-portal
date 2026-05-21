// ==========================================
// 确保所有渲染函数挂载到window
// ==========================================

// 检查并挂载所有渲染函数
(function() {
    // 已定义但需要挂载到window的函数列表
    const functionsToExport = [
        'renderPractice', 'renderMap', 'renderPlan', 'renderTopics', 
        'renderMethod', 'renderThinking', 'renderPodcast', 'renderVideo',
        'renderPlayer', 'renderGames', 'renderDeepseek', 'renderWrongbook',
        'renderPomodoro', 'renderRadar', 'renderGrowthChart', 'renderBackupManager',
        'renderSelfDrive', 'renderMyPage', 'renderJournalModule', 'renderLibraryModule',
        'renderGoalPage', 'renderAchievementPage', 'renderHabitPage', 'renderDiaryPage',
        'renderMethodPage', 'viewMethodNote', 'deleteMethodNote',
        'startMethodQuiz', 'submitMethodAnswers', 'startThinkingQuiz',
        'submitThinkingAnswers', 'selectThinkingOpt', 'filterMethod',
        'closeDetail', 'closeModal', 'submitTopicAnswer',
        'initPortal', 'updateTodayStats', 'getCurrentUserData'
    ];
    
    functionsToExport.forEach(functionName => {
        if (typeof window[functionName] === 'undefined' && typeof window[functionName] !== 'function') {
            // 尝试从全局作用域查找
            if (typeof window[functionName] === 'function') {
                // 已经在window上了
            } else if (typeof eval(functionName) === 'function') {
                window[functionName] = eval(functionName);
                console.log('[Window Export] 已挂载:', functionName);
            }
        }
    });
    
    console.log('[Window Export] 完成，共检查', functionsToExport.length, '个函数');
})();
