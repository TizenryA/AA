// img2video-proxy: 本地中转 + 本地缓存（免费）
// 说明：此服务不实现真实“图转视频模型”调用（需要你提供具体模型API）。
// 当前提供：
// - POST /api/img2video  接收 image_url，先下载图片并落盘，然后生成一个“占位视频”(用静态占位 mp4) 作为流程跑通示例
// - 静态：/videos, /images
// 你拿到可用的视频模型后，我再把 generateVideo() 替换成真实调用。

import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const ROOT = process.env.CACHE_ROOT || path.resolve(process.cwd(), 'cache');
const IMAGES_DIR = path.join(ROOT, 'images');
const VIDEOS_DIR = path.join(ROOT, 'videos');

async function ensureDirs() {
  await fs.mkdir(IMAGES_DIR, { recursive: true });
  await fs.mkdir(VIDEOS_DIR, { recursive: true });
}

function sha1(s) {
  return crypto.createHash('sha1').update(s).digest('hex');
}

async function downloadTo(url, outPath) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`download failed: ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  await fs.writeFile(outPath, buf);
  return buf.length;
}

// 占位：真实图转视频请在这里接入模型
async function generateVideoPlaceholder(videoPath) {
  // 写入一个最小的占位文件（并非真正 mp4）。
  // 为了让 UI 流程先跑通，这里用一个“假mp4”占位会导致播放器不一定能播。
  // 更可靠的做法是：放一个你自己的 tiny.mp4 在 assets 里复制过去。
  const content = Buffer.from('PLACEHOLDER_MP4');
  await fs.writeFile(videoPath, content);
}

app.post('/api/img2video', async (req, res) => {
  try {
    await ensureDirs();
    const { image_url, scene_id = '', prompt = '', duration_s = 4 } = req.body || {};
    if (!image_url) return res.status(400).json({ error: 'missing image_url' });

    const key = sha1(image_url + '|' + scene_id + '|' + prompt + '|' + String(duration_s)).slice(0, 16);

    const imgPath = path.join(IMAGES_DIR, `${key}.png`);
    const videoPath = path.join(VIDEOS_DIR, `${key}.mp4`);

    // 图片缓存
    try {
      await fs.access(imgPath);
    } catch {
      await downloadTo(image_url, imgPath);
    }

    // 视频缓存
    try {
      await fs.access(videoPath);
    } catch {
      await generateVideoPlaceholder(videoPath);
    }

    const base = process.env.PUBLIC_BASE_URL || `http://127.0.0.1:${process.env.PORT || 8787}`;
    return res.json({
      key,
      image_cache_url: `${base}/images/${key}.png`,
      video_url: `${base}/videos/${key}.mp4`,
      cached: true,
      note: '当前为占位视频生成：请提供真实视频模型API后接入 generateVideo()。'
    });
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
});

app.use('/images', express.static(IMAGES_DIR, { fallthrough: false }));
app.use('/videos', express.static(VIDEOS_DIR, { fallthrough: false }));

app.get('/health', async (_req, res) => {
  await ensureDirs();
  res.json({ ok: true, root: ROOT });
});

const port = Number(process.env.PORT || 8787);
app.listen(port, () => {
  console.log(`[img2video-proxy] listening on http://127.0.0.1:${port}`);
});
