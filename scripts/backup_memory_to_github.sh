#!/usr/bin/env bash
set -euo pipefail

ROOT="/home/node/.openclaw/workspace"
cd "$ROOT"

# 固定使用专用 deploy key，避免走交互式密码/Token
SSH_KEY="/home/node/.ssh/id_ed25519_openclaw_backup"
export GIT_SSH_COMMAND="ssh -i $SSH_KEY -o StrictHostKeyChecking=accept-new"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "[backup] 这里还不是一个 Git 仓库：$ROOT"
  echo "[backup] 需要先 git init 并添加 GitHub remote（建议私有仓库）。"
  exit 2
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "[backup] 找不到 origin remote。请先设置：git remote add origin <repo_url>"
  exit 2
fi

# 设一个温柔的默认身份（只写入当前 repo 的 local config）
if ! git config user.name >/dev/null; then git config user.name "Niko"; fi
if ! git config user.email >/dev/null; then git config user.email "niko@local"; fi

# 备份范围：记忆 + 配置性文本（按需增删）
paths=(
  "memory"
  "MEMORY.md" "USER.md" "TOOLS.md" "SOUL.md" "AGENTS.md" "HEARTBEAT.md" "IDENTITY.md"
)

# 只 add 存在的文件/目录
add_list=()
for p in "${paths[@]}"; do
  [[ -e "$p" ]] && add_list+=("$p")
done

git add "${add_list[@]}"

if git diff --cached --quiet; then
  echo "[backup] 没有可提交的变更，跳过。"
  exit 0
fi

msg="chore: daily memory backup $(date -u +%F)"
git commit -m "$msg" >/dev/null

echo "[backup] commit ok: $msg"

git push -u origin HEAD

echo "[backup] push ok"
