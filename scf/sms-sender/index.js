// 腾讯云短信验证码发送 SCF 云函数
const tencentcloud = require("tencentcloud-sdk-nodejs-sms");

const SmsClient = tencentcloud.sms.v20210111.Client;

// 验证码缓存（生产环境建议用Redis，免费额度用内存即可）
const codeStore = {};

exports.main_handler = async (event) => {
    // 允许跨域
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };
    
    // OPTIONS预检
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }
    
    try {
        const body = typeof event.body === 'string' ? JSON.parse(event.body) : (event.body || {});
        const { action, phone, code } = body;
        
        if (!phone || !/^1\d{10}$/.test(phone)) {
            return { statusCode: 200, headers, body: JSON.stringify({ success: false, message: '手机号格式错误' }) };
        }
        
        // 发送验证码
        if (action === 'send') {
            // 生成6位随机验证码
            const verifyCode = String(Math.floor(100000 + Math.random() * 900000));
            const expireTime = Date.now() + 5 * 60 * 1000; // 5分钟有效
            codeStore[phone] = { code: verifyCode, expire: expireTime };
            
            // 初始化短信客户端
            const client = new SmsClient({
                credential: {
                    secretId: process.env.TENCENT_SECRET_ID,
                    secretKey: process.env.TENCENT_SECRET_KEY,
                },
                region: "ap-guangzhou",
            });
            
            const smsRes = await client.SendSms({
                SmsSdkAppId: process.env.SMS_APP_ID,     // 短信应用ID
                SignName: process.env.SMS_SIGN_NAME,      // 签名内容
                TemplateId: process.env.SMS_TEMPLATE_ID,  // 模板ID
                TemplateParamSet: [verifyCode, "5"],       // {1}=验证码, {2}=5分钟
                PhoneNumberSet: [`+86${phone}`],
            });
            
            const sendStatus = smsRes.SendStatusSet && smsRes.SendStatusSet[0];
            if (sendStatus && sendStatus.Code === 'Ok') {
                return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: '验证码已发送' }) };
            } else {
                console.error('SMS send failed:', JSON.stringify(smsRes));
                return { statusCode: 200, headers, body: JSON.stringify({ success: false, message: '发送失败，请稍后重试' }) };
            }
        }
        
        // 验证验证码
        if (action === 'verify') {
            const stored = codeStore[phone];
            if (!stored) {
                return { statusCode: 200, headers, body: JSON.stringify({ success: false, message: '请先获取验证码' }) };
            }
            if (Date.now() > stored.expire) {
                delete codeStore[phone];
                return { statusCode: 200, headers, body: JSON.stringify({ success: false, message: '验证码已过期' }) };
            }
            if (stored.code !== code) {
                return { statusCode: 200, headers, body: JSON.stringify({ success: false, message: '验证码错误' }) };
            }
            delete codeStore[phone];
            return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: '验证成功' }) };
        }
        
        return { statusCode: 200, headers, body: JSON.stringify({ success: false, message: '未知操作' }) };
        
    } catch (err) {
        console.error('SMS function error:', err);
        return { statusCode: 200, headers, body: JSON.stringify({ success: false, message: '服务异常' }) };
    }
};
