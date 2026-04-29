// 版本: V144
// 包含API配置、存储键名等全局常量

const DEEPSEEK_API_KEY = 'sk-8413f72a3f084fb08c84389555a76d37';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_MODEL = 'deepseek-chat'; // DeepSeek模型，新用户有免费额度
const STORAGE_KEY = 'cognitive_training_v137';
const API_CONFIG_KEY = 'cognitive_api_config';

// 旧版本存储键（数据迁移用）
const OLD_KEYS = ['cognitive_training_v135','cognitive_training_v119','cognitive_training_v118','cognitive_training_v43', 'cognitive_training_v42', 'cognitive_training_v41', 'cognitive_training_v40', 'cognitive_training_v33', 'cognitive_training_v32'];

// 头像列表
const AVATAR_LIST = [
    { emoji: '🧒', gradient: 'linear-gradient(135deg,#FFD4B8,#FFB6C1)' },
    { emoji: '👧', gradient: 'linear-gradient(135deg,#B8D4FF,#A8C4FF)' },
    { emoji: '👦', gradient: 'linear-gradient(135deg,#B8FFD4,#A8E4C1)' },
    { emoji: '👨', gradient: 'linear-gradient(135deg,#E4B8FF,#D4A8FF)' },
    { emoji: '👩', gradient: 'linear-gradient(135deg,#FFE4B8,#FFD8A8)' },
    { emoji: '🧑', gradient: 'linear-gradient(135deg,#B8E4FF,#A8D8FF)' },
    { emoji: '🤖', gradient: 'linear-gradient(135deg,#667eea,#764ba2)' },
    { emoji: '🦸', gradient: 'linear-gradient(135deg,#ff6b6b,#ff4757)' },
    { emoji: '🦊', gradient: 'linear-gradient(135deg,#FF9A63,#E87A4E)' },
    { emoji: '🐱', gradient: 'linear-gradient(135deg,#43E97B,#38F9D7)' },
    { emoji: '🐶', gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)' },
    { emoji: '🐰', gradient: 'linear-gradient(135deg,#f6d365,#fda085)' }
];

// 视觉API配置（可选 - 用于图片理解功能）
// 支持硅基流动(https://siliconflow.cn)的免费视觉模型
// 注册后填入API Key即可启用图片理解功能
const VISION_API_KEY = '';  // 硅基流动API Key
const VISION_API_URL = '';  // 如: https://api.siliconflow.cn/v1/chat/completions
const VISION_MODEL = '';    // 如: Qwen/Qwen2.5-VL-72B-Instruct

// ========== 全局共享变量 ==========
window.QUESTIONS_PER_PAGE = 5;
window.currentMethodPage = {};
window.currentThinkingPage = {};
