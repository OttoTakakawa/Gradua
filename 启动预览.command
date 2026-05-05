#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR" || exit 1
LOG_DIR="$SCRIPT_DIR/Log"
LOG_FILE="$LOG_DIR/预览启动日志.md"
TIMESTAMP="$(date +"%Y年%m月%d日 %H:%M")"

mkdir -p "$LOG_DIR"

if [ ! -f "$LOG_FILE" ]; then
  cat > "$LOG_FILE" <<'EOF'
# 预览启动日志

EOF
fi

append_log() {
  local status="$1"
  local detail="$2"
  {
    echo "## $TIMESTAMP"
    echo "- 平台：macOS"
    echo "- 启动脚本：\`启动预览.command\`"
    echo "- 状态：$status"
    echo "- 说明：$detail"
    echo
  } >> "$LOG_FILE"
}

if command -v python3 >/dev/null 2>&1; then
  PYTHON_CMD="python3"
elif command -v python >/dev/null 2>&1; then
  PYTHON_CMD="python"
else
  echo "未找到 Python 3，请先安装 Python。"
  append_log "失败" "未找到可用的 Python 解释器。"
  read -r -p "按回车键退出..."
  exit 1
fi

echo
echo "============================"
echo " Within - Local Preview"
echo " http://localhost:8000"
echo "============================"
echo

pkill -f "python3? server.py" >/dev/null 2>&1
pkill -f "python3? -m http.server 8000" >/dev/null 2>&1
sleep 1

"$PYTHON_CMD" server.py &
SERVER_PID=$!
sleep 2

if ! kill -0 "$SERVER_PID" >/dev/null 2>&1; then
  echo "本地服务器启动失败，请检查 Python 环境或端口占用。"
  append_log "失败" "本地服务器未能成功启动，请检查 Python 环境或端口占用。"
  read -r -p "按回车键退出..."
  exit 1
fi

open "http://localhost:8000"
append_log "成功" "已启动本地服务器并打开 http://localhost:8000 。"
echo "Server running. Close this window to stop."
wait "$SERVER_PID"
