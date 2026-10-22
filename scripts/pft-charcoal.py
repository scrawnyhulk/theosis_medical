#!/usr/bin/env python3
"""PFT page -> charcoal B (simulator v7.6.69+/site): navy darks become blue-tinted charcoal at the same lightness,
old blues -> site blue, plus token overrides appended to pft.css. Idempotent (marker)."""
import re
MARK = '/* PFT charcoal B (v7.6.71) */'
def charc(r, g, b):
    L = .3*r + .59*g + .11*b
    return max(0, round(L*.93)), max(0, round(L*1.03)), min(255, round(L*1.25)+2)
def hexsub(m):
    h = m.group(1); r, g, b = int(h[0:2],16), int(h[2:4],16), int(h[4:6],16)
    if max(r,g,b) <= 0x58 and b >= r + 6:
        return '#%02x%02x%02x' % charc(r,g,b)
    return m.group(0)
def rgbasub(m):
    r, g, b = map(int, m.group(1, 2, 3))
    if max(r,g,b) <= 0x58 and b >= r + 6:
        r, g, b = charc(r, g, b)
    return 'rgba(%d,%d,%d,%s)' % (r, g, b, m.group(4))
EXTRA = MARK + '''
:root{--bg:#14171c;--panel:#1c2027;--line:#2c3440;--blue:#5b9cec;--card-border:rgba(69,135,198,.55)}
html{background:#14171c}
body{background-color:#14171c!important;background-image:radial-gradient(55% 50% at 74% 38%,rgba(42,122,224,.16),transparent 70%)!important;background-repeat:no-repeat!important;background-size:100% 100%!important;background-attachment:fixed!important}
a{color:#8cbcf0}
.ct-panel,.visual,.detail,.signs,.twin-cycle,.science,.reading-details,.art-sec,.bottom-note,.pft3d-attribution,details.intro-details{border:1px solid var(--card-border)!important;border-radius:14px;box-shadow:0 0 0 1px rgba(69,135,198,.10),0 0 22px rgba(42,122,224,.10)}
button[aria-pressed=true],[data-pft3d-mode][aria-pressed=true],[data-pft3d-view][aria-pressed=true],[data-renderer-mode][aria-pressed=true]{background:#2a6cc4!important;border-color:#4587c6!important;color:#fff!important}
input[type=range]{accent-color:#4587c6}
.human-3d-stage{background:radial-gradient(ellipse at 50% 42%,rgba(42,122,224,.14),rgba(20,23,28,0) 62%),#14171c!important}
#th-header-host~main .mobile-dock{top:64px}
.pft-embedded body,.pft-figure-only body{background-image:none!important}
'''
for root in ['public/simulator/pft-inside', '.vercel/output/static/simulator/pft-inside']:
    f = root + '/assets/css/pft.css'; c = open(f).read()
    if MARK in c: c = c[:c.index(MARK)]
    c = re.sub(r'#([0-9a-fA-F]{6})\b', hexsub, c)
    c = re.sub(r'rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)', rgbasub, c)
    c = c.replace('url(../img/grain.jpg)', 'none').replace('url("../img/grain.jpg")', 'none')
    open(f, 'w').write(c.rstrip() + '\n' + EXTRA)
    for h in ['index.html', 'figure.html']:
        p = root + '/' + h; s = open(p).read().replace('content="#05080d"', 'content="#14171c"'); open(p, 'w').write(s)
    print('ok', f)
