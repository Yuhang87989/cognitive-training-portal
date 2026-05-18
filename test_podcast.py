#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""播客播放功能测试 - V143"""

import asyncio
import sys
from pathlib import Path
from playwright.async_api import async_playwright

async def test_podcast_playback():
    """测试播客播放功能"""
    project_path = Path("/root/cognitive-training-portal")
    test_url = f"file://{project_path}/index.html"
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=['--no-sandbox', '--disable-setuid-sandbox']
        )
        
        page = await browser.new_page()
        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        
        try:
            await page.goto(test_url, wait_until="domcontentloaded", timeout=15000)
        except:
            pass
        
        # 等待脚本完全加载
        await page.wait_for_timeout(5000)
        
        # 测试播客播放功能
        result = await page.evaluate("""() => {
            // 检查必要的函数
            if (typeof playPodcastById !== 'function') {
                return { error: 'playPodcastById not defined' };
            }
            
            // 调用播放
            playPodcastById('podcast1');
            
            var audio = document.getElementById('hidden-audio');
            return {
                audioSrc: audio ? audio.src : '',
                currentPodcast: podcastPlayerState.currentPodcast ? podcastPlayerState.currentPodcast.title : null,
                isPlaying: podcastPlayerState.isPlaying
            };
        }""")
        
        # 检查错误
        if console_errors:
            print("控制台错误:")
            for err in console_errors:
                print(f"  {err}")
        
        await browser.close()
        
        # 判断成功
        return (
            'error' not in result and 
            result.get('audioSrc', '') and 
            result.get('currentPodcast') is not None
        )

async def main():
    print("=" * 50)
    print("播客播放功能测试 - V143")
    print("=" * 50)
    
    result = await test_podcast_playback()
    
    print("\n" + "=" * 50)
    print(f"测试结果: {'PASS' if result else 'FAIL'}")
    print("=" * 50)
    
    return 0 if result else 1

if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
