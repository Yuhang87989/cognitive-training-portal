// 版本: V140

function playPodcastAudio(id) {
    const podcast = podcastList.find(p => p.id === id);
    if (podcast) {
        const audio = document.getElementById('hidden-audio');
        if (!audio) return;
        audio.src = podcast.url;
        audio.play().catch(e => {
            showToast('播放失败，请检查网络连接');
        });
        showMiniPlayer(podcast.title, podcast.duration);
        currentPodcastId = id;
    }
}

function renderPodcast(container) {
    // 使用全局podcastCourses数组
    const podcasts = podcastCourses;
    
    container.innerHTML = `
        <div class="card">
            <h3 style="margin-bottom:12px;">🎧 播客课堂 <span style="font-size:12px;color:#999;">共${podcasts.length}个音频</span></h3>
            <div id="coze-login-banner" style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:12px;padding:14px 16px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;">
                <div style="color:white;">
                    <div style="font-size:14px;font-weight:600;">🔑 登录扣子平台</div>
                    <div style="font-size:11px;opacity:0.8;margin-top:2px;">登录后可在线播放原声音频</div>
                </div>
                <button onclick="loginCozePlatform()" style="background:white;color:#667eea;border:none;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;">去登录</button>
            </div>
            <div id="coze-login-status" style="display:none;background:#e8f5e9;border-radius:12px;padding:14px 16px;margin-bottom:12px;display:none;">
                <div style="display:flex;align-items:center;justify-content:space-between;">
                    <div style="color:#2e7d32;">
                        <div style="font-size:14px;font-weight:600;">✅ 扣子已登录</div>
                        <div style="font-size:11px;margin-top:2px;">可以正常播放原声音频</div>
                    </div>
                    <button onclick="checkCozeLogin()" style="background:#2e7d32;color:white;border:none;padding:6px 12px;border-radius:8px;font-size:12px;cursor:pointer;">刷新状态</button>
                </div>
            </div>
            <div class="subject-tab" style="flex-wrap:wrap;">
                <button class="subject-tab-btn active" onclick="filterPodcast('all', this)">全部</button>
                <button class="subject-tab-btn" onclick="filterPodcast('学霸方法', this)">学霸方法</button>
                <button class="subject-tab-btn" onclick="filterPodcast('数学', this)">数学</button>
                <button class="subject-tab-btn" onclick="filterPodcast('物理', this)">物理</button>
                <button class="subject-tab-btn" onclick="filterPodcast('化学', this)">化学</button>
                <button class="subject-tab-btn" onclick="filterPodcast('语文', this)">语文</button>
                <button class="subject-tab-btn" onclick="filterPodcast('英语', this)">英语</button>
            </div>
        </div>
        
        <!-- 上传音频区域 -->
        <div style="background:white;border-radius:12px;padding:16px;margin:12px 0;">
            <div style="font-size:14px;font-weight:600;margin-bottom:12px;">📤 上传本地音频</div>
            <div class="upload-zone" onclick="document.getElementById('audio-upload-input').click()">
                <div class="upload-icon">🎵</div>
                <div class="upload-text">点击上传音频文件</div>
                <div class="upload-hint">支持 MP3、WAV、M4A 格式</div>
            </div>
            <input type="file" id="audio-upload-input" accept="audio/*" style="display:none" onchange="handleAudioUpload(this)">
            <div id="local-audio-list" style="margin-top:12px;"></div>
        </div>
        
        <div id="podcast-list">
            ${podcasts.map(p => `
            <div class="podcast-item" onclick="playPodcastCourse('${p.id}')">
                <div class="podcast-thumb" style="background:${p.gradient};">${p.icon}</div>
                <div class="podcast-info">${p.title}<div class="podcast-meta">${p.teacher} · ${p.duration} · ${p.category}</div></div>
                <div style="display:flex;align-items:center;gap:4px;flex-shrink:0;" onclick="event.stopPropagation();">
                    ${p.shareUrl ? `<a href="${p.shareUrl}" target="_blank" style="font-size:11px;color:#3377FF;text-decoration:none;">🔗</a>` : ''}
                    <label style="cursor:pointer;font-size:11px;color:#4CAF50;">📤<input type="file" accept="audio/mp3,audio/mpeg,.mp3" style="display:none;" onchange="uploadPodcastFile('${p.id}', this)"></label>
                    <button onclick="downloadPodcastFromCoze('${p.id}')" style="font-size:11px;color:#FF6B6B;background:none;border:none;cursor:pointer;padding:0;">⬇️</button>
                </div>
            </div>
            `).join('')}
        </div>
    `;
    
    // 渲染本地音频列表
    renderLocalAudioList();
}

