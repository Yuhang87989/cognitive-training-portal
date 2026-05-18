/**
 * 配置模块 - ES6 Modules 版本
 */

// DeepSeek API
export const DEEPSEEK_API_KEY = 'sk-8413f72a3f084fb08c84389555a76d37';
export const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
export const DEEPSEEK_MODEL = 'deepseek-chat';

// 存储配置
export const STORAGE_KEY = 'cognitive_training_v137';
export const API_CONFIG_KEY = 'cognitive_api_config';

// 旧版本key（用于数据迁移）
export const OLD_KEYS = [
    'cognitive_training_v135','cognitive_training_v119','cognitive_training_v118',
    'cognitive_training_v43', 'cognitive_training_v42', 'cognitive_training_v41',
    'cognitive_training_v40', 'cognitive_training_v33', 'cognitive_training_v32'
];

// 头像列表
export const AVATAR_LIST = [
    { emoji: '👤', gradient: 'linear-gradient(135deg,#FFD4B8,#FFB6C1)' },
    { emoji: '🧠', gradient: 'linear-gradient(135deg,#B8D4FF,#A8C4FF)' },
    { emoji: '📚', gradient: 'linear-gradient(135deg,#B8FFD4,#A8E4C1)' },
    { emoji: '🎯', gradient: 'linear-gradient(135deg,#E4B8FF,#D4A8FF)' },
    { emoji: '⭐', gradient: 'linear-gradient(135deg,#FFE4B8,#FFD8A8)' },
    { emoji: '🚀', gradient: 'linear-gradient(135deg,#B8E4FF,#A8D8FF)' },
    { emoji: '💡', gradient: 'linear-gradient(135deg,#667eea,#764ba2)' },
    { emoji: '🔥', gradient: 'linear-gradient(135deg,#ff6b6b,#ff4757)' },
    { emoji: '⚡', gradient: 'linear-gradient(135deg,#FF9A63,#E87A4E)' },
    { emoji: '✅', gradient: 'linear-gradient(135deg,#43E97B,#38F9D7)' },
    { emoji: '💎', gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)' },
    { emoji: '🎨', gradient: 'linear-gradient(135deg,#f6d365,#fda085)' }
];

// 视觉AI API (硅基流动)
export const VISION_SILICONFLOW_KEY = 'sk-upymyvbtqdunkmmksrmtqugootqqysvgevwkllyomqcvskrw';
export const VISION_SILICONFLOW_URL = 'https://api.siliconflow.cn/v1/chat/completions';
export const VISION_SILICONFLOW_MODEL = 'Qwen/Qwen3-VL-30B-A3B-Instruct';

console.log('✅ config 模块加载完成');
