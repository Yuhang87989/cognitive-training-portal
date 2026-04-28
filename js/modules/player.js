// 版本: V140

function playPodcast(title, id) { if (id) { for (var i = 0; i < podcastCourses.length; i++) { if (podcastCourses[i].id === id) { playPodcastCourse(id); return; } } } for (var i = 0; i < podcastCourses.length; i++) { if (podcastCourses[i].title === title) { playPodcastCourse(podcastCourses[i].id); return; } } showToast('播放: ' + title); }

function playVideo(title, url) {
    document.getElementById('vp-title').textContent = title;
    document.getElementById('video-player-modal').classList.add('show');
    vpVideo = document.getElementById('vp-video');
    vpVideo.src = url;
    vpVideo.onloadedmetadata = () => { document.getElementById('vp-time').textContent = '0:00 / ' + formatTime(vpVideo.duration); };
    vpVideo.ontimeupdate = () => {
        if (vpVideo.duration) {
            document.getElementById('vp-progress-bar').style.width = (vpVideo.currentTime/vpVideo.duration*100) + '%';
            document.getElementById('vp-time').textContent = formatTime(vpVideo.currentTime) + ' / ' + formatTime(vpVideo.duration);
        }
    };
    vpVideo.onplay = () => { vpPlaying = true; document.getElementById('vp-play-btn').textContent = '⏸'; };
    vpVideo.onpause = () => { vpPlaying = false; document.getElementById('vp-play-btn').textContent = '▶'; };
    vpVideo.play();
}

function playPodcastCourse(courseId) {
    var audioEl = document.getElementById('hidden-audio');
    if (!audioEl) {
        showToast('播放器初始化失败，请刷新页面');
        return;
    }
    var course = null;
    for (var i = 0; i < podcastCourses.length; i++) { if (podcastCourses[i].id === courseId) { course = podcastCourses[i]; break; } }
    if (!course) return;
    audioCtx.currentTrack = course;
    audioCtx.currentIndex = -1;
    for (var i = 0; i < podcastCourses.length; i++) { if (podcastCourses[i].id === courseId) { audioCtx.currentIndex = i; break; } }
    var titleEl = document.getElementById('ap-title');
    var coverEl = document.getElementById('ap-cover');
    var courseTitleEl = document.getElementById('ap-course-title');
    var courseTeacherEl = document.getElementById('ap-course-teacher');
    if (titleEl) titleEl.textContent = '音频课程';
    if (coverEl) { coverEl.innerHTML = course.icon; coverEl.style.background = course.gradient; }
    if (courseTitleEl) courseTitleEl.textContent = course.title;
    if (courseTeacherEl) courseTeacherEl.textContent = course.teacher + ' · ' + course.category;
    
    if (!course.shareUrl) {
        showToast('该播客暂不可用');
        return;
    }
    
    // 显示播放器UI
    showMiniPlayer(course);
    var playerEl = document.getElementById('audio-player-fullscreen');
    var coverPlayingEl = document.getElementById('ap-cover');
    if (playerEl) playerEl.classList.add('show');
    if (coverPlayingEl) coverPlayingEl.classList.add('playing');
    updatePodcastListState(courseId);
    
    // 尝试获取播客数据（包含字幕文本）
    showToast('正在加载播客...');
    fetch(course.shareUrl, {redirect: 'follow'}).then(function(resp) {
        if (!resp.ok) throw new Error('fetch failed');
        return resp.json();
    }).then(function(podcastData) {
        // 保存字幕数据供TTS使用
        if (podcastData.captions) {
            window._currentPodcastCaptions = podcastData.captions;
        }
        // 保存audio_uri
        var audioUri = podcastData.audio_uri;
        if (audioUri) {
            window._currentAudioUri = audioUri;
        }
        
        // 尝试获取签名音频URL
        return tryGetSignedAudioUrl(audioUri, courseId, audioEl);
    }).then(function(signedUrl) {
        if (signedUrl) {
            // 有签名URL，直接播放原声
            audioEl.src = signedUrl;
            if (savedPositions[courseId]) audioEl.currentTime = savedPositions[courseId];
            audioEl.playbackRate = audioCtx.playbackSpeed;
            audioEl.volume = audioCtx.volume;
            audioEl.play().then(function() {
                audioCtx.isPlaying = true;
                updatePlayButtons();
                showToast('正在播放: ' + course.title);
            }).catch(function(e) {
                showToast('播放失败，尝试语音朗读模式');
                startPodcastTTS();
            });
        } else {
            // 没有签名URL，使用TTS朗读模式
            showToast('使用语音朗读模式播放');
            startPodcastTTS();
        }
    }).catch(function(e) {
        console.error('播客加载失败:', e);
        showToast('加载失败，尝试语音朗读');
        startPodcastTTS();
    });
}

