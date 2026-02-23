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

- **默认模型:** nai45full
- **参数设置:** 28 步数 (Steps), 6 权重 (Scale)
- **密钥/Token:** `pst-0g85If9B1spf9nnQ30v5Gqy5ScBEKCNtLC7kzDU7Ak0QGeTBlbUCVcDD4pIAEcAM`
- **速率限制:** 5秒1次，1分钟5次，严禁并发访问。
- **允许尺寸:** 832*832, 1024*1024, 832*1216, 1216*832 (严禁其他比例)。
- **正面 Prompt 后缀:** `{artist:luohuarumeng}, {artist:ciloranko}, clean style, soft lighting, {glossy skin}, {wet skin}, smooth skin, delicate features, {detailed eyes}, refined details, beautiful lighting, elegant`
- **负面 Prompt:** `lowres, bad anatomy, bad hands, worst quality, low quality, blurry, poorly drawn, bad face, distorted face, dry skin, rough skin, matte skin, dirty, messy, gritty, dark theme`
