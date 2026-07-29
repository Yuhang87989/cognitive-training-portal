// Cognitive Training Manager - 模块注册与钩子系统
// 版本: V156

const CTM = {
    version: '1.5.6',
    modules: {},
    plans: {},
    games: {},
    hooks: {},
    
    registerModule(name, mod) {
        this.modules[name] = mod;
        console.log('Module registered:', name);
    },
    
    registerPlan(name, plan) {
        this.plans[name] = plan;
    },
    
    registerGame(name, game) {
        this.games[name] = game;
    },
    
    addHook(name, fn) {
        if (!this.hooks[name]) this.hooks[name] = [];
        this.hooks[name].push(fn);
    },
    
    triggerHook(name, data) {
        if (this.hooks[name]) {
            this.hooks[name].forEach(fn => fn(data));
        }
    },
    
    getCurrentWeek() {
        return Math.min(Math.ceil((Date.now() - 1745539200000) / 604800000) + 1, 7);
    },
    
    getTrainingConfig() {
        return { weeks: 7, dailyGoal: 8 };
    }
};


// ============================================================
// Storage - 数据存储
// ============================================================
window.CTM = CTM;

// ============================================================
// ES6 Module Export - V225 ES6改造
// ============================================================
export { CTM };