function playVideoCourse(courseId) {
    var course = null;
    for (var i = 0; i < videoCourses.length; i++) { if (videoCourses[i].id === courseId) { course = videoCourses[i]; break; } }
    if (!course) return;
    videoCtx.currentVideo = course;
    var titleEl = document.getElementById('evp-title');
    if (titleEl) titleEl.textContent = course.title;
    evpVideo.src = course.url;
    evpVideo.playbackRate = videoCtx.playbackSpeed;
    evpVideo.volume = videoCtx.volume;
    var playerEl = document.getElementById('enhanced-video-player');
    var bigPlayEl = document.getElementById('evp-big-play');
    if (playerEl) playerEl.style.display = 'flex';
    if (bigPlayEl) bigPlayEl.style.display = 'none';
    updateVideoListState(courseId);
    evpVideo.play().then(function() { videoCtx.isPlaying = true; showToast('正在播放: ' + course.title); }).catch(function(e) { videoCtx.isPlaying = false; });
}

function playLocalAudio(audioId) {
    const user = getCurrentUserData();
    const audio = user?.localAudios?.find(a => a.id === audioId);
    if (!audio) return;

    // 播放音频
    const tempAudio = new Audio(audio.url);
    tempAudio.play();
    showToast('正在播放: ' + audio.title);
}

function playLocalVideo(videoId) {
    const user = getCurrentUserData();
    const video = user?.localVideos?.find(v => v.id === videoId);
    if (!video) return;
    
    // 使用增强版视频播放器
    openEnhancedVideoPlayer(video.title, video.url);
}

function playMediaCourse(courseId) {
    var course = null;
    for (var i = 0; i < allMediaCourses.length; i++) {
        if (allMediaCourses[i].id === courseId) {
            course = allMediaCourses[i];
            break;
        }
    }
    if (!course) return;
    
    mediaPlayer.currentMedia = course;
    mediaPlayer.currentIndex = -1;
    for (var i = 0; i < allMediaCourses.length; i++) {
        if (allMediaCourses[i].id === courseId) {
            mediaPlayer.currentIndex = i;
            break;
        }
    }
    
    mediaPlayer.isAudio = (course.type === 'audio');
    
    // 更新UI
    var typeLabel = document.getElementById('mp-type-label');
    var audioCover = document.getElementById('mp-audio-cover');
    var videoEl = document.getElementById('mp-video-element');
    var titleEl = document.getElementById('mp-title');
    var teacherEl = document.getElementById('mp-teacher');
    
    if (typeLabel) typeLabel.textContent = mediaPlayer.isAudio ? '🎧 音频课程' : '📺 视频课程';
    
    if (mediaPlayer.isAudio) {
        if (audioCover) { audioCover.style.display = 'flex'; audioCover.innerHTML = course.icon; audioCover.style.background = course.gradient; }
        if (videoEl) videoEl.style.display = 'none';
        var audioEl = document.getElementById('mp-audio-element');
        if (audioEl) { audioEl.src = course.url; audioEl.playbackRate = mediaPlayer.playbackSpeed; audioEl.volume = mediaPlayer.volume; audioEl.play().catch(function(e) {}); }
    } else {
        if (audioCover) audioCover.style.display = 'none';
        if (videoEl) { videoEl.style.display = 'block'; videoEl.src = course.url; videoEl.playbackRate = mediaPlayer.playbackSpeed; videoEl.volume = mediaPlayer.volume; videoEl.play().catch(function(e) {}); }
    }
    
    if (titleEl) titleEl.textContent = course.title;
    if (teacherEl) teacherEl.textContent = course.teacher + ' · ' + course.category;
    
    // 恢复播放进度
    var audioEl = document.getElementById('mp-audio-element');
    var videoEl = document.getElementById('mp-video-element');
    if (mediaPlayer.savedPositions[courseId]) {
        if (mediaPlayer.isAudio && audioEl) audioEl.currentTime = mediaPlayer.savedPositions[courseId];
        if (!mediaPlayer.isAudio && videoEl) videoEl.currentTime = mediaPlayer.savedPositions[courseId];
    }
    
    // 显示播放器
    var playerEl = document.getElementById('media-player');
    if (playerEl) playerEl.style.display = 'flex';
    
    // 更新列表状态
    updateMediaListState(courseId);
    
    showToast('正在播放: ' + course.title);
}

function playAudioPos(pos) {
    const freqs = [440, 554, 659];
    playAudioTone3(freqs[pos]);
    const isCorrect = pos === audioSequence[audioIndex];
    if (isCorrect) {
        const el = document.getElementById('audio-seq-' + audioIndex);
        if (el) { el.style.background = '#43E97B'; el.style.color = 'white'; }
        gameScore++;
        document.getElementById('game-score').textContent = gameScore;
        audioIndex++;
        SoundEffects.playCorrect();
        if (audioIndex >= audioSequence.length) setTimeout(() => { if (gameLevel < 5) { gameLevel++; updateGameLevelBadge(); } startAudioPosition(); }, 1000);
    } else {
        SoundEffects.playWrong();
        const el = document.getElementById('audio-seq-' + audioIndex);
        if (el) el.style.background = '#FF6B6B';
        audioIndex = 0;
        setTimeout(() => {
            for (let i = 0; i < audioSequence.length; i++) {
                const seqEl = document.getElementById('audio-seq-' + i);
                if (seqEl) { seqEl.style.background = '#f0f0f0'; seqEl.style.color = '#333'; }
            }
        }, 500);
    }
}

