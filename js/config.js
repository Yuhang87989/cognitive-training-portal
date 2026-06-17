// 版本: auto (基于部署时间戳)
// V177修改: 图片识别改用Tesseract.js本地OCR，硅基流动作为备选
// V177修改: DeepSeek文字/语音，Tesseract.js本地OCR+DeepSeek分析图片

// DeepSeek API配置
// 默认使用腾讯云SCF代理（免配置，每日50次），用户也可输入自己的Key（无限次）
const DEEPSEEK_API_KEY = ''; // 留空=走SCF代理；填入用户自己的Key则直连DeepSeek
const DEEPSEEK_API_URL = 'https://1444210630-dffiqlbtx9.ap-guangzhou.tencentscf.com/v1/chat/completions';
// DeepSeek V4 Flash - 高性价比快速模型
const DEEPSEEK_MODEL = 'deepseek-v4-flash';
// DeepSeek V4 Pro - 高质量深度模型
const DEEPSEEK_PRO_MODEL = 'deepseek-v4-pro';

// 存储键名
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

// ============================================================
// 视觉API配置 - V152新增
// 支持DeepSeek视觉（如果可用）或硅基流动Qwen3-VL
// ============================================================

// 方案1: 硅基流动(推荐，国内速度快，支持Qwen3-VL)
// 注册地址: https://cloud.siliconflow.com
// 获取API Key后填入下方
const VISION_SILICONFLOW_KEY = 'sk-upymyvbtqdunkmmksrmtqugootqqysvgevwkllyomqcvskrw';  // 硅基流动API Key
const VISION_SILICONFLOW_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const VISION_SILICONFLOW_MODEL = 'Qwen/Qwen3-VL-30B-A3B-Instruct';  // 高性价比视觉模型

// 方案2: DeepSeek视觉 (部分账号可能不支持)
// 如果DeepSeek不支持视觉，会自动降级到硅基流动
const VISION_DEEPSEEK_ENABLED = true;  // 硅基流动余额不足时fallback

// 当前使用的视觉API类型: 'deepseek' | 'siliconflow'
window.CURRENT_VISION_API = 'siliconflow';  // 默认使用硅基流动

// ========== 全局共享变量 ==========
window.QUESTIONS_PER_PAGE = 5;
window.currentMethodPage = {};
window.currentThinkingPage = {};
