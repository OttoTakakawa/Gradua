import urllib.request

r = urllib.request.urlopen('http://localhost:8000/vendor/model-viewer.min.js')
print('Status:', r.status)
print('Content-Type:', r.headers.get('Content-Type'))

r2 = urllib.request.urlopen('http://localhost:8000/models/space-layout.glb')
print('GLB Status:', r2.status)
print('GLB Content-Type:', r2.headers.get('Content-Type'))