function playAudioTone3(freq) {
    SoundEffects.init();
    const osc = SoundEffects.audioContext.createOscillator();
    const gain = SoundEffects.audioContext.createGain();
    osc.connect(gain);
    gain.connect(SoundEffects.audioContext.destination);
    osc.frequency.value = freq;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, SoundEffects.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, SoundEffects.audioContext.currentTime + 0.4);
    osc.start();
    osc.stop(SoundEffects.audioContext.currentTime + 0.4);
}

function initAudioPlayer() {
    currentAudio = document.getElementById('hidden-audio');
    if (!currentAudio) return;
    currentAudio.addEventListener('timeupdate', updateAudioProgress);
    currentAudio.addEventListener('loadedmetadata', onAudioLoaded);
    currentAudio.addEventListener('ended', onAudioEnded);
    currentAudio.addEventListener('play', function() { audioCtx.isPlaying = true; updatePlayButtons(); });
    currentAudio.addEventListener('pause', function() { audioCtx.isPlaying = false; updatePlayButtons(); });
    try { var saved = localStorage.getItem('podcastPositions'); if (saved) savedPositions = JSON.parse(saved); } catch(e) {}
}

function initUnifiedPlayer() {
    var audioEl = document.getElementById('mp-audio-element');
    var videoEl = document.getElementById('mp-video-element');
    if (!audioEl || !videoEl) return;
    
    audioEl.addEventListener('timeupdate', updateMediaProgress);
    audioEl.addEventListener('loadedmetadata', onMediaLoaded);
    audioEl.addEventListener('ended', playNextMedia);
    audioEl.addEventListener('play', function() { mediaPlayer.isPlaying = true; updateMediaPlayButtons(); });
    audioEl.addEventListener('pause', function() { mediaPlayer.isPlaying = false; updateMediaPlayButtons(); });
    
    videoEl.addEventListener('timeupdate', updateMediaProgress);
    videoEl.addEventListener('loadedmetadata', onMediaLoaded);
    videoEl.addEventListener('ended', playNextMedia);
    videoEl.addEventListener('play', function() { mediaPlayer.isPlaying = true; updateMediaPlayButtons(); });
    videoEl.addEventListener('pause', function() { mediaPlayer.isPlaying = false; updateMediaPlayButtons(); });
    
    try { 
        var saved = localStorage.getItem('mediaPositions'); 
        if (saved) mediaPlayer.savedPositions = JSON.parse(saved); 
        else mediaPlayer.savedPositions = {};
    } catch(e) { mediaPlayer.savedPositions = {}; }
    
    initMediaCourses();
}

function initEnhancedVideoPlayer() {
    evpVideo = document.getElementById('evp-video');
    if (!evpVideo) return;
    evpVideo.addEventListener('timeupdate', updateEnhancedVideoProgress);
    evpVideo.addEventListener('loadedmetadata', onEnhancedVideoLoaded);
    evpVideo.addEventListener('ended', onEnhancedVideoEnded);
    evpVideo.addEventListener('play', function() { videoCtx.isPlaying = true; updateEnhancedPlayButtons(); });
    evpVideo.addEventListener('pause', function() { videoCtx.isPlaying = false; updateEnhancedPlayButtons(); });
}

function closeAudioPlayer() { 
    // 停止音频和TTS
    if (currentAudio) { currentAudio.pause(); audioCtx.isPlaying = false; }
    stopPodcastTTS();
    // 隐藏全屏播放器
    var playerEl = document.getElementById('audio-player-fullscreen'); 
    var coverEl = document.getElementById('ap-cover'); 
    if (playerEl) playerEl.classList.remove('show'); 
    if (coverEl) coverEl.classList.remove('playing');
    // 显示迷你播放器
    if (audioCtx.currentTrack) {
        var miniEl = document.getElementById('mini-player');
        if (miniEl) miniEl.classList.add('show');
    }
    updatePlayButtons();
}

function closeMediaPlayer() {
    var playerEl = document.getElementById('media-player');
    var audioEl = document.getElementById('mp-audio-element');
    var videoEl = document.getElementById('mp-video-element');
    if (playerEl) playerEl.style.display = 'none';
    if (audioEl) { audioEl.pause(); audioEl.currentTime = 0; }
    if (videoEl) { videoEl.pause(); videoEl.currentTime = 0; }
    mediaPlayer.isPlaying = false;
    document.querySelectorAll('.media-item').forEach(function(item) { item.classList.remove('playing'); });
}

