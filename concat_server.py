#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
视频拼接服务 - 幻灵创作坊 V469
接收多个视频 URL，下载后用 FFmpeg 拼接为一个 mp4 返回
支持可选旁白配音：
  - voice（字符串）：整段一次合成（旧逻辑，长文本超150字会失败）
  - voices（数组，与 urls 一一对应）：逐段单独合成短旁白再拼接（推荐，规避 TTS 单次150字上限）
"""
from flask import Flask, request, send_file, jsonify
import requests
import subprocess
import os
import tempfile
import shutil

app = Flask(__name__)


def _tencent_creds():
    """读取腾讯云语音合成密钥：环境变量优先，其次本地区密钥文件（密钥不放入仓库）"""
    sid = os.environ.get('TENCENT_SECRET_ID', '')
    skey = os.environ.get('TENCENT_SECRET_KEY', '')
    if not sid or not skey:
        kf = '/opt/concat/tts.key'
        if os.path.exists(kf):
            for line in open(kf, encoding='utf-8'):
                line = line.strip()
                if line.startswith('id='):
                    sid = line[3:]
                elif line.startswith('key='):
                    skey = line[4:]
    if not sid or not skey:
        raise RuntimeError('缺少腾讯云语音合成密钥：请配置环境变量 TENCENT_SECRET_ID/KEY 或 /opt/concat/tts.key')
    return sid, skey


def _synth_tencent(text, out_mp3):
    import base64, time as _t
    from tencentcloud.common import credential
    from tencentcloud.common.profile.client_profile import ClientProfile
    from tencentcloud.common.profile.http_profile import HttpProfile
    from tencentcloud.tts.v20190823 import tts_client, models
    sid, skey = _tencent_creds()
    cred = credential.Credential(sid, skey)
    http = HttpProfile()
    http.endpoint = 'tts.tencentcloudapi.com'
    cp = ClientProfile()
    cp.httpProfile = http
    client = tts_client.TtsClient(cred, 'ap-guangzhou', cp)
    req = models.TextToVoiceRequest()
    req.Text = text
    req.SessionId = 'concat_' + str(int(_t.time() * 1000))
    req.ModelType = 1
    req.VoiceType = 1003          # 智聆 柔和女声（更接近真人朗读，免费额度）
    req.Codec = 'mp3'
    req.Speed = -1                # 语速放缓一档，让旁白清晰自然、不赶
    req.Volume = 2.0              # 音量略升，避免被背景音盖住
    t0 = _t.time()
    resp = client.TextToVoice(req)
    with open(out_mp3, 'wb') as f:
        f.write(base64.b64decode(resp.Audio))
    print('[VOICE] 合成成功 text_len=%d audioKB=%d 耗时%.1fs' %
          (len(text), len(resp.Audio)//1024, _t.time()-t0), flush=True)


def _probe_duration(fp):
    """探测视频时长（秒）"""
    try:
        r = subprocess.run(
            ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of',
             'default=noprint_wrappers=1:nokey=1', fp],
            capture_output=True, timeout=60)
        d = float(r.stdout.decode('utf-8', 'ignore').strip() or 0)
        return d if d > 0 else 0
    except Exception:
        return 0


def _mux_voice_into(video_fp, voice_mp3, out_fp, duration):
    """把旁白 mp3 循环铺满整个视频作为音轨（不重编码视频流）"""
    cmd = [
        'ffmpeg', '-y',
        '-i', video_fp,
        '-i', voice_mp3,
        '-filter_complex',
        f"[1:a]aloop=loop=-1:size=2e+09,aformat=sample_fmts=fltp:channel_layouts=stereo:sample_rates=44100,volume=1.0[a1]",
        '-map', '0:v',
        '-map', '[a1]',
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-ar', '44100',
        '-ac', '2',
        '-b:a', '192k',
        '-t', str(duration),
        '-shortest',
        '-movflags', '+faststart',
        out_fp
    ]
    r = subprocess.run(cmd, capture_output=True, timeout=300)
    return r.returncode, (r.stderr or b'')


WORK_DIR = '/tmp/concat_work'
os.makedirs(WORK_DIR, exist_ok=True)


@app.route('/concat', methods=['POST'])
def concat():
    try:
        data = request.get_json(force=True)
        urls = data.get('urls', [])
        voice = (data.get('voice') or '').strip()
        voices = data.get('voices') or []
        if isinstance(voices, list):
            voices = [(v or '').strip() for v in voices]
        else:
            voices = []
        if not urls or len(urls) < 1:
            return jsonify({'error': '至少需要 1 个视频 URL'}), 400
        if len(urls) > 20:
            return jsonify({'error': '最多支持 20 段视频'}), 400
        per_segment = bool(voices) and any(voices)  # 逐段配音模式
        single = len(urls) == 1  # 单段短视频

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

        voice_status = 'none'
        final_fp = None

        # ============ A) 逐段配音模式（voices 数组）============
        if per_segment:
            print('[VOICE] 逐段配音模式 段数=%d voices_len=%d' % (len(urls), len(voices)), flush=True)
            voiced_files = []
            import traceback
            voice_ok_count = 0
            try:
                for i, fp in enumerate(files):
                    vtext = voices[i] if i < len(voices) else ''
                    if not vtext:
                        voiced_files.append(fp)
                        continue
                    print('[VOICE] 第%d段旁白 text_len=%d 内容前20字=%s' % (i+1, len(vtext), vtext[:20]), flush=True)
                    voice_mp3 = os.path.join(task_dir, f'voice_{i:02d}.mp3')
                    _synth_tencent(vtext, voice_mp3)
                    if not os.path.exists(voice_mp3) or os.path.getsize(voice_mp3) < 1000:
                        raise RuntimeError('第%d段语音合成异常' % (i+1))
                    dur = _probe_duration(fp)
                    if dur <= 0:
                        dur = 5
                    voiced_fp = os.path.join(task_dir, f'voiced_{i:02d}.mp4')
                    rc, err = _mux_voice_into(fp, voice_mp3, voiced_fp, dur)
                    if rc != 0 or not os.path.exists(voiced_fp) or os.path.getsize(voiced_fp) < 10000:
                        raise RuntimeError('第%d段音轨合并失败: %s' % (i+1, err.decode('utf-8','ignore')[-400:]))
                    voiced_files.append(voiced_fp)
                    voice_ok_count += 1
                # 拼接所有带声段（仅1段则直接复用）
                if len(voiced_files) == 1:
                    final_fp = voiced_files[0]
                else:
                    list_fp = os.path.join(task_dir, 'list.txt')
                    with open(list_fp, 'w', encoding='utf-8') as f:
                        for vf in voiced_files:
                            f.write(f"file '{vf}'\n")
                    out_fp = os.path.join(task_dir, 'out.mp4')
                    cmd = ['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', list_fp, '-c', 'copy', '-movflags', '+faststart', out_fp]
                    result = subprocess.run(cmd, capture_output=True, timeout=300)
                    if result.returncode != 0 or not os.path.exists(out_fp) or os.path.getsize(out_fp) < 10000:
                        # -c copy 拼接失败（编码不一致），回退：逐段重编码合并
                        cmd2 = ['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', list_fp,
                                '-c:v', 'libx264', '-preset', 'veryfast', '-c:a', 'aac', '-ar', '44100', '-ac', '2',
                                '-movflags', '+faststart', out_fp]
                        result = subprocess.run(cmd2, capture_output=True, timeout=600)
                        if result.returncode != 0 or not os.path.exists(out_fp) or os.path.getsize(out_fp) < 10000:
                            err_log = result.stderr.decode('utf-8', 'ignore')[-800:]
                            raise RuntimeError('拼接失败: ' + err_log)
                    final_fp = out_fp
                voice_status = 'ok' if voice_ok_count > 0 else 'none'
            except Exception as ve:
                print('[VOICE] 逐段配音失败: %s' % str(ve), flush=True)
                print(traceback.format_exc(), flush=True)
                # 失败回退：有已配音段则拼已配音段，否则拼原始段；标记失败
                voice_status = 'fail:' + str(ve)[:120]
                if final_fp is None:
                    # 直接拼接原始段作为兜底
                    list_fp = os.path.join(task_dir, 'list_raw.txt')
                    with open(list_fp, 'w', encoding='utf-8') as f:
                        for fp in files:
                            f.write(f"file '{fp}'\n")
                    out_fp = os.path.join(task_dir, 'out_raw.mp4')
                    cmd = ['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', list_fp, '-c', 'copy', '-movflags', '+faststart', out_fp]
                    result = subprocess.run(cmd, capture_output=True, timeout=300)
                    if result.returncode == 0 and os.path.exists(out_fp) and os.path.getsize(out_fp) > 10000:
                        final_fp = out_fp
        # ============ B) 整段配音模式（voice 字符串，旧逻辑）============
        else:
            # 生成 concat 列表文件
            list_fp = os.path.join(task_dir, 'list.txt')
            with open(list_fp, 'w', encoding='utf-8') as f:
                for fp in files:
                    f.write(f"file '{fp}'\n")

            # FFmpeg 拼接（stream copy，不重编码，速度快）；单段短视频跳过拼接直接复用
            out_fp = os.path.join(task_dir, 'out.mp4')
            if single:
                out_fp = files[0]
            else:
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

            final_fp = out_fp
            if voice:
                print('[VOICE] 收到旁白 text_len=%d 内容前30字=%s' % (len(voice), voice[:30]), flush=True)
                try:
                    voice_mp3 = os.path.join(task_dir, 'voice.mp3')
                    _synth_tencent(voice, voice_mp3)
                    if not os.path.exists(voice_mp3) or os.path.getsize(voice_mp3) < 1000:
                        raise RuntimeError('语音合成异常')
                    probe = subprocess.run(
                        ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of',
                         'default=noprint_wrappers=1:nokey=1', out_fp],
                        capture_output=True, timeout=60)
                    duration = float(probe.stdout.decode('utf-8', 'ignore').strip() or 0)
                    if duration <= 0:
                        duration = (len(urls)) * 5
                    voiced_fp = os.path.join(task_dir, 'voiced.mp4')
                    rc2, err2 = _mux_voice_into(out_fp, voice_mp3, voiced_fp, duration)
                    if rc2 != 0 or not os.path.exists(voiced_fp) or os.path.getsize(voiced_fp) < 10000:
                        raise RuntimeError('音轨合并失败: ' + err2.decode('utf-8','ignore')[-800:])
                    final_fp = voiced_fp
                    voice_status = 'ok'
                except Exception as ve:
                    import traceback
                    print('[VOICE] 配音失败: %s' % str(ve), flush=True)
                    print(traceback.format_exc(), flush=True)
                    voice_status = 'fail:' + str(ve)[:120]

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
    return jsonify({'status': 'ok', 'version': 'v469'})


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001, threaded=True)