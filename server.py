import http.server
import functools

Handler = http.server.SimpleHTTPRequestHandler

Handler.extensions_map.update({
    '.js': 'text/javascript',
    '.mjs': 'text/javascript',
    '.glb': 'model/gltf-binary',
    '.gltf': 'model/gltf+json',
    '.wasm': 'application/wasm',
})

port = 8000
server = http.server.HTTPServer(('', port), Handler)
print(f'Serving on http://localhost:{port}')
server.serve_forever()