function closeMiniPlayer() { 
    // 完全停止音频和TTS
    if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; currentAudio.src = ''; } 
    stopPodcastTTS();
    audioCtx.isPlaying = false; 
    audioCtx.currentTrack = null;
    window._currentPodcastCaptions = null;
    window._currentAudioUri = null;
    // 隐藏迷你播放器和全屏播放器
    var miniEl = document.getElementById('mini-player'); 
    var playerEl = document.getElementById('audio-player-fullscreen'); 
    if (miniEl) miniEl.classList.remove('show'); 
    if (playerEl) playerEl.classList.remove('show');
    // 清除播放状态
    document.querySelectorAll('.podcast-item-enhanced').forEach(function(item) { item.classList.remove('playing'); });
    updatePlayButtons();
}

function closeEnhancedVideoPlayer() { 
    if (evpVideo) { evpVideo.pause(); evpVideo.src = ''; } 
    videoCtx.isPlaying = false; 
    videoCtx.currentVideo = null;
    var playerEl = document.getElementById('enhanced-video-player'); 
    if (playerEl) playerEl.style.display = 'none';
    // 退出全屏模式
    if (document.fullscreenElement) { document.exitFullscreen().catch(function() {}); }
}

function toggleAudioPlay() {
    // 如果正在TTS朗读，控制TTS
    if (window._currentPodcastCaptions && !currentAudio.src) {
        if (audioCtx.isPlaying) { stopPodcastTTS(); }
        else { audioCtx.isPlaying = true; updatePlayButtons(); speakNextCaption(); }
        return;
    }
    if (!currentAudio) return;
    if (audioCtx.isPlaying) currentAudio.pause(); else currentAudio.play();
}

function toggleMediaPlay() {
    var mediaEl = getCurrentMediaElement();
    if (!mediaEl) return;
    if (mediaPlayer.isPlaying) mediaEl.pause();
    else mediaEl.play();
}

function toggleEnhancedVideoPlay() {
    if (!evpVideo) return;
    if (videoCtx.isPlaying) { evpVideo.pause(); var bigPlayEl = document.getElementById('evp-big-play'); if (bigPlayEl) bigPlayEl.style.display = 'flex'; }
    else { evpVideo.play(); var bigPlayEl = document.getElementById('evp-big-play'); if (bigPlayEl) bigPlayEl.style.display = 'none'; }
}

function togglePlayPause() {
    const audio = document.getElementById('hidden-audio');
    const btn = document.getElementById('mp-play-btn');
    if (audio && btn) {
        if (audio.paused) {
            audio.play();
            btn.textContent = '⏸';
        } else {
            audio.pause();
            btn.textContent = '▶';
        }
    }
}

function seekAudio(e) {
    if (!currentAudio) return;
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    currentAudio.currentTime = Math.floor(percent * currentAudio.duration);
    updateAudioProgress();
}

function seekVideo(e) { if (!vpVideo || !vpVideo.duration) return; const rect = e.target.getBoundingClientRect(); vpVideo.currentTime = ((e.clientX-rect.left)/rect.width)*vpVideo.duration; }

function seekMediaPlayer(e) {
    var mediaEl = getCurrentMediaElement();
    if (!mediaEl || !mediaEl.duration) return;
    var bar = document.getElementById('mp-progress-bar');
    if (!bar) return;
    var rect = bar.getBoundingClientRect();
    var percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    mediaEl.currentTime = percent * mediaEl.duration;
}

function seekEnhancedVideo(e) { if (!evpVideo || !evpVideo.duration) return; var bar = document.getElementById('evp-progress'); if (!bar) return; var rect = bar.getBoundingClientRect(); var percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)); evpVideo.currentTime = percent * evpVideo.duration; }

function seekEnhancedVideoBackward() { seekEnhancedVideoBy(-10); }

function seekEnhancedVideoForward() { seekEnhancedVideoBy(10); }

function seekEnhancedVideoBy(seconds) { if (!evpVideo) return; evpVideo.currentTime = Math.max(0, Math.min(evpVideo.duration, evpVideo.currentTime + seconds)); }

function seekAudioPlayer(e) {
    if (!currentAudio || !currentAudio.duration) return;
    var bar = document.getElementById('ap-progress-bar');
    if (!bar) return;
    var rect = bar.getBoundingClientRect();
    var percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    currentAudio.currentTime = percent * currentAudio.duration;
}

function setVolume(value) { audioCtx.volume = value / 100; if (currentAudio) currentAudio.volume = audioCtx.volume; updateVolumeIcon(value); }

function toggleVolume() { if (!evpVideo) return; evpVideo.muted = !evpVideo.muted; var btn = document.getElementById('vp-volume-btn'); if (btn) btn.textContent = evpVideo.muted ? '🔇' : '🔊'; }

function setEnhancedVolume(value) { videoCtx.volume = value / 100; if (evpVideo) evpVideo.volume = videoCtx.volume; updateEnhancedVolumeIcon(value); }

function toggleMute() {
    if (audioCtx.volume > 0) { audioCtx.lastVolume = audioCtx.volume; setVolume(0); var sliderEl = document.getElementById('ap-volume-slider'); if (sliderEl) sliderEl.value = 0; }
    else { setVolume((audioCtx.lastVolume || 0.8) * 100); var sliderEl = document.getElementById('ap-volume-slider'); if (sliderEl) sliderEl.value = (audioCtx.lastVolume || 0.8) * 100; }
}