async function getPodcastAudioUrl(shareUrl, courseId) {
    if (!shareUrl) return null;
    
    // 检查缓存
    var now = Date.now();
    if (podcastUrlCache.cache[courseId] && 
        podcastUrlCache.cacheExpiry[courseId] && 
        now < podcastUrlCache.cacheExpiry[courseId]) {
        console.log('使用缓存的签名URL:', courseId);
        return podcastUrlCache.cache[courseId];
    }
    
    try {
        console.log('正在获取播客音频:', shareUrl);
        
        // 方法1: 直接fetch分享URL，跟随重定向获取.podcast JSON
        try {
            var resp = await fetch(shareUrl, {redirect: 'follow'});
            if (resp.ok) {
                var podcastData = await resp.json();
                var audioUri = podcastData.audio_uri;
                
                if (audioUri) {
                    console.log('获取到audio_uri:', audioUri);
                    
                    // 尝试调用coze API获取签名URL
                    try {
                        var signResp = await fetch('https://www.coze.cn/api/coze_space/get_url', {
                            method: 'POST',
                            credentials: 'include',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({uri: audioUri})
                        });
                        
                        var signData = await signResp.json();
                        
                        if (signData.code === 0 && signData.data && signData.data.url) {
                            var signedUrl = signData.data.url;
                            console.log('获取到签名URL:', signedUrl);
                            podcastUrlCache.cache[courseId] = signedUrl;
                            podcastUrlCache.cacheExpiry[courseId] = now + podcastUrlCache.CACHE_DURATION;
                            return signedUrl;
                        }
                        console.warn('get_url API返回异常:', signData);
                    } catch(signErr) {
                        console.warn('get_url API调用失败:', signErr.message);
                    }
                    
                    // 方法2: 直接用audio_uri构建static.coze.site URL（需要sign）
                    // 此方法通常需要签名，无法直接访问
                }
            }
        } catch(fetchErr) {
            console.warn('fetch分享URL失败:', fetchErr.message);
        }
        
        // 方法3: 尝试手动处理302重定向
        try {
            var resp2 = await fetch(shareUrl, {redirect: 'manual'});
            if (resp2.status === 302 || resp2.status === 301) {
                var redirectUrl = resp2.headers.get('Location');
                console.log('获取到重定向URL:', redirectUrl);
                if (redirectUrl) {
                    var resp3 = await fetch(redirectUrl);
                    if (resp3.ok) {
                        var podcastData2 = await resp3.json();
                        var audioUri2 = podcastData2.audio_uri;
                        if (audioUri2) {
                            // 尝试获取签名URL
                            try {
                                var signResp2 = await fetch('https://www.coze.cn/api/coze_space/get_url', {
                                    method: 'POST',
                                    credentials: 'include',
                                    headers: {'Content-Type': 'application/json'},
                                    body: JSON.stringify({uri: audioUri2})
                                });
                                var signData2 = await signResp2.json();
                                if (signData2.code === 0 && signData2.data && signData2.data.url) {
                                    podcastUrlCache.cache[courseId] = signData2.data.url;
                                    podcastUrlCache.cacheExpiry[courseId] = now + podcastUrlCache.CACHE_DURATION;
                                    return signData2.data.url;
                                }
                            } catch(e) {}
                        }
                    }
                }
            }
        } catch(e) {
            console.warn('手动重定向处理失败:', e.message);
        }
        
        console.error('所有获取音频URL的方法均失败');
        return null;
        
    } catch(e) {
        console.error('获取播客音频URL失败:', e);
        return null;
    }
}

function tryGetSignedAudioUrl(audioUri, courseId, audioEl) {
    if (!audioUri) return Promise.resolve(null);
    
    // 检查缓存
    var now = Date.now();
    if (podcastUrlCache.cache[courseId] && podcastUrlCache.cacheExpiry[courseId] && now < podcastUrlCache.cacheExpiry[courseId]) {
        return Promise.resolve(podcastUrlCache.cache[courseId]);
    }
    
    // 尝试调用get_url API（需要coze.cn cookie）
    return fetch('https://www.coze.cn/api/coze_space/get_url', {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({uri: audioUri})
    }).then(function(resp) {
        return resp.json();
    }).then(function(data) {
        if (data.code === 0 && data.data && data.data.url) {
            var signedUrl = data.data.url;
            podcastUrlCache.cache[courseId] = signedUrl;
            podcastUrlCache.cacheExpiry[courseId] = now + podcastUrlCache.CACHE_DURATION;
            return signedUrl;
        }
        return null;
    }).catch(function(e) {
        return null;
    });
}

function clearPodcastCache(courseId) {
    if (courseId) {
        delete podcastUrlCache.cache[courseId];
        delete podcastUrlCache.cacheExpiry[courseId];
        console.log('已清除缓存:', courseId);
    } else {
        podcastUrlCache.cache = {};
        podcastUrlCache.cacheExpiry = {};
        console.log('已清除所有播客缓存');
    }
}

