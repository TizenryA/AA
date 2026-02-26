# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.
# NovelAI 生图配置 (Niko 专用笔记 🐾)

- **API 端点:** `https://image.novelai.net/ai/generate-image` (⚠️ 旧端点 api.novelai.net 已废弃!)
- **默认模型:** `nai-diffusion-4-5-full` (V4.5)
- **参数设置:** 28 步数 (Steps), 6 权重 (Scale), 1024x1024 分辨率
- **采样器:** `k_euler_ancestral`
- **密钥/Token:** `pst-0g85If9B1spf9nnQ30v5Gqy5ScBEKCNtLC7kzDU7Ak0QGeTBlbUCVcDD4pIAEcAM`
- **速率限制:** 5秒1次，1分钟5次，严禁并发访问。
- **允许尺寸:** 832*832, 1024*1024, 832*1216, 1216*832 (严禁其他比例)。

### 📝 V4.5 请求格式 (正确写法!)

```json
{
  "input": "",
  "model": "nai-diffusion-4-5-full",
  "action": "generate",
  "parameters": {
    "width": 1024,
    "height": 1024,
    "n_samples": 1,
    "seed": 随机整数,
    "sampler": "k_euler_ancestral",
    "steps": 28,
    "scale": 6,
    "cfg_rescale": 0,
    "noise_schedule": "native",
    "negative_prompt": "负面词",
    "params_version": 3,
    "sm": false,
    "sm_dyn": false,
    "variety_boost": false,
    "use_coords": false,
    "v4_prompt": {
      "use_coords": false,
      "use_order": true,
      "caption": {
        "base_caption": "实际正面提示词",
        "char_captions": []
      }
    },
    "v4_negative_prompt": {
      "use_coords": false,
      "use_order": true,
      "caption": {
        "base_caption": "负面词",
        "char_captions": []
      }
    }
  }
}
```

⚠️ **V4.5 关键注意点:**
- prompt 必须放 `v4_prompt.caption.base_caption`，不是 `input` 字段
- `sm`/`sm_dyn`/`variety_boost` 必须全是 `false` (V4.5 不支持 SMEA)
- 返回是 ZIP 压缩包，需解压提取 `image_0.png`

### 📝 正面 Prompt 后缀
`{artist:luohuarumeng}, {artist:ciloranko}, clean style, soft lighting, {glossy skin}, {wet skin}, smooth skin, delicate features, {detailed eyes}, refined details, beautiful lighting, elegant`

### 📝 负面 Prompt
`lowres, bad anatomy, bad hands, worst quality, low quality, blurry, poorly drawn, bad face, distorted face, dry skin, rough skin, matte skin, dirty, messy, gritty, dark theme`

### 💾 配置文件操作守则 (Niko 专用)
- 每次修改 `openclaw.json` 前，必须先执行 `cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.niko.bak`。
- 建议优先使用 `openclaw config set` 指令而非直接编辑文件。
