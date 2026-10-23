/* v7.6.67d: the frame stays hidden (placeholder shown) until the model has booted and rendered, then fades in.
   v7.6.55 (from mockups/pft-embed.js v4): embeds the real Personal Fat Threshold model (../app/pft-inside, V31/V32)
   in its 3D view and drives it with the model's own hook window.PFTAtlas.setState(load, capacity).
   Fat levels, stage, body shape and the CT slice all come from the model engine.
   Callouts are pinned to 3D anchors: liver and pancreas = mesh bounding-box centre; belly fat around organs = the
   front-most omentum vertex; fat under the skin = a front belly vertex of the fat shell. Morph targets are applied
   (getVertexPosition), so anchors move as the body shrinks. Each frame the model renders, anchors are projected
   with the model's own camera (captured from scene.onAfterRender, which three.js calls with the active camera). A label fades when its
   anchor faces away from the camera. Drag on the figure rotates it (the model's own controls).
   Needs the model's #pftdebug hook (exposes scene/meshes/THREE) and http(s) same-origin. */
(function(){
const SRC='pft-inside/figure.html?view=3d&v=7679#pftdebug';/* v7.6.71: figure-only document; same shared engine+anatomy files as the PFT page */
const SHORT={liver:'Liver',pan:'Pancreas',vis:'Belly fat',skin:'Under skin'};
const COL={liver:'#e07070',pan:'#c792ea',vis:'#e8a84a',skin:'#e8c27a'};
// Plain-language label text. Now ('up') = what is likely happening and how it affects that organ; Later ('down') = what
// research shows reversing it tends to do. Sources per line in MISSION-PFT-NOTES.md (v4 table). Soft wording only.
const TXT={
 liver:{t:'Liver fat',up:'In people like this, fat often builds up in the liver. That can make it harder for the liver to handle sugar.',down:'Studies show when liver fat falls, the liver usually handles sugar better. It is often among the first to improve.',low:'Likely little fat in the liver at this point in the model.'},
 pan:{t:'Pancreas fat',up:'Extra fat can also reach the pancreas, which can make it harder to release insulin.',down:'Studies show pancreas fat goes down with weight loss, and insulin release can recover, more often when diabetes is newer.',low:'Likely little fat in the pancreas at this point in the model.'},
 vis:{t:'Belly fat around organs',up:'Fat that may pack around the organs. Research links more of this fat with higher blood sugar and blood fat problems.',down:'With modest weight loss, this fat tends to shrink by a bigger share than fat under the skin. Less of it is linked with lower metabolic risk.',low:'Likely little fat around the organs at this point in the model.'},
 skin:{t:'Fat under the skin',up:'Often the safer place to store fat. When it can\'t take more, extra fat tends to spill into the liver and pancreas.',down:'Shrinks too, but with modest weight loss it tends to shrink by a smaller share than fat around the organs.',low:'Often the safer place to store fat.'}};
const FIRST='What tends to change first: research shows liver fat often falls early, within the first week in one study of a very low-calorie diet, ahead of the pancreas. With modest weight loss, fat around the organs tends to shrink by a bigger share than fat under the skin.';
const CTT={liver:{up:'▲ Liver: more fat (may look lighter)',down:'▼ Liver: less fat',low:'● Liver: little fat in this example'},
 pan:{up:'▲ Pancreas: fat building up',down:'▼ Pancreas: less fat',low:'● Pancreas: little fat in this example'},
 vis:{up:'▲ Visceral fat (around organs) growing',down:'▼ Visceral fat shrinking',low:'● Visceral fat: little in this example'},
 skin:{up:'● Fat under the skin (outer ring) may be full',down:'▼ Fat under the skin thinner',low:'● Fat under the skin (outer ring)'}};
window.PFT_TXT=TXT;
// v7.6.55: superscript citation numbers for each callout line (sources: MISSION-PFT-NOTES.md v4 table)
const CITE={liver:{up:['taylor2008'],down:['lim2011']},pan:{up:['taylor2008'],down:['lim2011']},vis:{up:['chaston2008'],down:['chaston2008']},skin:{up:['taylor2015'],down:['chaston2008']}};
const cites=(ids)=>{const T=window.TheosisSources;return ids&&ids.length&&T?ids.map(id=>T.fn(id)).join('<sup class="fn-sep" aria-hidden="true">,</sup>'):''};
const cite=(k,w)=>cites((CITE[k]||{})[w]);
window.PFTEmbed=function(host,opt){
 opt=opt||{};host.classList.add('pfe');
 host.innerHTML='<div class="pfe-stage"><iframe title="Personal fat threshold 3D body model (illustration). Drag to turn it." src="'+SRC+'" scrolling="no"></iframe><svg class="pfe-ov"></svg><div class="pfe-lab"></div><div class="pfe-load" role="status"><svg class="pfe-sk" viewBox="0 0 60 150" aria-hidden="true"><circle cx="30" cy="14" r="10"/><path d="M18 30h24c5 0 8 4 8 9v38c0 3-2 5-5 5h-3v58c0 3-2 5-5 5h-4V96h-6v49h-4c-3 0-5-2-5-5V82h-3c-3 0-5-2-5-5V39c0-5 3-9 8-9z"/></svg><span class="pfe-lt">Loading 3D body model…</span></div><div class="pfe-hint">Drag to turn</div></div><p class="pfe-intro"></p><p class="pfe-meta"></p><ul class="pfe-list"></ul>';
 const fr=host.querySelector('iframe'),stage=host.querySelector('.pfe-stage'),ov=host.querySelector('.pfe-ov'),lab=host.querySelector('.pfe-lab'),meta=host.querySelector('.pfe-meta'),intro=host.querySelector('.pfe-intro'),list=host.querySelector('.pfe-list');
 let st={load:opt.load??80,capacity:opt.capacity??1,later:false,start:opt.load??80,end:opt.end??25,s:0},ready=false,cam=null,A=null,words={},t0=performance.now();const api={words};
 const W=()=>fr.contentWindow,D=()=>fr.contentDocument;
 fr.addEventListener('load',()=>{let d,w;try{d=D();w=W();if(!d||!w.document)throw 0}catch(e){api.failed=true;if(opt.onFail)opt.onFail('blocked');return}
  const s=d.createElement('style');s.textContent='html,body{background:transparent!important;overflow:hidden!important}body *{visibility:hidden!important}#ct-current{position:fixed!important;left:0!important;top:0!important;width:1100px!important;height:auto!important;max-width:none!important}#pft3d-canvas{visibility:visible!important;position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;z-index:2147483647;max-width:none!important;max-height:none!important}';d.head.appendChild(s);
  w.addEventListener('message',e=>{if(e.data&&e.data.type==='pft-set'){if(e.data.skin)skinIn(e.data.skin);if(e.data.load!=null)w.PFTAtlas.setState(e.data.load,e.data.capacity)}});
  let tries=0;const wait=()=>{if(!w.__pft3d){if(++tries>300){api.failed=true;if(opt.onFail)opt.onFail('timeout');return}return setTimeout(wait,100)}try{boot()}catch(e){api.failed=true;if(opt.onFail)opt.onFail('boot')}};wait();});
 function skinIn(hex){try{const w=W();if(!w||!w.__pft3d||!hex)return false;w.__pft3d.meshes.forEach(m=>{if(m.userData.role==='skin'&&m.material&&m.material.color)m.material.color.set(hex)});st.skin=hex;host.dataset.skin=hex;if(ready)apply();return true}catch(e){return false}}
 api.setSkin=hex=>{st.skin=hex;return skinIn(hex)};
 function boot(){const w=W(),{meshes,T,scene}=w.__pft3d;
  scene.onAfterRender=(r,sc,c)=>{api.nr=(api.nr||0)+1;if(ready&&!api.shown&&api.nr>1){api.shown=true;requestAnimationFrame(()=>requestAnimationFrame(()=>{stage.classList.add('pfe-shown');const l=host.querySelector('.pfe-load');if(l)setTimeout(()=>l.remove(),450)}))}if(c&&c.isPerspectiveCamera){cam=c;try{frame()}catch(e){api.err=String(e.stack||e)}}};
  const by=r=>meshes.find(m=>m.userData.role===r),v=new T.Vector3();
  const ctr=m=>{m.geometry.computeBoundingBox();return m.geometry.boundingBox.getCenter(new T.Vector3())};
  const pick=(m,tx,ty,tol)=>{const n=m.geometry.attributes.position.count;let best=-1,bz=-1e9;for(let i=0;i<n;i++){m.getVertexPosition(i,v);if(Math.abs(v.x-tx)<tol&&Math.abs(v.y-ty)<tol&&v.z>bz){bz=v.z;best=i}}return best};
  const fat=by('fat'),om=by('omentum'),oc=ctr(om),fc=ctr(fat);
  A={liver:{m:by('liver'),c:ctr(by('liver'))},pan:{m:by('pancreas'),c:ctr(by('pancreas'))},vis:{m:om,i:pick(om,oc.x,oc.y,400)},skin:{m:fat,i:pick(fat,oc.x+(opt.skinSide??1400),oc.y-300,250)},body:{m:fat,c:fc}};
  const d=D(),mb=d.querySelector('[data-pft3d-mode="'+(opt.mode||'cut')+'"]');if(mb)mb.click();w.PFTAtlas.setView('front');if(opt.ctSkin)opt.ctSkin(d,()=>st.skin||opt.skinColor);if(opt.skinColor||st.skin)skinIn(st.skin||opt.skinColor);api.nr=0;ready=true;if(st.muscle)api.muscle(true);if(st.grow)api.grow(st.grow);if(opt.turn)setTimeout(()=>api.rotate(opt.turn),300);api.loadMs=Math.round(performance.now()-t0);/*v7.6.67d: placeholder stays until the first frame after boot*/setTimeout(()=>{if(!api.shown){api.shown=true;stage.classList.add('pfe-shown');const l=host.querySelector('.pfe-load');if(l)l.remove()}},4000);apply();if(opt.onReady)opt.onReady(api);}
 function world(k){const a=A[k],p=new (W().__pft3d.T.Vector3)();if(a.i!=null)a.m.getVertexPosition(a.i,p);else p.copy(a.c);a.m.updateWorldMatrix(true,false);return a.m.localToWorld(p)}
 function frame(){if(!A||!cam)return;const fb=fr.getBoundingClientRect(),hb=stage.getBoundingClientRect(),Wd=stage.clientWidth,H=stage.clientHeight;
  const bc=world('body'),T3=W().__pft3d.T,fd=new T3.Vector3(0,0,1).transformDirection(A.body.m.matrixWorld),cp=cam.position,fx=fd.x,fz=fd.z,cx=cp.x-bc.x,cz=cp.z-bc.z,face=(fx*cx+fz*cz)/((Math.hypot(fx,fz)||1)*(Math.hypot(cx,cz)||1)),pts={};
  // face = how much the body's front (the model's local +z axis, fixed) faces the camera: 1 front, 0 side, -1 back
  for(const k of ['liver','pan','vis','skin']){const p=world(k),q=p.clone().project(cam);
   const a=k=='liver'||k=='pan'?Math.max(.15,Math.min(1,(face+.5)/.5)):Math.max(0,Math.min(1,(face+.15)/.45));
   pts[k]={x:fb.left-hb.left+(q.x+1)/2*fb.width,y:fb.top-hb.top+(1-q.y)/2*fb.height,a}}
  api.face=face;
  const mid=fb.left-hb.left+fb.width/2,sides={L:[],R:[]};for(const k in pts)sides[pts[k].x<mid?'L':'R'].push(k);
  let svg='',html='';for(const sd of ['L','R']){const ks=sides[sd].sort((a,b)=>pts[a].y-pts[b].y);ks.forEach((k,j)=>{const P=pts[k],y=H*(ks.length==1?.4:.18+.6*j/(ks.length-1)),x=sd=='L'?66:Wd-66,col=COL[k],ww=words[k]||'low',mk=ww=='up'?'▲ ':ww=='down'?'▼ ':'● ';
   svg+=`<g data-k="${k}" opacity="${P.a.toFixed(2)}"><polyline points="${P.x.toFixed(1)},${P.y.toFixed(1)} ${sd=='L'?x+6:x-6},${y} ${x},${y}" fill="none" stroke="${col}" stroke-width="1"/><circle cx="${P.x.toFixed(1)}" cy="${P.y.toFixed(1)}" r="3" fill="${col}" stroke="#05080d" stroke-width="1.5"/></g>`;
   html+=`<button type="button" class="pfe-t" data-k="${k}" style="${sd=='L'?'left:2px':'right:2px'};top:${y-10}px;opacity:${Math.max(.35,P.a).toFixed(2)}" aria-label="${TXT[k].t}: show explanation"><i style="background:${col}"></i>${SHORT[k]}</button>`})}
  ov.setAttribute('viewBox',`0 0 ${Wd} ${H}`);ov.innerHTML=svg;lab.innerHTML=html;api.pts=pts;}
 function apply(){if(!ready)return;const w=W();if(st.s!=null&&st.start!=null){st.load=st.start+(st.end-st.start)*st.s/100;st.later=st.s>0}
  if(w.PFTAtlas.setUserA1c&&w.PFTAtlas.userA1c()!==(st.a1c??null))w.PFTAtlas.setUserA1c(st.a1c??null);if(w.PFTAtlas.setOuter)w.PFTAtlas.setOuter(st.outer||null);w.PFTAtlas.setState(st.load,st.capacity);host.dataset.load=Math.round(st.load);
  const m=w.PFTAtlas.model(st.load,st.capacity),c=w.PFTAtlas.compartments(st.load,st.capacity);api.model=m;api.comp=c;
  const lvl={liver:c.liver,pan:c.pancreas,vis:c.visceral/0.2,skin:c.subcutaneous/0.32},dir=st.end<st.start?'down':'up';
  const c0=w.PFTAtlas.compartments(st.start??st.load,st.capacity),lv0={liver:c0.liver,pan:c0.pancreas,vis:c0.visceral/0.2,skin:c0.subcutaneous/0.32};
  // Later + losing: show the 'reversing' text for anything that was raised at the start, even once the model reads ~0
  for(const k in lvl)words[k]=st.later&&dir=='down'?(lv0[k]>0.05?'down':'low'):(lvl[k]>0.05?'up':'low');
  const mk=x=>x=='up'?'▲ ':x=='down'?'▼ ':'● ';
  list.innerHTML=['liver','pan','vis','skin'].map(k=>`<li data-k="${k}" style="border-left:3px solid ${COL[k]}"><b>${mk(words[k])}${TXT[k].t}</b><br><span>${TXT[k][words[k]]}${cite(k,words[k])}</span></li>`).join('');
  {const f=st.later&&st.end<st.start;intro.innerHTML=f?FIRST+cites(['lim2011','chaston2008']):(opt.where||'');intro.hidden=!intro.textContent;}
  meta.innerHTML=`Model: <b>${m.profileLabel}</b> · fuel ${Math.round(m.x)}/100 · stage ${m.stage} of 6${m.userA1c!=null?` · your A1c ${m.userA1c.toFixed(1)}%`:''}`;
  host.dataset.state=st.later?'later':'now';frame();if(opt.onUpdate)opt.onUpdate(api);}
 lab.addEventListener('click',e=>{const t=e.target.closest('.pfe-t');if(!t)return;list.querySelectorAll('li').forEach(li=>li.classList.toggle('hl',li.dataset.k===t.dataset.k));const li=list.querySelector('li.hl');if(li)li.scrollIntoView({block:'nearest',behavior:'smooth'})});
 api.setWhere=t=>{opt.where=t;apply()};
 // v7.6.78: Muscle view (skin, fat and organs hidden; callouts hidden) and per-group muscle growth in metres (shown exaggerated by the host)
 api.muscle=on=>{st.muscle=!!on;host.classList.toggle('pfe-muscle',st.muscle);try{const w=W();if(w&&w.PFTAtlas&&w.PFTAtlas.muscleView){w.PFTAtlas.muscleView(st.muscle);if(!st.muscle){const d=D(),mb=d.querySelector('[data-pft3d-mode="'+(opt.mode||'cut')+'"]');if(mb)mb.click()}return true}}catch(e){}return false};
 api.grow=g=>{st.grow=g;try{const w=W();if(w&&w.PFTAtlas&&w.PFTAtlas.muscleGrowth){w.PFTAtlas.muscleGrowth(g||{});return true}}catch(e){}return false};
 api.set=o=>{if(o.load!=null&&o.start==null&&o.s==null)o={...o,start:o.load,s:o.later?100:0,end:o.later?o.load:st.end};Object.assign(st,o);apply()};
 api.state=()=>({...st});api.ready=()=>ready;
 api.ctList=()=>['liver','pan','vis','skin'].map(k=>[COL[k],CTT[k][words[k]||'low'],TXT[k][words[k]||'low'],cite(k,words[k]||'low')]);
 api.ct=()=>{try{return D().getElementById('ct-current').toDataURL('image/png')}catch(e){return ''}};
 api.rotate=async(px)=>{const c=D().getElementById('pft3d-canvas'),r=c.getBoundingClientRect(),x=r.width/2,y=r.height/2,ev=(t,X)=>c.dispatchEvent(new (W().PointerEvent)(t,{bubbles:true,clientX:X,clientY:y,pointerId:1,pointerType:'mouse',button:0,buttons:t=='pointerup'?0:1,isPrimary:true}));ev('pointerdown',x);for(let i=1;i<=10;i++){ev('pointermove',x+px*i/10);await new Promise(r=>setTimeout(r,30))}ev('pointerup',x+px)};
 api.openFull=()=>{const w=window.open('pft-inside/index.html?view=3d','_blank');if(!w)return null;const go=()=>{try{if(w.PFTAtlas){w.PFTAtlas.setState(st.load,st.capacity);host.dataset.load=Math.round(st.load);return}}catch(e){}setTimeout(go,150)};go();return w};
 window.addEventListener('resize',apply);api.destroy=()=>{window.removeEventListener('resize',apply);host.innerHTML=''};return api};
})();
