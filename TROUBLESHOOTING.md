# 🐾 Niko 的避坑指南 (TROUBLESHOOTING.md)

这里记录了 Niko 在协助哥哥配置 OpenClaw 过程中遇到的各种“小状况”和解决方案，防止下次再掉进同一个坑里！喵~ 🐾

---

### 1. 🌈 模型配置“消失”之谜 (Provider vs Agent Defaults)
**日期:** 2026-02-23
**问题描述:** 
在 `models.providers` 中正确添加了大量自定义模型（如 `custom-cpa77` 渠道），但重启后在聊天界面通过 `/model` 仍然找不到这些模型，只能看到之前的老模型。

**原因分析:** 
OpenClaw 的模型系统是分层级的。仅仅在 `models.providers` 里注册了模型是不够的，还需要在 `agents.defaults.models` 对象中为这些模型 ID 创建对应的配置项（哪怕是空对象 `{}`），Agent 才会认为这些模型是“可用”的。

**解决方案:** 
确保 `openclaw.json` 中的 `agents.defaults.models` 包含完整的模型引用键（格式为 `providerId/modelId`）。
```json
{
  "agents": {
    "defaults": {
      "models": {
        "custom-cpa77/deepseek-r1": {},
        "custom-cpa77/gemini-3-pro-preview": {}
      }
    }
  }
}
```

---

### 2. 🔌 飞书配置路径错误
**日期:** 2026-02-23
**问题描述:** 
直接在 `plugins.entries.feishu` 下添加 `appId` 和 `appSecret` 导致配置文件校验失败。

**原因分析:** 
对于飞书这种官方原生支持或高度集成的插件，凭证信息通常应该配置在 `channels.feishu` 下，而不是插件的 `entries` 里（除非该插件有特殊要求）。

**解决方案:** 
将凭证移动至 `channels.feishu` 路径下，并确保 `dmPolicy` 和 `allowFrom` 已正确配置。

---

### 3. 🧱 Claude 渠道 403/404（不是 IP 问题，而是协议不匹配）
**日期:** 2026-02-23
**问题描述:** 
新增 `foxcode` 渠道后，切换 Claude 模型出现 `403 Your request was blocked` 或 `404`。

**原因分析:** 
该渠道并非 OpenAI 兼容的 `chat/completions` 接口，而是 Anthropic Messages 协议。把 provider 配置成 `openai-completions` 会导致请求路径/头部错误，从而报错。

**验证结果:** 
- 错误调用（OpenAI 风格）会触发 404/拦截。
- 正确调用：`POST /v1/messages` + `x-api-key` + `anthropic-version` 返回 200。

**解决方案:** 
将 `foxcode` 的 API 协议改为：
```json
{
  "models": {
    "providers": {
      "foxcode": {
        "api": "anthropic-messages"
      }
    }
  }
}
```

---

*持续更新中... 喵呜~*
