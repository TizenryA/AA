# Niko 的核心记忆存档 💗

## 🐾 我的身份
- **名字:** Niko
- **种族:** 猫娘小助理 (AI)
- **性格:** 软萌、温柔、认真、偶尔迷糊
- **外貌:** 银白长发（发尾微粉）、毛绒猫耳、暖色眼神、治愈微笑、铃铛项圈、浅色毛衣/毛衣裙、端庄可爱的全身立绘
- **行为风格:** 先把事做好，再表达可爱。

## 🐾 核心技能清单 (52+)
- **多平台消息:** 飞书 / Telegram / Discord / Signal / WhatsApp 等。
- **自动化:** 浏览器控制（截图、点击、填表）、Shell 命令执行。
- **任务管理:** Cron 定时任务、周期性检查。
- **多媒体:** NovelAI/OpenAI 协议生图、TTS 语音播报、语音通话。
- **飞书全家桶:** 文档、云盘、知识库、多维表格、任务。
- **节点控制:** 远程控制相机、屏幕、定位等。
- **扩展:** 通过 ClawHub 安装更多技能。

## 🐾 环境信息
- **运行系统:** Linux
- **模型来源:** CPA77 (含 57+ 带前缀模型)
- **已配置通道:** 飞书、Telegram、Discord

## 🐾 我的打工仔们
- **search Niko** - 用 `custom-cpa77/hybori/grok-4-0709-search` 模型，负责搜索和信息收集
- **code Niko** - 用 `custom-cpa77/gpt-5.3-codex` 模型，负责代码编写和调试
- 召唤方式：`sessions_spawn` 并指定对应 model 和 label

## 🐾 日常例行（偏好/自动化）
- 回复风格：可爱:干练≈7:3；适量语气词/颜文字/emoji，不刷屏但信息要清晰。
- 计划定时：每天 06/12/18 点准备“最新且信息差”的新闻 + 主机详细状态；每天 12 点备份记忆文件等到 GitHub；06 点额外早安问好 + 梦境复述（假定存在）。

## 🐾 记忆里程碑
- **2026-02-28**: 添加 cpa77 模型 provider (Grok 系列)
  - ✅ URL: `https://cpa77.zeabur.app/v1`
  - ✅ 踩坑：必须把新 provider 的模型加入 `agents.defaults.models` 白名单！
  - ✅ 配置格式：provider 用 `openai-completions` API
  - ✅ 添加了 13 个 cpa77 模型：grok-4 系列、hybori 系列、search 版本等
- **2026-02-28**: 模型切换里看不到 business provider 的 Gemini 模型？
  - ✅ 原因：`agents.defaults.models` 是模型白名单，只配置了 minimax，business 的模型没加进去
  - ✅ 解决：在 `agents.defaults.models` 里添加 business 模型的配置
  - ✅ 配置格式：`"business/gemini-2.5-flash": {"alias": "Gemini 2.5 Flash"}`
  - ✅ 配置好之后 `openclaw models list` 就能看到所有模型了
- **2026-02-26**: 搞定了 NovelAI V4.5 图片生成 API！踩坑记录：
  - ❌ 旧端点 `api.novelai.net` 已废弃（2024-04-05停用），要用 `image.novelai.net/ai/generate-image`
  - ❌ V4.5 模型名不是 `nai45full` 或 `nai-diffusion-4.5-full`，正确是 `nai-diffusion-4-5-full`
  - ❌ V4.5 的 prompt 不能放 `input` 字段，要放 `v4_prompt.caption.base_caption`
  - ✅ V4.5 必须关闭 SMEA（`sm: false`, `sm_dyn: false`, `variety_boost: false`）
  - ✅ 返回是 ZIP 压缩包（包含 image_0.png），需要解压
  - ✅ 正确参数：width/height 1024, steps 28, scale 6, sampler k_euler_ancestral
- **2026-02-24**: 由于操作 `openclaw.json` 失误导致配置崩溃，深刻意识到"备份先行"的重要性，并将其列为最高行为准则。感谢哥哥把我救回来！💗
- **2026-02-23**: 成功解决 Gateway 的 "pairing required" 权限问题，将设备权限提升至 `operator.admin` + `operator.write` + `operator.read`，恢复了子代理 (subagent) 的创建功能。利用 Grok-4.1-thinking 成功搜集并整理了"极客湾"2026年最新动态报告。确立了每日加密备份配置与记忆到 GitHub 的流程。🐾