function downloadPodcastFromCoze(courseId) {
    const course = podcastCourses.find(p => p.id === courseId);
    if (!course) {
        showToast('找不到该播客');
        return;
    }
    
    // 先检查本地是否有上传的音频
    const dbName = 'cognitive_audio_db';
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = function(e) {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('audioFiles')) {
            db.createObjectStore('audioFiles', {keyPath: 'courseId'});
        }
    };
    request.onsuccess = function(e) {
        const db = e.target.result;
        const tx = db.transaction('audioFiles', 'readonly');
        const store = tx.objectStore('audioFiles');
        const getReq = store.get(courseId);
        getReq.onsuccess = function() {
            if (getReq.result) {
                // 有本地音频，下载它
                const blob = new Blob([getReq.result.data], {type: 'audio/mpeg'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = (course.title || courseId) + '.mp3';
                a.click();
                URL.revokeObjectURL(url);
                showToast('正在下载本地音频');
            } else if (course.shareUrl) {
                // 没有本地音频，打开扣子平台页面让用户下载
                window.open(course.shareUrl, '_blank');
                showToast('已打开扣子平台页面，可在页面中下载');
            } else {
                showToast('该播客暂无可下载的音频');
            }
        };
        getReq.onerror = function() {
            if (course.shareUrl) {
                window.open(course.shareUrl, '_blank');
            } else {
                showToast('下载失败');
            }
        };
    };
    request.onerror = function() {
        if (course.shareUrl) {
            window.open(course.shareUrl, '_blank');
        } else {
            showToast('下载失败');
        }
    };
}

function renderLocalAudioList() {
    const user = getCurrentUserData();
    const localAudios = user?.localAudios || [];
    const listEl = document.getElementById('local-audio-list');

    if (!listEl) return;

    if (localAudios.length === 0) {
        listEl.innerHTML = '<div style="font-size:12px;color:#999;text-align:center;padding:12px;">暂无本地音频</div>';
        return;
    }

    listEl.innerHTML = localAudios.map(audio => `
        <div style="display:flex;align-items:center;gap:10px;padding:10px;background:#f5f7ff;border-radius:8px;margin-bottom:8px;">
            <div style="flex:1;">
                <div style="font-size:13px;font-weight:600;">${audio.title}</div>
                <div style="font-size:11px;color:#999;">${audio.duration} · ${audio.uploadTime}</div>
            </div>
            <button onclick="playLocalAudio('${audio.id}')" style="padding:6px 12px;background:#667eea;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">播放</button>
            <button onclick="deleteLocalAudio('${audio.id}')" style="padding:6px 12px;background:#ff6b6b;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">删除</button>
        </div>
    `).join('');
}

function renderLocalVideoList() {
    const user = getCurrentUserData();
    const localVideos = user?.localVideos || [];
    const listEl = document.getElementById('local-video-list');
    
    if (!listEl) return;
    
    if (localVideos.length === 0) {
        listEl.innerHTML = '<div style="font-size:12px;color:#999;text-align:center;padding:12px;">暂无本地视频</div>';
        return;
    }
    
    listEl.innerHTML = `
        <div style="font-size:12px;color:#666;margin-bottom:8px;">📁 已上传 ${localVideos.length} 个视频</div>
        ${localVideos.map(video => `
            <div style="display:flex;align-items:center;gap:10px;padding:10px;background:#f8f9fa;border-radius:8px;margin-bottom:8px;">
                <div style="font-size:24px;">🎬</div>
                <div style="flex:1;">
                    <div style="font-size:13px;font-weight:500;">${video.title}</div>
                    <div style="font-size:11px;color:#999;">${video.duration} · ${(video.size / 1024 / 1024).toFixed(1)}MB</div>
                </div>
                <button onclick="playLocalVideo('${video.id}')" style="background:#1A6BFF;color:white;border:none;padding:6px 12px;border-radius:6px;font-size:12px;cursor:pointer;">播放</button>
                <button onclick="deleteLocalVideo('${video.id}')" style="background:#ff6b6b;color:white;border:none;padding:6px 12px;border-radius:6px;font-size:12px;cursor:pointer;">删除</button>
            </div>
        `).join('')}
    `;
}

function uploadPodcastFile(courseId, input) {
    const file = input.files[0];
    if (!file) return;
    if (!file.type.startsWith('audio/')) {
        showToast('请上传音频文件');
        return;
    }
    if (file.size > 100 * 1024 * 1024) {
        showToast('文件不能超过100MB');
        return;
    }
    
    const dbName = 'cognitive_audio_db';
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = function(e) {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('audioFiles')) {
            db.createObjectStore('audioFiles', {keyPath: 'courseId'});
        }
    };
    request.onsuccess = function(e) {
        const db = e.target.result;
        const reader = new FileReader();
        reader.onload = function(ev) {
            const tx = db.transaction('audioFiles', 'readwrite');
            const store = tx.objectStore('audioFiles');
            store.put({
                courseId: courseId,
                fileName: file.name,
                data: ev.target.result,
                uploadTime: Date.now()
            });
            tx.oncomplete = function() {
                showToast('音频上传成功！');
            };
            tx.onerror = function() {
                showToast('上传失败，请重试');
            };
        };
        reader.readAsArrayBuffer(file);
    };
    request.onerror = function() {
        showToast('数据库打开失败');
    };
}

function stopPodcastTTS() {
    stopTTSSpeech();
    if (ttsTimer) { clearTimeout(ttsTimer); ttsTimer = null; }
    audioCtx.isPlaying = false;
    updatePlayButtons();
}

