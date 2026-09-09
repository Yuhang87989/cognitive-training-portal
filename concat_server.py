#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
视频拼接服务 - 幻灵创作坊 V467
接收多个视频 URL，下载后用 FFmpeg 拼接为一个 mp4 返回
支持可选旁白配音：post 带 voice 字段时，用 edge-tts 合成中文旁白并合入音轨
"""
from flask import Flask, request, send_file, jsonify
import requests
import subprocess
import os
import tempfile
import shutil

app = Flask(__name__)

# 临时目录清理
WORK_DIR = '/tmp/concat_work'
os.makedirs(WORK_DIR, exist_ok=True)

@app.route('/concat', methods=['POST'])
def concat():
    try:
        data = request.get_json(force=True)
        urls = data.get('urls', [])
        voice = (data.get('voice') or '').strip()
        if not urls or len(urls) < 2:
            return jsonify({'error': '至少需要 2 个视频 URL'}), 400
        if len(urls) > 20:
            return jsonify({'error': '最多支持 20 段视频'}), 400

        # 创建工作目录
        task_id = 'task_' + str(int(__import__('time').time() * 1000))
        task_dir = os.path.join(WORK_DIR, task_id)
        os.makedirs(task_dir, exist_ok=True)

        # 下载所有视频
        files = []
        for i, url in enumerate(urls):
            try:
                r = requests.get(url, timeout=120, headers={'User-Agent': 'Mozilla/5.0'})
                if r.status_code != 200:
                    shutil.rmtree(task_dir, ignore_errors=True)
                    return jsonify({'error': f'下载第 {i+1} 段失败 HTTP {r.status_code}'}), 500
                fp = os.path.join(task_dir, f'seg{i:02d}.mp4')
                with open(fp, 'wb') as f:
                    f.write(r.content)
                if os.path.getsize(fp) < 10000:
                    shutil.rmtree(task_dir, ignore_errors=True)
                    return jsonify({'error': f'第 {i+1} 段视频文件异常'}), 500
                files.append(fp)
            except Exception as e:
                shutil.rmtree(task_dir, ignore_errors=True)
                return jsonify({'error': f'下载第 {i+1} 段异常: {str(e)}'}), 500

        # 生成 concat 列表文件
        list_fp = os.path.join(task_dir, 'list.txt')
        with open(list_fp, 'w', encoding='utf-8') as f:
            for fp in files:
                f.write(f"file '{fp}'\n")

        # FFmpeg 拼接（stream copy，不重编码，速度快）
        out_fp = os.path.join(task_dir, 'out.mp4')
        cmd = [
            'ffmpeg', '-y',
            '-f', 'concat',
            '-safe', '0',
            '-i', list_fp,
            '-c', 'copy',
            '-movflags', '+faststart',
            out_fp
        ]
        result = subprocess.run(cmd, capture_output=True, timeout=300)
        if result.returncode != 0:
            err_log = result.stderr.decode('utf-8', 'ignore')[-1000:]
            shutil.rmtree(task_dir, ignore_errors=True)
            return jsonify({'error': 'FFmpeg 拼接失败', 'log': err_log}), 500

        if not os.path.exists(out_fp) or os.path.getsize(out_fp) < 10000:
            shutil.rmtree(task_dir, ignore_errors=True)
            return jsonify({'error': '拼接后文件异常'}), 500

        # ---- 可选旁白配音：腾讯云 TTS 合成中文语音并合入音轨 ----
        final_fp = out_fp
        voice_status = 'none'
        if voice:
            try:
                # 1) 合成旁白语音（腾讯云 TTS，国内可达）
                voice_mp3 = os.path.join(task_dir, 'voice.mp3')
                _synth_tencent(voice, voice_mp3)
                if not os.path.exists(voice_mp3) or os.path.getsize(voice_mp3) < 1000:
                    raise RuntimeError('语音合成异常')

                # 2) 获取拼接视频总时长（秒）
                probe = subprocess.run(
                    ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of',
                     'default=noprint_wrappers=1:nokey=1', out_fp],
                    capture_output=True, timeout=60)
                duration = float(probe.stdout.decode('utf-8', 'ignore').strip() or 0)
                if duration <= 0:
                    duration = (len(urls)) * 5  # 兜底按每段5秒估算

                # 3) 用 ffmpeg 把旁白合入：视频流不动，旁白循环铺满整段作为音轨
                voiced_fp = os.path.join(task_dir, 'voiced.mp4')
                cmd2 = [
                    'ffmpeg', '-y',
                    '-i', out_fp,
                    '-i', voice_mp3,
                    '-filter_complex',
                    f"[1:a]aloop=loop=-1:size=2e+09,volume=1.0[a1]",
                    '-map', '0:v',
                    '-map', '[a1]',
                    '-c:v', 'copy',
                    '-c:a', 'aac',
                    '-b:a', '128k',
                    '-t', str(duration),
                    '-shortest',
                    '-movflags', '+faststart',
                    voiced_fp
                ]
                r2 = subprocess.run(cmd2, capture_output=True, timeout=300)
                if r2.returncode != 0 or not os.path.exists(voiced_fp) or os.path.getsize(voiced_fp) < 10000:
                    err2 = r2.stderr.decode('utf-8', 'ignore')[-800:]
                    raise RuntimeError('音轨合并失败: ' + err2)
                final_fp = voiced_fp
                voice_status = 'ok'
            except Exception as ve:
                # 配音失败不回滚拼接结果，仅标记状态（前端可据此提示）
                voice_status = 'fail:' + str(ve)

        # 返回最终文件
        resp = send_file(final_fp, mimetype='video/mp4', as_attachment=False,
                         download_name='concat.mp4')
        resp.headers['X-Voice-Status'] = voice_status

        # 异步清理（延迟 5 分钟）
        import threading
        def cleanup():
            import time
            time.sleep(300)
            shutil.rmtree(task_dir, ignore_errors=True)
        threading.Thread(target=cleanup, daemon=True).start()

        return resp

    except Exception as e:
        return jsonify({'error': f'服务器错误: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'version': 'v467'})

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001, threaded=True)