filepath = r'F:\GraduateWeb\index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

geo_svg = '''<div class="geo-bg">
  <svg class="tri-1" width="160" height="140" viewBox="0 0 160 140">
    <polygon points="0,30 80,0 100,90 20,100" fill="none" stroke="#5b9aa0" stroke-width="1.2" opacity="0.4"/>
    <polygon points="30,10 50,5 55,30 20,35" fill="#5b9aa0" opacity="0.06"/>
  </svg>
  <svg class="tri-2" width="200" height="180" viewBox="0 0 200 180">
    <polygon points="20,0 140,10 180,70 120,150 0,120" fill="none" stroke="#9385bf" stroke-width="1" opacity="0.35"/>
    <polygon points="60,40 100,20 110,60" fill="#9385bf" opacity="0.05"/>
  </svg>
  <svg class="tri-3" width="140" height="130" viewBox="0 0 140 130">
    <polygon points="10,10 80,0 130,50 90,110 0,80" fill="none" stroke="#c4a882" stroke-width="1" opacity="0.3"/>
    <polygon points="40,30 60,15 75,45" fill="#c4a882" opacity="0.05"/>
  </svg>
  <svg class="tri-4" width="180" height="160" viewBox="0 0 180 160">
    <polygon points="0,40 60,0 150,20 170,100 80,120" fill="none" stroke="#6b8399" stroke-width="1.2" opacity="0.3"/>
    <polygon points="80,20 120,10 130,60" fill="#6b8399" opacity="0.05"/>
  </svg>
</div>
'''

body_tag = content.index('<body>') + len('<body>')
content = content[:body_tag] + '\n' + geo_svg + content[body_tag:]

content = content.replace('class="chapter-grid"', 'class="chapter-butterfly"')
content = content.replace('style="background:var(--bg-section);"', '')

print('chapter-grid occurrences:', content.count('chapter-grid'))
print('bg-section occurrences:', content.count('var(--bg-section)'))

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print('HTML patches OK')