function toggleEnhancedMute() {
    if (videoCtx.volume > 0) { videoCtx.lastVolume = videoCtx.volume; setEnhancedVolume(0); var sliderEl = document.getElementById('evp-volume-slider'); if (sliderEl) sliderEl.value = 0; }
    else { setEnhancedVolume((videoCtx.lastVolume || 0.8) * 100); var sliderEl = document.getElementById('evp-volume-slider'); if (sliderEl) sliderEl.value = (videoCtx.lastVolume || 0.8) * 100; }
}

function toggleMediaMute() {
    var audioEl = document.getElementById('mp-audio-element');
    var videoEl = document.getElementById('mp-video-element');
    if (mediaPlayer.volume > 0) {
        mediaPlayer.lastVolume = mediaPlayer.volume;
        mediaPlayer.volume = 0;
    } else {
        mediaPlayer.volume = mediaPlayer.lastVolume || 0.8;
    }
    if (audioEl) audioEl.volume = mediaPlayer.volume;
    if (videoEl) videoEl.volume = mediaPlayer.volume;
    updateVolumeIcon();
}

function setPlaybackSpeed(speed) {
    audioCtx.playbackSpeed = speed;
    if (currentAudio) currentAudio.playbackRate = speed;
    var speedBtnEl = document.getElementById('ap-speed-btn');
    var dropdownEl = document.getElementById('ap-speed-dropdown');
    if (speedBtnEl) speedBtnEl.textContent = speed + 'x';
    if (dropdownEl) dropdownEl.classList.remove('show');
    document.querySelectorAll('.ap-speed-option').forEach(function(opt) { opt.classList.toggle('active', opt.textContent.trim() === speed + 'x'); });
}

function setEnhancedPlaybackSpeed(speed) { videoCtx.playbackSpeed = speed; if (evpVideo) evpVideo.playbackRate = speed; var speedBtnEl = document.getElementById('evp-speed-btn'); if (speedBtnEl) speedBtnEl.textContent = speed + 'x'; }

function cyclePlaybackSpeed() {
    var speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    var currentIndex = speeds.indexOf(mediaPlayer.playbackSpeed);
    if (currentIndex < 0) currentIndex = 2;
    currentIndex = (currentIndex + 1) % speeds.length;
    mediaPlayer.playbackSpeed = speeds[currentIndex];
    
    var audioEl = document.getElementById('mp-audio-element');
    var videoEl = document.getElementById('mp-video-element');
    if (audioEl) audioEl.playbackRate = mediaPlayer.playbackSpeed;
    if (videoEl) videoEl.playbackRate = mediaPlayer.playbackSpeed;
    
    var speedBtnEl = document.getElementById('mp-speed-btn');
    if (speedBtnEl) speedBtnEl.textContent = mediaPlayer.playbackSpeed + 'x';
}

function toggleSpeedDropdown() { var dropdownEl = document.getElementById('ap-speed-dropdown'); if (dropdownEl) dropdownEl.classList.toggle('show'); }

function toggleEnhancedSpeedDropdown() { var speeds = [0.5, 1, 1.25, 1.5, 2]; var currentIndex = speeds.indexOf(videoCtx.playbackSpeed); var nextIndex = (currentIndex + 1) % speeds.length; setEnhancedPlaybackSpeed(speeds[nextIndex]); }

function showMiniPlayer(course) { var thumbEl = document.getElementById('mini-player-thumb'); var titleEl = document.getElementById('mini-player-title'); var teacherEl = document.getElementById('mini-player-teacher'); var playerEl = document.getElementById('mini-player'); if (thumbEl) { thumbEl.innerHTML = course.icon; thumbEl.style.background = course.gradient; } if (titleEl) titleEl.textContent = course.title; if (teacherEl) teacherEl.textContent = course.teacher; if (playerEl) playerEl.classList.add('show'); }

function showVideoPlayer(title, url, videoId) {
    openEnhancedVideoPlayer(title, url, videoId);
}

function openEnhancedVideoPlayer(title, url, videoId) {
    const playerEl = document.getElementById('enhanced-video-player');
    const videoEl = document.getElementById('evp-video');
    const titleEl = document.getElementById('evp-title');
    
    if (playerEl && videoEl && titleEl) {
        titleEl.textContent = title;
        videoEl.src = url;
        
        // 记录视频ID
        if (videoId) {
            videoEl.dataset.videoId = videoId;
            
            // 恢复上次观看位置
            const record = getVideoWatchRecord(videoId);
            if (record && record.progress < 90) {
                const savedTime = (record.progress / 100) * videoEl.duration;
                if (savedTime > 0) {
                    videoEl.currentTime = savedTime;
                    showToast('已恢复到上次观看位置');
                }
            }
        }
        
        playerEl.style.display = 'flex';
        
        // 添加进度更新监听器
        videoEl.removeEventListener('timeupdate', updateVideoProgress);
        videoEl.addEventListener('timeupdate', updateVideoProgress);
        
        videoEl.play().catch(e => {});
        evpVideo = videoEl;
    }
}

