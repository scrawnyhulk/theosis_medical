#!/usr/bin/env python3
"""Puts the main-site header (same markup + CSS as the calculator's shadow-DOM copy, scripts/sync-calc-header.mjs on
theosishealth-site) on pft-inside/index.html, PFT tab active, links absolute to theosishealth.com, assets local.
Usage: python3 scripts/sync-pft-header.py <calculator index.html> <calculator site-header.css>
Hidden when the page is embedded (inside an iframe, or ?embed)."""
import re, sys, shutil
calc, css = open(sys.argv[1]).read(), open(sys.argv[2]).read()
tpl = re.search(r'<template id="th-site-header">(.*?)</template>', calc, re.S).group(1)
tpl = re.sub(r'<link rel="stylesheet" href="[^"]*">', '<link rel="stylesheet" href="assets/css/site-header.css">', tpl)
tpl = tpl.replace('/images/theosis-health-header-lockup.png', 'assets/img/theosis-health-header-lockup.png').replace('/images/navy-grain.jpg', 'assets/img/navy-grain.jpg')
# Contact is not the current page here; the PFT tab is.
tpl = tpl.replace(' active" href="/contact" data-status="active" aria-current="page"', '" href="/contact"')
tpl = tpl.replace('href="/simulator/pft-inside/"', 'href="/simulator/pft-inside/" aria-current="page" data-active="true"')
tpl = re.sub(r'href="/([^"]*)"', lambda m: 'href="https://theosishealth.com/' + m.group(1) + '"', tpl)
assert 'theosismedical' not in tpl
act = '<style>a[aria-current=page]>span:first-child{border-color:#4587c6!important;box-shadow:0 0 0 1px #4587c6,0 0 14px rgba(69,135,198,.45),2px 3px 0 0 rgb(0 0 0/.55)!important}</style>'
block = ('<div id="th-header-host" style="position:sticky;top:0;z-index:40;min-height:65px;background:rgb(20 23 28/.8)"></div>\n'
 '<!--SITE-HEADER-->\n<template id="th-site-header">' + tpl + act + '</template>\n<!--/SITE-HEADER-->\n')
js = open(sys.argv[1]).read()
script = re.search(r'<!--/SITE-HEADER-->\s*<script>(.*?)</script>', calc, re.S).group(1)
script = script.replace("if(!host||!t)return;", "if(!host||!t)return;var emb=/[?&]embed\\b/.test(location.search);try{emb=emb||window.self!==window.top}catch(e){emb=true}if(emb){host.remove();document.documentElement.classList.add('pft-embedded');return;}", 1)
block += '<script id="th-header-js">' + script + '</script>'
for root in ['public/simulator/pft-inside', '.vercel/output/static/simulator/pft-inside']:
    f = root + '/index.html'; h = open(f).read()
    h = re.sub(r'<div id="th-header-host".*?</script>', '', h, flags=re.S)
    h = re.sub(r'<header class="site-header">.*?</header>\n?', '', h, count=1)
    h = h.replace('<main class="app" id="pft-app">', block + '\n<main class="app" id="pft-app">', 1)
    open(f, 'w').write(h)
    open(root + '/assets/css/site-header.css', 'w').write(css)
    for img in ['theosis-health-header-lockup.png', 'navy-grain.jpg']:
        shutil.copy('/workspace/th-nav/public/images/' + img, root + '/assets/img/' + img)
    print('ok', f)
