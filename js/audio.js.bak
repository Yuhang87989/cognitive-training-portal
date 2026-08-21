// ====== 音效系统模块 ======
// 版本: V140

const SoundEffects = {
    audioContext: null,
    enabled: true,
    
    // 初始化音频上下文
    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        // 恢复音频上下文（需要用户交互后才能播放）
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    },
    
    // 播放音调
    playTone(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.enabled) return;
        this.init();
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    },
    
    // 正确音效 - 上升的三音和弦
    playCorrect() {
        if (!this.enabled) return;
        this.init();
        const now = this.audioContext.currentTime;
        
        // 创建三个振荡器形成和弦
        [523.25, 659.25, 783.99].forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.frequency.value = freq;
            osc.type = 'sine';
            
            gain.gain.setValueAtTime(0, now + i * 0.05);
            gain.gain.linearRampToValueAtTime(0.2, now + i * 0.05 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            
            osc.start(now + i * 0.05);
            osc.stop(now + 0.3);
        });
    },
    
    // 错误音效 - 低沉的两个音
    playWrong() {
        if (!this.enabled) return;
        this.init();
        const now = this.audioContext.currentTime;
        
        [200, 150].forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.frequency.value = freq;
            osc.type = 'triangle';
            
            gain.gain.setValueAtTime(0.15, now + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            
            osc.start(now + i * 0.1);
            osc.stop(now + 0.3);
        });
    },
    
    // 点击音效 - 短促的提示音
    playClick() {
        this.playTone(800, 0.05, 'sine', 0.1);
    },
    
    // 提交音效
    playSubmit() {
        if (!this.enabled) return;
        this.init();
        const now = this.audioContext.currentTime;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.1);
        osc.type = 'sine';
        
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        
        osc.start(now);
        osc.stop(now + 0.15);
    },
    
    // 完成音效 - 胜利旋律
    playComplete() {
        if (!this.enabled) return;
        this.init();
        const now = this.audioContext.currentTime;
        
        // 胜利旋律：C-E-G-C (高八度)
        const notes = [523.25, 659.25, 783.99, 1046.5];
        const durations = [0.15, 0.15, 0.15, 0.3];
        
        let time = now;
        notes.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.frequency.value = freq;
            osc.type = 'sine';
            
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.25, time + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, time + durations[i]);
            
            osc.start(time);
            osc.stop(time + durations[i]);
            
            time += durations[i] * 0.8;
        });
    },
    
    // 倒计时音效
    playCountdown() {
        this.playTone(440, 0.1, 'square', 0.1);
    },
    
    // 切换音效开关
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
};