function toggleMiniPlayer() { if (!currentAudio) return; if (audioCtx.isPlaying) currentAudio.pause(); else currentAudio.play(); }

function toggleEnhancedFullscreen() { var playerEl = document.getElementById('enhanced-video-player'); if (!playerEl) return; if (document.fullscreenElement) { document.exitFullscreen().catch(function(e) {}); } else { playerEl.requestFullscreen().catch(function(e) {}); } }

function togglePictureInPicture() { if (!evpVideo) return; if (document.pictureInPictureElement) { document.exitPictureInPicture().catch(function(e) {}); } else { evpVideo.requestPictureInPicture().catch(function(e) { showToast('画中画模式不支持'); }); } }

function updateMediaProgress() {
    var mediaEl = getCurrentMediaElement();
    if (!mediaEl || !mediaEl.duration) return;
    
    var progress = (mediaEl.currentTime / mediaEl.duration) * 100;
    var fillEl = document.getElementById('mp-progress-fill');
    var currentTimeEl = document.getElementById('mp-current-time');
    
    if (fillEl) fillEl.style.width = progress + '%';
    if (currentTimeEl) currentTimeEl.textContent = formatMediaTime(mediaEl.currentTime);
    
    // 保存进度
    if (mediaPlayer.currentMedia) {
        mediaPlayer.savedPositions[mediaPlayer.currentMedia.id] = mediaEl.currentTime;
        try { localStorage.setItem('mediaPositions', JSON.stringify(mediaPlayer.savedPositions)); } catch(e) {}
    }
}

function updateAudioProgress() {
    if (!currentAudio) return;
    const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
    document.getElementById('audio-progress-bar').style.width = progress + '%';
    document.getElementById('audio-current-time').textContent = formatTime(currentAudio.currentTime);
    document.getElementById('audio-duration').textContent = formatTime(currentAudio.duration);
}

function updateEnhancedVideoProgress() { if (!evpVideo || !evpVideo.duration) return; var progress = (evpVideo.currentTime / evpVideo.duration) * 100; var barEl = document.getElementById('evp-progress-bar'); var timeEl = document.getElementById('evp-time'); if (barEl) barEl.style.width = progress + '%'; if (timeEl) timeEl.textContent = formatTimeFull(evpVideo.currentTime) + ' / ' + formatTimeFull(evpVideo.duration); }

function onAudioEnded() { playNextTrack(); }

function onAudioLoaded() { var totalEl = document.getElementById('ap-total-time'); if (totalEl) totalEl.textContent = formatTimeFull(currentAudio.duration); }

function onEnhancedVideoEnded() { videoCtx.isPlaying = false; var bigPlayEl = document.getElementById('evp-big-play'); if (bigPlayEl) bigPlayEl.style.display = 'flex'; updateEnhancedPlayButtons(); }

function onEnhancedVideoLoaded() { var timeEl = document.getElementById('evp-time'); if (timeEl) timeEl.textContent = '0:00 / ' + formatTimeFull(evpVideo.duration); }

function onMediaLoaded() {
    var mediaEl = getCurrentMediaElement();
    var totalEl = document.getElementById('mp-total-time');
    if (totalEl && mediaEl) totalEl.textContent = formatMediaTime(mediaEl.duration);
}

function playNextMedia() {
    if (allMediaCourses.length === 0) return;
    mediaPlayer.currentIndex = (mediaPlayer.currentIndex + 1) % allMediaCourses.length;
    var course = allMediaCourses[mediaPlayer.currentIndex];
    if (course) playMediaCourse(course.id);
}

function playPrevMedia() {
    if (allMediaCourses.length === 0) return;
    mediaPlayer.currentIndex = (mediaPlayer.currentIndex - 1 + allMediaCourses.length) % allMediaCourses.length;
    var course = allMediaCourses[mediaPlayer.currentIndex];
    if (course) playMediaCourse(course.id);
}

function playNextTrack() { if (podcastCourses.length === 0) return; audioCtx.currentIndex = (audioCtx.currentIndex + 1) % podcastCourses.length; var course = podcastCourses[audioCtx.currentIndex]; if (course) playPodcastCourse(course.id); }

function playPrevTrack() { if (podcastCourses.length === 0) return; audioCtx.currentIndex = (audioCtx.currentIndex - 1 + podcastCourses.length) % podcastCourses.length; var course = podcastCourses[audioCtx.currentIndex]; if (course) playPodcastCourse(course.id); }

function playVideoFromList(id) {
    var course = videoCourses.find(function(v) { return v.id === id; });
    if (course) {
        // 使用增强版视频播放器，传入videoId用于记录观看进度
        openEnhancedVideoPlayer(course.title, course.url, course.id);
    }
}

