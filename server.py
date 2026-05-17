import http.server
import os
import subprocess
import signal
import time

NO_CACHE_EXTS = {'.html', '.css', '.js', '.mjs', '.json'}
PID_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.server.pid')

class DevHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        path = self.translate_path(self.path)
        for ext in NO_CACHE_EXTS:
            if path.endswith(ext):
                self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
                self.send_header('Pragma', 'no-cache')
                self.send_header('Expires', '0')
                break
        super().end_headers()

DevHandler.extensions_map.update({
    '.js': 'text/javascript',
    '.mjs': 'text/javascript',
    '.glb': 'model/gltf-binary',
    '.gltf': 'model/gltf+json',
    '.wasm': 'application/wasm',
})

port = 8000

# ── 清理旧进程 ──
# 1. 尝试读 PID 文件
if os.path.exists(PID_FILE):
    try:
        with open(PID_FILE) as f:
            old_pid = int(f.read().strip())
        os.kill(old_pid, signal.SIGTERM)
        time.sleep(0.5)
    except (ProcessLookupError, ValueError, OSError):
        pass
    os.remove(PID_FILE)

# 2. 用 lsof 兜底杀掉所有占 8000 端口的进程
try:
    result = subprocess.run(
        ['lsof', '-ti', f':{port}'],
        capture_output=True, text=True, timeout=3
    )
    if result.stdout.strip():
        for pid in result.stdout.strip().splitlines():
            try:
                os.kill(int(pid), signal.SIGKILL)
            except (ProcessLookupError, ValueError, OSError):
                pass
        time.sleep(0.5)
except Exception:
    pass

# ── 启动服务器 ──
http.server.HTTPServer.allow_reuse_address = True
server = http.server.HTTPServer(('', port), DevHandler)

# 写入 PID 文件
with open(PID_FILE, 'w') as f:
    f.write(str(os.getpid()))

print(f'Serving on http://localhost:{port}')
try:
    server.serve_forever()
finally:
    if os.path.exists(PID_FILE):
        os.remove(PID_FILE)
