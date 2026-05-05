import http.server

NO_CACHE_EXTS = {'.html', '.css', '.js', '.mjs', '.json'}

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
server = http.server.HTTPServer(('', port), DevHandler)
print(f'Serving on http://localhost:{port}')
server.serve_forever()