function handleAudioUpload(input) {
    const file = input.files[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith('audio/')) {
        showToast('请上传音频文件');
        return;
    }

    // 检查文件大小（限制50MB）
    if (file.size > 50 * 1024 * 1024) {
        showToast('音频文件不能超过50MB');
        return;
    }

    const user = getCurrentUserData();
    if (!user.localAudios) user.localAudios = [];

    // 创建音频URL
    const audioUrl = URL.createObjectURL(file);

    // 添加到用户数据
    const audioData = {
        id: 'local-audio-' + Date.now(),
        title: file.name.replace(/\.[^/.]+$/, ''),
        url: audioUrl,
        size: file.size,
        type: file.type,
        uploadTime: new Date().toLocaleString(),
        duration: '未知'
    };

    user.localAudios.push(audioData);
    syncUserData(user);

    // 获取音频时长
    const tempAudio = new Audio();
    tempAudio.src = audioUrl;
    tempAudio.onloadedmetadata = function() {
        const mins = Math.floor(tempAudio.duration / 60);
        const secs = Math.floor(tempAudio.duration % 60);
        audioData.duration = mins + ':' + (secs < 10 ? '0' : '') + secs;
        syncUserData(user);
        renderLocalAudioList();
    };

    showToast('音频上传成功！');
    renderLocalAudioList();
}

function handleVideoUpload(input) {
    const file = input.files[0];
    if (!file) return;
    
    // 检查文件类型
    if (!file.type.startsWith('video/')) {
        showToast('请上传视频文件');
        return;
    }
    
    // 检查文件大小（限制100MB）
    if (file.size > 100 * 1024 * 1024) {
        showToast('视频文件不能超过100MB');
        return;
    }
    
    const user = getCurrentUserData();
    if (!user.localVideos) user.localVideos = [];
    
    // 创建视频URL
    const videoUrl = URL.createObjectURL(file);
    
    // 添加到用户数据
    const videoData = {
        id: 'local-video-' + Date.now(),
        title: file.name.replace(/\.[^/.]+$/, ''),
        url: videoUrl,
        size: file.size,
        type: file.type,
        uploadTime: new Date().toLocaleString(),
        duration: '未知'
    };
    
    user.localVideos.push(videoData);
    syncUserData(user);
    
    // 获取视频时长
    const tempVideo = document.createElement('video');
    tempVideo.src = videoUrl;
    tempVideo.onloadedmetadata = function() {
        const mins = Math.floor(tempVideo.duration / 60);
        const secs = Math.floor(tempVideo.duration % 60);
        videoData.duration = mins + ':' + (secs < 10 ? '0' : '') + secs;
        syncUserData(user);
        renderLocalVideoList();
    };
    
    showToast('视频上传成功！');
    renderLocalVideoList();
}

function deleteLocalAudio(audioId) {
    if (!confirm('确定要删除这个音频吗？')) return;

    const user = getCurrentUserData();
    if (!user.localAudios) return;

    user.localAudios = user.localAudios.filter(a => a.id !== audioId);
    syncUserData(user);
    renderLocalAudioList();
    showToast('音频已删除');
}

function deleteLocalVideo(videoId) {
    if (!confirm('确定删除这个视频吗？')) return;
    
    const user = getCurrentUserData();
    user.localVideos = user.localVideos.filter(v => v.id !== videoId);
    syncUserData(user);
    renderLocalVideoList();
    showToast('视频已删除');
}

function initMediaCourses() {
    allMediaCourses = [];
    podcastCourses.forEach(function(course) {
        allMediaCourses.push({
            id: course.id,
            title: course.title,
            teacher: course.teacher,
            duration: course.duration,
            category: course.category,
            gradient: course.gradient,
            icon: course.icon,
            url: course.url,
            type: 'audio'
        });
    });
    videoCourses.forEach(function(course) {
        allMediaCourses.push({
            id: course.id,
            title: course.title,
            teacher: course.teacher,
            duration: course.duration,
            category: course.category,
            gradient: course.gradient,
            icon: course.icon,
            url: course.url,
            type: 'video'
        });
    });
}

