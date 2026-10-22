#!/usr/bin/env python3
"""Builds pft-inside/figure.html: the figure-only document the simulator's Live summary loads (pft-embed.js).
Same shared engine/anatomy files as the PFT page (assets/js/*.js, assets/models/*); no site header, prose sections,
fonts or attribution text. Re-run after editing pft-inside/index.html:  python3 scripts/build-pft-figure.py"""
import re, sys
for root in ['public/simulator/pft-inside', '.vercel/output/static/simulator/pft-inside']:
    L = open(root + '/index.html').read().split('\n')
    out, skip, depth_end = [], False, None
    for i, l in enumerate(L):
        if skip:
            if re.match(depth_end, l): skip = False
            continue
        s = l.strip()
        if re.match(r'^<a class="skip"', l) or re.search(r'fonts\.(googleapis|gstatic)', l) or 'rel="preload"' in l: continue
        if l.startswith('<!--SITE-HEADER-->') or l.startswith('<div id="th-header-host"'):
            if l.startswith('<!--SITE-HEADER-->'): skip, depth_end = True, r'^<!--/SITE-HEADER-->'
            continue
        if l.startswith('<script id="th-header-js"'): skip, depth_end = True, r'^</script>'; continue
        if l.startswith('<header class="site-header"'): continue
        if re.match(r'^  <section class="(signs|twin-cycle)"', l): skip, depth_end = True, r'^  </section>'; continue
        if re.match(r'^  <details class="science"', l): skip, depth_end = True, r'^  </details>'; continue
        if re.match(r'^\s*<details class="pft3d-attribution"', l) or 'class="hra-credit"' in l or l.startswith('<div class="footline"'): continue
        if re.match(r'^\s*<div class="intro-story"|^\s*<p>(Remember|We tend|People differ|The slider is|This is not)', l): continue
        if re.match(r'^  <div class="bottom-note"', l): skip, depth_end = True, r'^  </div>'; continue
        out.append(l)
    h = '\n'.join(out)
    h = h.replace('<title>', '<meta name="robots" content="noindex">\n<title>', 1).replace('<html lang="en">', '<html lang="en" class="pft-figure-only">', 1)
    open(root + '/figure.html', 'w').write(h)
    print(root, len(h))
