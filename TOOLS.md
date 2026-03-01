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

## NovelAI 生图配置（不含任何密钥）

- **API 端点:** `https://image.novelai.net/ai/generate-image`
- **默认模型:** `nai-diffusion-4-5-full`
- **默认参数:** steps=28, scale=6, 1024x1024
- **采样器:** `k_euler_ancestral`

⚠️ 约定：任何 Token/密码/密钥 **不要写进仓库**，只放到密钥管理/环境变量里，避免泄露。