function filterVideoCourse(category, btn) {
    document.querySelectorAll('.subject-tab-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    
    var videos = videoCourses.filter(function(v) { return category === 'all' || v.category === category; });
    var videoHtml = videos.map(function(v) {
        return '<div class="video-item" onclick="playVideoFromList(\'' + v.id + '\')">' +
               '<div class="video-thumb"><span class="play-icon">▶</span></div>' +
               '<div class="video-info"><div class="video-title">' + v.title + '</div>' +
               '<div class="video-meta">' + v.teacher + ' · ' + v.duration + '</div>' +
               '<div class="media-views">👁 ' + (v.views ? (v.views/1000).toFixed(1) + '万' : '0') + '</div></div></div>';
    }).join('');
    
    document.getElementById('video-list').innerHTML = videoHtml;
}

function updateMediaListState(courseId) {
    document.querySelectorAll('.media-item').forEach(function(item) {
        var id = item.getAttribute('data-id');
        if (id === courseId) {
            item.classList.add('playing');
            var indicator = item.querySelector('.media-playing-indicator');
            if (indicator) indicator.style.display = 'flex';
        } else {
            item.classList.remove('playing');
            var indicator = item.querySelector('.media-playing-indicator');
            if (indicator) indicator.style.display = 'none';
        }
    });
}

function updateVideoListState(courseId) { document.querySelectorAll('.video-item-enhanced').forEach(function(item) { var id = item.getAttribute('data-id'); item.classList.toggle('playing', id === courseId); }); }

function updatePodcastListState(courseId) { document.querySelectorAll('.podcast-item-enhanced').forEach(function(item) { var id = item.getAttribute('data-id'); if (id === courseId) { item.classList.add('playing'); var indicator = item.querySelector('.podcast-playing-indicator'); if (indicator) indicator.style.display = 'flex'; } else { item.classList.remove('playing'); var indicator = item.querySelector('.podcast-playing-indicator'); if (indicator) indicator.style.display = 'none'; } }); }

function updatePlayButtons() { var icon = audioCtx.isPlaying ? '⏸' : '▶'; var apPlayBtn = document.getElementById('ap-play-btn'); var miniBtn = document.getElementById('mini-player-btn'); if (apPlayBtn) apPlayBtn.innerHTML = icon; if (miniBtn) miniBtn.innerHTML = icon; }

function updateEnhancedPlayButtons() { var icon = videoCtx.isPlaying ? '⏸' : '▶'; var playBtnEl = document.getElementById('evp-play-btn'); var bigPlayEl = document.getElementById('evp-big-play'); if (playBtnEl) playBtnEl.innerHTML = icon; if (bigPlayEl) bigPlayEl.innerHTML = icon; }

function getCurrentMediaElement() {
    if (mediaPlayer.isAudio) return document.getElementById('mp-audio-element');
    return document.getElementById('mp-video-element');
}

function formatMediaTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    var mins = Math.floor(seconds / 60);
    var secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

function startAudioPosition() {
    document.getElementById('game-title').textContent = '🎧 听音辨位';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.style.textAlign = 'center';
    const lengths = [3, 4, 5, 6, 7];
    const seqLength = lengths[Math.min(gameLevel - 1, 4)];
    audioSequence = [];
    for (let i = 0; i < seqLength; i++) audioSequence.push(Math.floor(Math.random() * 3));
    audioIndex = 0;
    board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;"><div style="font-size:14px;color:#666;margin-bottom:16px;">仔细听，按顺序点击播放顺序：</div><div id="audio-sequence-display" style="display:flex;gap:8px;justify-content:center;margin-bottom:20px;">' + audioSequence.map((_, i) => '<div id="audio-seq-' + i + '" style="width:36px;height:36px;background:#f0f0f0;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;">' + (i + 1) + '</div>').join('') + '</div><div style="display:flex;gap:12px;justify-content:center;margin-bottom:20px;"><button onclick="playAudioPos(0)" style="width:80px;height:80px;background:linear-gradient(135deg,#667eea,#764ba2);border:none;border-radius:16px;color:white;font-size:14px;cursor:pointer;">👈 左</button><button onclick="playAudioPos(1)" style="width:80px;height:80px;background:linear-gradient(135deg,#4ECDC4,#38F9D7);border:none;border-radius:16px;color:white;font-size:14px;cursor:pointer;">👆 中</button><button onclick="playAudioPos(2)" style="width:80px;height:80px;background:linear-gradient(135deg,#FF6B6B,#FF4757);border:none;border-radius:16px;color:white;font-size:14px;cursor:pointer;">👉 右</button></div><button onclick="startAudioSeq()" style="margin-top:16px;padding:12px 24px;background:#43E97B;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">开始播放序列</button></div>';
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function toggleVpPlay() { if (!vpVideo) return; vpPlaying ? vpVideo.pause() : vpVideo.play(); }

function updateEnhancedVolumeIcon(value) { var icon = value == 0 ? '🔇' : (value < 50 ? '🔉' : '🔊'); var btnEl = document.getElementById('evp-volume-btn'); if (btnEl) btnEl.innerHTML = icon; }

function updateVolumeIcon() {
    var icon = mediaPlayer.volume == 0 ? '🔇' : (mediaPlayer.volume < 50 ? '🔉' : '🔊');
    var btnEl = document.getElementById('mp-volume-btn');
    if (btnEl) btnEl.innerHTML = icon;
}

function closeVideoPlayer() { if (vpVideo) { vpVideo.pause(); vpVideo.src = ''; } document.getElementById('video-player-modal').classList.remove('show'); }

function updateMediaPlayButtons() {
    var icon = mediaPlayer.isPlaying ? '⏸' : '▶';
    var apPlayBtn = document.getElementById('mp-play-btn');
    if (apPlayBtn) apPlayBtn.innerHTML = icon;
}


// ============================================================
// Games - 游戏模块
// ============================================================