function speakNextCaption() {
    var captions = window._currentPodcastCaptions;
    if (!captions || ttsCaptionIndex >= captions.length) {
        audioCtx.isPlaying = false;
        updatePlayButtons();
        showToast('播客朗读完成');
        return;
    }
    if (!audioCtx.isPlaying) return;
    
    var caption = captions[ttsCaptionIndex];
    // 清理文本
    var text = caption.text || '';
    if (!text) { ttsCaptionIndex++; speakNextCaption(); return; }
    
    // 使用TTS朗读
    stopTTSSpeech();
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = audioCtx.playbackSpeed > 1 ? audioCtx.playbackSpeed : 1.0;
    utterance.pitch = 1.0;
    
    // 选择中文语音
    var voices = speechSynthesis.getVoices();
    var zhVoice = voices.find(function(v) { return v.lang.indexOf('zh') >= 0; });
    if (zhVoice) utterance.voice = zhVoice;
    
    utterance.onend = function() {
        ttsCaptionIndex++;
        // 段间短暂停顿
        ttsTimer = setTimeout(speakNextCaption, 300);
    };
    utterance.onerror = function() {
        ttsCaptionIndex++;
        speakNextCaption();
    };
    
    speechSynthesis.speak(utterance);
}

function speakText(text) {
    if (!('speechSynthesis' in window)) {
        console.log('Speech synthesis not supported');
        return;
    }
    
    // 停止之前的朗读
    stopTTSSpeech();
    
    // 清理文本（移除Markdown和多余空白）
    let cleanText = text.replace(/\*\*/g, '').replace(/`/g, '').replace(/<[^>]*>/g, '');
    
    ttsUtterance = new SpeechSynthesisUtterance(cleanText);
    ttsUtterance.lang = 'zh-CN';
    ttsUtterance.rate = 1.0;
    ttsUtterance.pitch = 1.0;
    
    // 尝试选择中文语音
    const voices = speechSynthesis.getVoices();
    const chineseVoice = voices.find(v => v.lang.includes('zh') || v.lang.includes('CN'));
    if (chineseVoice) {
        ttsUtterance.voice = chineseVoice;
    }
    
    ttsUtterance.onstart = function() {
        isTTSPlaying = true;
        const stopBtn = document.getElementById('tts-stop-btn');
        if (stopBtn) stopBtn.style.display = 'inline-block';
    };
    
    ttsUtterance.onend = function() {
        isTTSPlaying = false;
        const stopBtn = document.getElementById('tts-stop-btn');
        if (stopBtn) stopBtn.style.display = 'none';
    };
    
    ttsUtterance.onerror = function() {
        isTTSPlaying = false;
        const stopBtn = document.getElementById('tts-stop-btn');
        if (stopBtn) stopBtn.style.display = 'none';
    };
    
    speechSynthesis.speak(ttsUtterance);
}

function stopTTSSpeech() {
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
    }
    isTTSPlaying = false;
    const stopBtn = document.getElementById('tts-stop-btn');
    if (stopBtn) stopBtn.style.display = 'none';
}

function startPodcastTTS() {
    var captions = window._currentPodcastCaptions;
    if (!captions || captions.length === 0) {
        showToast('暂无播客内容');
        return;
    }
    
    ttsCaptionIndex = 0;
    audioCtx.isPlaying = true;
    updatePlayButtons();
    speakNextCaption();
}

function initVoiceInput(inputField) {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.log('Speech recognition not supported');
        return null;
    }
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = false;
    return recognition;
}

function toggleVoiceInput(btn, inputId) {
    var inputField = document.getElementById(inputId);
    if (!inputField) return;
    
    if (!deepseekRecognition) {
        deepseekRecognition = initVoiceInput(inputField);
        if (!deepseekRecognition) {
            showToast('当前浏览器不支持语音输入');
            return;
        }
    }
    
    if (isRecording) {
        deepseekRecognition.stop();
        isRecording = false;
        btn.classList.remove('recording');
        btn.textContent = '🎤';
    } else {
        isRecording = true;
        btn.classList.add('recording');
        btn.textContent = '🔴';
        deepseekRecognition.start();
        
        deepseekRecognition.onresult = function(event) {
            var transcript = event.results[0][0].transcript;
            inputField.value = transcript;
            isRecording = false;
            btn.classList.remove('recording');
            btn.textContent = '🎤';
        };
        
        deepseekRecognition.onerror = function(event) {
            isRecording = false;
            btn.classList.remove('recording');
            btn.textContent = '🎤';
            if (event.error !== 'no-speech') {
                showToast('语音识别出错: ' + event.error);
            }
        };
        
        deepseekRecognition.onend = function() {
            isRecording = false;
            btn.classList.remove('recording');
            btn.textContent = '🎤';
        };
    }
}

function startVoiceInput(inputId) {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showToast('您的浏览器不支持语音输入');
        return;
    }
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = function() {
        showToast('正在倾听...');
        var btn = document.querySelector('[onclick*="startVoiceInput"]');
        if (btn) { btn.classList.add('recording'); }
    };
    recognition.onresult = function(event) {
        var text = event.results[0][0].transcript;
        document.getElementById(inputId).value = text;
        var btn = document.querySelector('[onclick*="startVoiceInput"]');
        if (btn) { btn.classList.remove('recording'); }
        showToast('已识别: ' + text);
    };
    recognition.onerror = function(event) {
        var btn = document.querySelector('[onclick*="startVoiceInput"]');
        if (btn) { btn.classList.remove('recording'); }
        if (event.error === 'no-speech') {
            showToast('未检测到语音，请重试');
        } else if (event.error === 'not-allowed') {
            showToast('请允许使用麦克风');
        }
    };
    recognition.onend = function() {
        var btn = document.querySelector('[onclick*="startVoiceInput"]');
        if (btn) { btn.classList.remove('recording'); }
    };
    recognition.start();
}

async function askPracticeAI() {
    const input = document.getElementById('practice-ai-question');
    if (!input || !input.value.trim()) {
        showToast('请输入问题');
        return;
    }
    const question = input.value.trim();
    showToast('AI正在解说中...');
    
    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer sk-8413f72a3f084fb08c84389555a76d37'
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: '你是一位专业的青少年教育辅导老师，擅长用通俗易懂的方式为学生解说知识点。请提供：1.知识点分析 2.详细讲解 3.举例说明 4.易错点提示' },
                    { role: 'user', content: question }
                ]
            })
        });
        const data = await response.json();
        const aiContent = data.choices?.[0]?.message?.content || 'AI解说失败，请稍后重试';
        showPracticeResult(aiContent);
    } catch (err) {
        showToast('AI解说失败，请检查网络');
    }
}

async function handlePracticePhoto(input) {
    const file = input.files[0];
    if (!file) return;
    showToast('AI正在识别中...');
    
    const reader = new FileReader();
    reader.onload = async function(e) {
        const base64 = e.target.result;
        try {
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer sk-8413f72a3f084fb08c84389555a76d37'
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        { role: 'system', content: '你是一位专业的初中教育辅导老师，擅长识别题目并详细讲解。请识别图片中的题目，给出详细解答过程。' },
                        { role: 'user', content: [
                            { type: 'text', text: '请识别这道题目并给出详细解答：' },
                            { type: 'image_url', image_url: { url: base64 } }
                        ]}
                    ]
                })
            });
            const data = await response.json();
            const aiContent = data.choices?.[0]?.message?.content || 'AI识别失败，请稍后重试';
            showPracticeResult(aiContent);
        } catch (err) {
            showToast('AI识别失败，请检查网络');
        }
    };
    reader.readAsDataURL(file);
}

function showPracticeResult(content) {
    const modal = document.getElementById('detail-modal');
    const detailContent = document.getElementById('detail-content');
    if (!modal || !detailContent) return;
    modal.classList.add('show');
    detailContent.innerHTML = `
        <div class="modal-title">🤖 AI解答</div>
        <div style="padding:16px;background:#f5f7ff;border-radius:12px;max-height:60vh;overflow-y:auto;line-height:1.8;font-size:14px;">
            ${content.replace(/\n/g, '<br/>')}
        </div>
        <button class="login-btn login-btn-primary" onclick="closeDetail()" style="margin-top:12px;">关闭</button>
    `;
}

async function submitPracticeQuestion() {
    const input = document.getElementById('practice-input');
    if (!input || !input.value.trim()) {
        showToast('请输入问题');
        return;
    }
    const question = input.value.trim();
    showToast('AI正在解答中...');
    
    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer sk-8413f72a3f084fb08c84389555a76d37'
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: '你是一位专业的初中教育辅导老师，擅长解答各科题目。请给出详细的解题步骤和思路分析。' },
                    { role: 'user', content: question }
                ]
            })
        });
        const data = await response.json();
        const aiContent = data.choices?.[0]?.message?.content || 'AI解答失败，请稍后重试';
        showPracticeResult(aiContent);
    } catch (err) {
        showToast('AI解答失败，请检查网络');
    }
}

function checkTopicAnswer(topicId) {
    const input = document.getElementById('topic-answer-input');
    const resultArea = document.getElementById('topic-result-area');
    const answer = input.value.trim();
    const topic = findTopic(topicId);
    
    if (!answer) {
        showToast('请输入答案');
        return;
    }
    
    const isCorrect = answer.toLowerCase() === topic.a.toLowerCase();
    
    // 播放正确/错误音效
    if (isCorrect) {
        SoundEffects.playCorrect();
    } else {
        SoundEffects.playWrong();
    }
    
    resultArea.className = 'practice-result ' + (isCorrect ? 'correct' : 'wrong');
    resultArea.innerHTML = isCorrect 
        ? `<div style="margin-top:12px;">✅ 回答正确！</div>
           <div style="margin-top:8px;font-size:13px;color:#666;">解析：${topic.e}</div>
           <button class="game-btn btn-blue" style="margin-top:12px;" onclick="analyzeTopicWithAI(${topicId})">🤖 AI详细解说</button>`
        : `<div style="margin-top:12px;">❌ 回答错误</div>
           <div style="margin-top:8px;">正确答案：<strong style="color:#3377FF;">${topic.a}</strong></div>
           <div style="margin-top:8px;font-size:13px;color:#666;">解析：${topic.e}</div>
           <button class="game-btn btn-blue" style="margin-top:12px;" onclick="analyzeTopicWithAI(${topicId})">🤖 AI详细解说</button>`;
    
    // 更新用户统计
    const userData = getCurrentUserData();
    if (userData) {
        if (!userData.topicStats) userData.topicStats = {};
        userData.topicStats[topicId] = { 
            correct: isCorrect, 
            attempts: (userData.topicStats[topicId]?.attempts || 0) + 1,
            lastTime: Date.now()
        };
        
        // 错题自动加入错题本
        if (!isCorrect) {
            if (!userData.wrongNotes) userData.wrongNotes = [];
            const wrongKey = 'topic-' + topicId;
            // 避免重复
            if (!userData.wrongNotes.find(n => n.wrongKey === wrongKey)) {
                userData.wrongNotes.push({
                    wrongKey: wrongKey,
                    source: 'topic',
                    sourceName: '母题训练',
                    topicId: topicId,
                    question: topic.q,
                    answer: topic.a,
                    explanation: topic.e,
                    userAnswer: answer,
                    time: Date.now()
                });
            }
        }
        syncUserData(userData);
    }
}

function openTopicQuestion(topicId) {
    const topic = findTopic(topicId);
    if (!topic) {
        showToast('题目不存在');
        return;
    }
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    content.innerHTML = `
        <div class="modal-title">${topic.title}</div>
        <div class="card" style="margin-bottom:12px;">
            <div style="font-size:15px;line-height:1.8;margin-bottom:16px;">${topic.q}</div>
            <div class="practice-input">
                <input type="text" id="topic-answer-input" placeholder="输入你的答案..." style="flex:1;" />
                <button onclick="checkTopicAnswer(${topicId})" style="padding:10px 16px;background:#3377FF;color:white;border:none;border-radius:8px;cursor:pointer;">提交</button>
            </div>
            <div id="topic-result-area"></div>
        </div>
        <div class="card">
            <h4 style="margin-bottom:12px;">📷 拍照上传</h4>
            <p style="font-size:12px;color:#666;margin-bottom:12px;">上传你的解题过程，AI帮你分析</p>
            <input type="file" id="topic-photo-input" accept="image/*" capture="environment" style="display:none" onchange="uploadTopicPhoto(${topicId}, this)"/>
            <button class="camera-btn" onclick="document.getElementById('topic-photo-input').click()">📷 拍照上传</button>
        </div>
        <button class="login-btn login-btn-secondary" onclick="closeDetail()" style="margin-top:12px;">关闭</button>
    `;
}

function uploadTopicPhoto(topicId, input) {
    if (!input.files[0]) return;
    var file = input.files[0];
    var reader = new FileReader();
    var previewHtml = '';
    
    reader.onload = function(e) {
        var imageData = e.target.result;
        var user = getCurrentUserData() || {};
        user.uploadedImages = user.uploadedImages || [];
        var photoId = Date.now();
        
        // 保存图片
        user.uploadedImages.push({ 
            id: photoId, 
            topicId: topicId, 
            image: imageData, 
            time: Date.now() 
        });
        syncUserData(user);
        
        // 显示预览和AI分析按钮
        showPhotoPreview(imageData, topicId, photoId);
        input.value = '';
    };
    reader.readAsDataURL(file);
}

function checkCozeLogin() {
    showToast('正在检查登录状态...');
    // 尝试用credentials访问coze.cn API来验证登录
    fetch('https://www.coze.cn/api/coze_space/get_url', {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({uri: 'test'})
    }).then(function(resp) {
        return resp.json();
    }).then(function(data) {
        // 如果返回的不是1000414（异常流量），说明cookie有效
        if (data.code !== 1000414) {
            // 登录有效（即使是其他错误码，也说明cookie被接受了）
            updateCozeLoginUI(true);
            showToast('✅ 扣子平台已登录，可以播放音频了');
        } else {
            updateCozeLoginUI(false);
            showToast('❌ 未登录或cookie已过期，请重新登录');
        }
    }).catch(function(e) {
        // CORS错误也可能说明未登录
        updateCozeLoginUI(false);
        showToast('无法验证登录状态，请先登录扣子平台');
    });
}

function loginCozePlatform() {
    // 打开扣子登录页面
    window.open('https://www.coze.cn/', '_blank');
    showToast('请在扣子平台完成登录后，返回点击"刷新状态"');
}

function updateCozeLoginUI(loggedIn) {
    var banner = document.getElementById('coze-login-banner');
    var status = document.getElementById('coze-login-status');
    if (loggedIn) {
        if (banner) banner.style.display = 'none';
        if (status) status.style.display = 'block';
    } else {
        if (banner) banner.style.display = 'flex';
        if (status) status.style.display = 'none';
    }
}

function syncData() {
    const btn = document.getElementById('sync-btn');
    const syncTimeEl = document.getElementById('last-sync-time');
    
    if (btn) {
        btn.textContent = '同步中...';
        btn.disabled = true;
    }
    
    const user = getCurrentUserData();
    if (user) {
        // 更新同步时间
        const now = new Date();
        const syncTime = now.toLocaleString('zh-CN', { 
            month: 'numeric', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        // 保存同步时间到用户数据
        user.lastSyncTime = now.toISOString();
        syncUserData(user);
        
        // 更新显示
        if (syncTimeEl) {
            syncTimeEl.textContent = `上次同步：${syncTime}`;
        }
        
        setTimeout(() => {
            if (btn) {
                btn.textContent = '同步';
                btn.disabled = false;
            }
            showToast('✅ 数据同步成功');
            
            // 更新数据统计
            updateDataStatsDisplay();
        }, 800);
    } else {
        if (btn) {
            btn.textContent = '同步';
            btn.disabled = false;
        }
        showToast('请先登录');
    }
}

function syncTodayStats() {
    const user = getCurrentUserData();
    if (!user) return;
    const today = new Date().toDateString();
    let todayStats = user.todayStats || { date: today, questions: 0, correct: 0, minutes: 0 };
    if (todayStats.date !== today) { 
        todayStats = { date: today, questions: 0, correct: 0, minutes: 0 }; 
        user.todayStats = todayStats; 
        syncUserData(user); 
    }
    // 安全地更新DOM元素
    const questionsEl = document.getElementById('today-questions');
    const correctEl = document.getElementById('today-correct');
    const minutesEl = document.getElementById('today-minutes');
    const streakEl = document.getElementById('today-streak');
    if (questionsEl) questionsEl.textContent = user.aiChatCount || 0;
    if (correctEl) correctEl.textContent = todayStats.questions > 0 ? Math.round(todayStats.correct / todayStats.questions * 100) + '%' : '0%';
    if (minutesEl) minutesEl.textContent = todayStats.minutes || 0;
    const studyDays = user.studyDays || {};
    let streak = 0;
    for (let i = 0; i < 365; i++) {
        const d = new Date(); 
        d.setDate(d.getDate() - i);
        if (studyDays[d.toISOString().split('T')[0]]) streak++; 
        else if (i > 0) break;
    }
    if (streakEl) streakEl.textContent = streak;
}

function syncUserData(user) {
    const data = loadData();
    const idx = data.users.findIndex(u => u.id === user.id);
    if (idx >= 0) { data.users[idx] = user; saveData(data); }
}

function migrateData() {
    const currentData = localStorage.getItem(STORAGE_KEY);
    // 如果已有有效数据，跳过迁移
    if (currentData) {
        try {
            const parsed = JSON.parse(currentData);
            if (parsed && Array.isArray(parsed.users)) return;
        } catch(e) {}
    }
    // 尝试从旧key迁移
    for (const key of OLD_KEYS) {
        try {
            const old = localStorage.getItem(key);
            if (old) {
                const parsed = JSON.parse(old);
                if (parsed && Array.isArray(parsed.users)) {
                    localStorage.setItem(STORAGE_KEY, old);
                    console.log('数据已迁移:', key, '->', STORAGE_KEY);
                    return;
                }
            }
        } catch(e) {}
    }
}

function calculateStreakDays(user) {
    if (!user.studyDays) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    
    for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];
        
        if (user.studyDays[dateStr] && user.studyDays[dateStr] > 0) {
            streak++;
        } else if (i > 0) {
            // 不是今天，且没有学习记录，连续中断
            break;
        }
    }
    
    return streak;
}

function handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            
            // 验证数据格式
            if (!imported.data || !imported.data.users) {
                showToast('❌ 无效的备份文件');
                return;
            }
            
            // 确认导入
            if (confirm(`确定要导入备份吗？\n\n备份时间：${new Date(imported.exportTime).toLocaleString('zh-CN')}\n用户数量：${imported.data.users.length}\n\n注意：当前数据将被覆盖！`)) {
                // 合并或覆盖数据
                const currentData = loadData();
                
                // 智能合并：保留当前用户设置，合并训练数据
                imported.data.users.forEach(importedUser => {
                    const existingUser = currentData.users.find(u => u.id === importedUser.id);
                    if (existingUser) {
                        // 合并游戏分数（取最高）
                        if (importedUser.gameScores) {
                            existingUser.gameScores = { ...existingUser.gameScores, ...importedUser.gameScores };
                        }
                        // 合并训练统计
                        if (importedUser.methodStats) {
                            existingUser.methodStats = { ...existingUser.methodStats, ...importedUser.methodStats };
                        }
                        if (importedUser.thinkingStats) {
                            existingUser.thinkingStats = { ...existingUser.thinkingStats, ...importedUser.thinkingStats };
                        }
                        // 合并学习天数
                        if (importedUser.studyDays) {
                            existingUser.studyDays = { ...existingUser.studyDays, ...importedUser.studyDays };
                        }
                    } else {
                        // 新用户直接添加
                        currentData.users.push(importedUser);
                    }
                });
                
                saveData(currentData);
                showToast('✅ 数据导入成功');
                
                // 刷新界面
                updateDataStatsDisplay();
                if (typeof updateHomeDisplay === 'function') {
                    updateHomeDisplay();
                }
            }
        } catch (err) {
            showToast('❌ 文件解析失败');
            console.error('Import error:', err);
        }
    };
    reader.readAsText(file);
    
    // 清空input，允许重复导入同一文件
    event.target.value = '';
}

function exportData() {
    const data = loadData();
    
    // 添加导出元信息
    const exportData = {
        version: 'V139',
        exportTime: new Date().toISOString(),
        appName: '认知训练门户',
        data: data
    };
    
    // 创建Blob并下载
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `认知训练数据备份_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('✅ 数据已导出到本地');
}

function importData() {
    const input = document.getElementById('import-file-input');
    if (input) {
        input.click();
    }
}

function showDataStatsModal() {
    const stats = calculateDataStats();
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    
    content.innerHTML = `
        <div class="modal-title">📊 数据统计详情</div>
        
        <div style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;border-radius:16px;padding:20px;margin-bottom:16px;">
            <div style="font-size:12px;opacity:0.9;margin-bottom:8px;">当前用户</div>
            <div style="font-size:20px;font-weight:bold;margin-bottom:12px;">${stats.currentUser?.name || '未登录'}</div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;text-align:center;">
                <div>
                    <div style="font-size:22px;font-weight:bold;">${stats.currentUser?.points || 0}</div>
                    <div style="font-size:11px;opacity:0.8;">积分</div>
                </div>
                <div>
                    <div style="font-size:22px;font-weight:bold;">${stats.currentUser?.gamesPlayed || 0}</div>
                    <div style="font-size:11px;opacity:0.8;">游戏</div>
                </div>
                <div>
                    <div style="font-size:22px;font-weight:bold;">${stats.currentUser?.streakDays || 0}</div>
                    <div style="font-size:11px;opacity:0.8;">连续</div>
                </div>
            </div>
        </div>
        
        <div style="font-size:14px;font-weight:600;margin-bottom:12px;">📈 全局统计</div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:16px;">
            <div style="background:#f5f7ff;border-radius:12px;padding:14px;text-align:center;">
                <div style="font-size:24px;font-weight:bold;color:#3377FF;">${stats.totalUsers}</div>
                <div style="font-size:12px;color:#666;">注册用户</div>
            </div>
            <div style="background:#f5fff7;border-radius:12px;padding:14px;text-align:center;">
                <div style="font-size:24px;font-weight:bold;color:#43E97B;">${stats.totalStudyDays}</div>
                <div style="font-size:12px;color:#666;">学习天数</div>
            </div>
            <div style="background:#fff7f5;border-radius:12px;padding:14px;text-align:center;">
                <div style="font-size:24px;font-weight:bold;color:#FF6B6B;">${stats.totalGamesPlayed}</div>
                <div style="font-size:12px;color:#666;">游戏次数</div>
            </div>
            <div style="background:#f5f7ff;border-radius:12px;padding:14px;text-align:center;">
                <div style="font-size:24px;font-weight:bold;color:#667eea;">${stats.totalMethodTraining + stats.totalThinkingTraining}</div>
                <div style="font-size:12px;color:#666;">训练次数</div>
            </div>
        </div>
        
        <div style="font-size:14px;font-weight:600;margin-bottom:12px;">🏆 训练详情</div>
        <div style="background:white;border-radius:12px;padding:12px;margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f0f0f0;">
                <span style="color:#666;">学霸方法训练</span>
                <span style="font-weight:bold;">${stats.totalMethodTraining} 次</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f0f0f0;">
                <span style="color:#666;">思维训练</span>
                <span style="font-weight:bold;">${stats.totalThinkingTraining} 次</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:10px 0;">
                <span style="color:#666;">AI问答</span>
                <span style="font-weight:bold;">${stats.totalAIChats} 次</span>
            </div>
        </div>
        
        <button class="modal-close" onclick="closeModal()">关闭</button>
    `;
    
    modal.classList.add('show');
}

function updateDataStatsDisplay() {
    const stats = calculateDataStats();
    const infoEl = document.getElementById('data-stats-info');
    const syncTimeEl = document.getElementById('last-sync-time');
    
    if (infoEl) {
        infoEl.textContent = `${stats.totalUsers}个用户 · ${stats.totalGamesPlayed}次游戏 · ${stats.totalMethodTraining + stats.totalThinkingTraining}次训练`;
    }
    
    // 更新上次同步时间
    const user = getCurrentUserData();
    if (syncTimeEl && user?.lastSyncTime) {
        const syncDate = new Date(user.lastSyncTime);
        syncTimeEl.textContent = `上次同步：${syncDate.toLocaleString('zh-CN', { 
            month: 'numeric', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        })}`;
    }
}


// ============================================================
// Video - 视频模块
// ============================================================