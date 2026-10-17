/* V25–V28 · "In the bloodstream": a cut-open artery with blood glucose, fat (triglyceride-rich
   particles) and insulin that rise and fall with the fuel slider (listens to pft:render).
   Canvas sprites + an SVG arterial tree; pauses off-screen; static under reduced motion. */
(function(){
  "use strict";
  var sec=document.getElementById("arteries"),cv=document.getElementById("art-canvas");
  if(!sec||!cv||!cv.getContext)return;
  var ctx=cv.getContext("2d"),tree=document.getElementById("art-tree");
  var rm=window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):{matches:false};
  var clamp=function(v,a,b){return Math.max(a===undefined?0:a,Math.min(b===undefined?1:b,v))};
  var $=function(id){return document.getElementById(id)};
  // ---- state ----
  var tgt={glu:0,tg:0,ins:.25,pl:0},cur={glu:0,tg:0,ins:.25,pl:0},plPeak=0,plProfile="",plLast=0,plFalling=false,W=0,H=0,dpr=1,t=0,last=0,raf=0,onScreen=true,wall=null,spr={};
  var POOL={rbc:0,glu:96,tg:46,ins:36},parts=[];
  // V26: the vessel is shorter on laptops; particle size and counts scale with its height
  function dens(){return Math.max(.55,Math.min(1,H/236))}
  function counts(){var f=dens();return{rbc:POOL.rbc,glu:Math.round((5+91*cur.glu)*f),tg:Math.round((3+43*cur.tg)*f),ins:Math.round((3+33*cur.ins)*f)}}
  function rnd(i,k){var x=Math.sin(i*127.1+k*311.7)*43758.5453;return x-Math.floor(x)}
  function seed(){
    parts=[];POOL.rbc=Math.max(32,Math.round(W/5.2*dens()));
    ["rbc","tg","glu","ins"].forEach(function(type,k){for(var i=0;i<POOL[type];i++){
      var y=(rnd(i,k+1)*2-1)*(type==="rbc"?.86:.9);
      parts.push({type:type,i:i,x:rnd(i,k+7)*W,y:y,rot:rnd(i,k+3)*Math.PI*2,spin:(rnd(i,k+5)-.5)*1.6,s:.75+.5*rnd(i,k+9),a:0,wob:rnd(i,k+11)*6.28})}});
  }
  // ---- sprites (pre-rendered at device scale) ----
  function sprite(w,h,fn){var c=document.createElement("canvas");c.width=Math.ceil(w*dpr);c.height=Math.ceil(h*dpr);var g=c.getContext("2d");g.scale(dpr,dpr);fn(g,w,h);return c}
  function makeSprites(){
    spr.rbc=sprite(26,14,function(g){var gr=g.createRadialGradient(13,7,1,13,7,13);gr.addColorStop(0,"#7e1410");gr.addColorStop(.42,"#b52a20");gr.addColorStop(.8,"#e0574a");gr.addColorStop(1,"rgba(150,25,20,0)");
      g.fillStyle=gr;g.beginPath();g.ellipse(13,7,12,6,0,0,6.283);g.fill();g.fillStyle="rgba(255,200,190,.28)";g.beginPath();g.ellipse(10,4.6,5,1.6,-.2,0,6.283);g.fill()});
    spr.glu=sprite(16,16,function(g){g.shadowColor="rgba(120,230,255,.9)";g.shadowBlur=5;g.strokeStyle="#9ff0ff";g.lineWidth=1.8;g.beginPath();
      for(var k=0;k<6;k++){var a=Math.PI/3*k+Math.PI/6;g[k?"lineTo":"moveTo"](8+5*Math.cos(a),8+5*Math.sin(a))}g.closePath();g.stroke();g.fillStyle="rgba(150,235,255,.35)";g.fill()});
    spr.tg=sprite(22,22,function(g){var gr=g.createRadialGradient(8,8,1,11,11,10);gr.addColorStop(0,"#fff4cf");gr.addColorStop(.45,"#f6c24a");gr.addColorStop(1,"#a8620c");
      g.shadowColor="rgba(255,190,70,.55)";g.shadowBlur=4;g.fillStyle=gr;g.beginPath();g.arc(11,11,8,0,6.283);g.fill();g.shadowBlur=0;
      g.fillStyle="rgba(255,250,230,.55)";[[7,12],[12,6],[14,14],[9,16],[15,10]].forEach(function(p){g.beginPath();g.arc(p[0],p[1],.9,0,6.283);g.fill()})});
    spr.ins=sprite(14,14,function(g){g.shadowColor="rgba(200,150,255,.9)";g.shadowBlur=4;g.fillStyle="#c9a2ff";g.beginPath();g.moveTo(7,1.5);g.lineTo(12.5,7);g.lineTo(7,12.5);g.lineTo(1.5,7);g.closePath();g.fill();
      g.fillStyle="#f1e6ff";g.beginPath();g.arc(7,7,1.4,0,6.283);g.fill()});
  }
  function geo(){var band=Math.max(10,H*.085),top=band+H*.05,bot=H-band-H*.05;return{band:band,top:top,bot:bot,mid:(top+bot)/2,r:(bot-top)/2}}
  function makeWall(){
    var G=geo();wall=sprite(W,H,function(g){
      // inner back wall of the opened vessel: curved shading + longitudinal folds of the intima
      var gr=g.createLinearGradient(0,G.top,0,G.bot);gr.addColorStop(0,"#3c0b0a");gr.addColorStop(.18,"#7b211c");gr.addColorStop(.5,"#a33a30");gr.addColorStop(.82,"#7b211c");gr.addColorStop(1,"#3c0b0a");
      g.fillStyle=gr;g.fillRect(0,G.top,W,G.bot-G.top);
      g.globalAlpha=.16;g.strokeStyle="#ffb3a6";g.lineWidth=1;
      for(var k=0;k<9;k++){var yy=G.top+G.r*.25+k*(G.r*1.5/8);g.beginPath();for(var x=0;x<=W;x+=12){var y=yy+Math.sin(x*.018+k*1.7)*2.2;x?g.lineTo(x,y):g.moveTo(x,y)}g.stroke()}
      g.globalAlpha=1;
      // cut edges of the wall: adventitia (outer), media (muscle), intima (inner lining)
      function edge(y0,dir){var b=G.band;
        var a=g.createLinearGradient(0,y0,0,y0+dir*b);a.addColorStop(0,"#f0c3b2");a.addColorStop(.33,"#e2a593");a.addColorStop(.36,"#b8463b");a.addColorStop(.86,"#93302a");a.addColorStop(.9,"#f6d9cf");a.addColorStop(1,"#f6d9cf");
        g.fillStyle=a;g.fillRect(0,Math.min(y0,y0+dir*b),W,b);
        g.globalAlpha=.22;g.strokeStyle="#5a0f0c";for(var x=4;x<W;x+=7){g.beginPath();g.moveTo(x,y0+dir*b*.4);g.lineTo(x+3,y0+dir*b*.82);g.stroke()}g.globalAlpha=1}
      edge(G.top-G.band,1);edge(G.bot+G.band,-1);
      g.fillStyle="rgba(0,0,0,.35)";g.fillRect(0,G.top,W,3);g.fillRect(0,G.bot-3,W,3);
    });
  }
  // ---- V28: atherosclerotic plaque on the intima (cut edges at G.top / G.bot) ----
  // Seeds: position (fraction of W), half-width (fraction of W), onset (plaque level where it starts), size.
  // (top-left stays clear for the "Thigh artery wall" label)
  var SEEDS=[{x:.47,w:.11,on:.06,s:1.1,side:-1},{x:.72,w:.085,on:.24,s:.85,side:-1},{x:.91,w:.06,on:.42,s:.7,side:-1},
             {x:.13,w:.09,on:0,s:1,side:1},{x:.36,w:.1,on:.03,s:1,side:1},{x:.6,w:.075,on:.32,s:.8,side:1},{x:.83,w:.1,on:.14,s:.95,side:1}];
  function sm(a,b,v){var x=clamp((v-a)/(b-a));return x*x*(3-2*x)}
  function bell(u){if(u<=-1||u>=1)return 0;var c=Math.cos(u*Math.PI/2);return c*c}
  // irregular, slightly lopsided plaque profile (deterministic per seed)
  function prof(i,u){if(u<=-1||u>=1)return 0;var sk=(rnd(i,90)-.5)*.7,v=u+sk*(1-u*u)*.5;
    return bell(v)*(1+.13*Math.sin(u*5.3+i*1.7)+.07*Math.sin(u*11.1+i*2.9))}
  function seedState(sd,pl){return{streak:sm(sd.on,sd.on+.16,pl),raise:sm(sd.on+.12,Math.min(1,sd.on+.72),pl)}}
  function plaqueH(sd,pl,G){return G.r*.36*sd.s*seedState(sd,pl).raise} // max ≈ 36 % of the radius: mild-moderate narrowing
  var lumT=null,lumB=null,lumKey="",NO=[0,0],LM=[0,0];
  function lumenAt(x,G){ // cached per-pixel lookup, rebuilt only when the plaque level or size changes
    var key=W+"|"+H+"|"+Math.round(cur.pl*120);if(cur.pl<.01)return NO;
    if(key!==lumKey){lumKey=key;var n=Math.ceil(W)+2;lumT=new Float32Array(n);lumB=new Float32Array(n);for(var xi=0;xi<n;xi++){var r=lumenCalc(xi,G);lumT[xi]=r[0];lumB[xi]=r[1]}}
    var j=Math.max(0,Math.min(lumT.length-1,Math.round(x)));LM[0]=lumT[j];LM[1]=lumB[j];return LM}
  function lumenCalc(x,G){ // plaque intrusion (px) from the top and bottom wall at x
    var top=0,bot=0,pl=cur.pl;if(pl<.01)return[0,0];
    for(var i=0;i<SEEDS.length;i++){var sd=SEEDS[i],u=(x-sd.x*W)/(sd.w*W);if(u<=-1||u>=1)continue;var h=plaqueH(sd,pl,G)*prof(i,u);if(sd.side<0)top=Math.max(top,h);else bot=Math.max(bot,h)}
    return[top,bot]}
  var layers={key:""};
  function plaqueLayers(G){ // static plaque artwork cached in two device-scale layers
    var key=W+"|"+H+"|"+dpr+"|"+Math.round(cur.pl*120);if(layers.key===key)return layers;
    layers.key=key;var keep=ctx;
    layers.back=sprite(W,H,function(g){ctx=g;drawStreaks(G)});
    layers.front=sprite(W,H,function(g){ctx=g;drawPlaques(G,true)});
    ctx=keep;return layers}
  function drawStreaks(G){ // early fatty streaks: yellow streaks + foam-cell speckles along the intima and on the opened back wall
    var pl=cur.pl;if(pl<.01)return;
    for(var i=0;i<SEEDS.length;i++){var sd=SEEDS[i],st=seedState(sd,pl).streak;if(st<.02)continue;
      var cx=sd.x*W,hw=sd.w*W*.95,y0=sd.side<0?G.top:G.bot,dir=-sd.side;
      ctx.globalAlpha=.75*st;ctx.fillStyle="#e9c25a";ctx.beginPath();ctx.ellipse(cx,y0+dir*1.5,hw,2.2,0,0,6.283);ctx.fill();
      // streaks on the back wall (longitudinal, near this edge)
      ctx.globalAlpha=.32*st;ctx.fillStyle="#f0cf6e";
      for(var k=0;k<3;k++){var yy=y0+dir*G.r*(.18+.13*k),xx=cx+(rnd(i,k+20)-.5)*hw*.8;ctx.beginPath();ctx.ellipse(xx,yy,hw*(.35+.25*rnd(i,k+21)),1.1+.8*rnd(i,k+22),0,0,6.283);ctx.fill()}
      ctx.globalAlpha=.8*st;ctx.fillStyle="#fff1c4";
      var n=Math.round(5+7*sd.s);for(var k2=0;k2<n;k2++){var sx=cx+(rnd(i,k2+40)*2-1)*hw*.85,sy=y0+dir*(1+rnd(i,k2+41)*3.2);ctx.beginPath();ctx.arc(sx,sy,.7+.6*rnd(i,k2+42),0,6.283);ctx.fill()}}
    ctx.globalAlpha=1}
  function drawPlaques(G,staticOnly){ // raised plaques: lipid core under a whitish fibrous cap, bulging into the lumen; particles slipping into the wall
    var pl=cur.pl;if(pl<.01)return;
    for(var i=0;i<SEEDS.length;i++){var sd=SEEDS[i],ss=seedState(sd,pl),h=plaqueH(sd,pl,G);
      var cx=sd.x*W,hw=sd.w*W,y0=sd.side<0?G.top:G.bot,dir=-sd.side,N=24;
      if(staticOnly&&h>.6){
        // thickened intima inside the cut wall
        // whole plaque (fibrous tissue), then the yellow lipid core inside it
        ctx.beginPath();ctx.moveTo(cx-hw,y0);for(var k=0;k<=N;k++){var u=-1+2*k/N;ctx.lineTo(cx+u*hw,y0+dir*h*prof(i,u))}ctx.closePath();
        var g=ctx.createLinearGradient(0,y0,0,y0+dir*h);g.addColorStop(0,"#d9b26a");g.addColorStop(.6,"#ecd7a6");g.addColorStop(1,"#f6ecd6");
        ctx.fillStyle=g;ctx.fill();
        ctx.beginPath();ctx.moveTo(cx-hw*.72,y0);for(var kc=0;kc<=N;kc++){var uc=-1+2*kc/N;ctx.lineTo(cx+uc*hw*.72,y0+dir*h*.68*prof(i,uc*.9))}ctx.closePath();
        var gc=ctx.createLinearGradient(0,y0,0,y0+dir*h*.68);gc.addColorStop(0,"#b9771f");gc.addColorStop(.5,"#e2a93c");gc.addColorStop(1,"#f0c962");
        ctx.globalAlpha=.9;ctx.fillStyle=gc;ctx.fill();ctx.globalAlpha=1;
        // fibrous cap
        ctx.beginPath();for(var k3=0;k3<=N;k3++){var u3=-1+2*k3/N,yy=y0+dir*h*prof(i,u3);k3?ctx.lineTo(cx+u3*hw,yy):ctx.moveTo(cx+u3*hw,yy)}
        ctx.lineWidth=Math.max(1.2,Math.min(3,h*.16));ctx.strokeStyle="rgba(250,244,230,.92)";ctx.stroke();
        ctx.lineWidth=1;ctx.strokeStyle="rgba(120,60,20,.35)";ctx.stroke();
        // foam cells / lipid droplets in the core
        ctx.fillStyle="rgba(255,248,220,.75)";var n=Math.round(4+9*sd.s*ss.raise);
        for(var k4=0;k4<n;k4++){var u4=(rnd(i,k4+60)*2-1)*.7,hh=h*.68*prof(i,u4)*(.15+.7*rnd(i,k4+61));ctx.beginPath();ctx.arc(cx+u4*hw,y0+dir*hh,.8+.9*rnd(i,k4+62),0,6.283);ctx.fill()}}
      // LDL / remnant-like particles slipping into the wall at active sites
      if(!staticOnly&&ss.streak>.3&&spr.tg){var cyc=rm.matches?.55:((t*.28+rnd(i,70))%1),a=Math.sin(cyc*Math.PI);
        var ex=cx+(rnd(i,71)-.5)*hw*.9,ey=y0+dir*(h*prof(i,(ex-cx)/hw)+8)*(1-cyc)-dir*G.band*.35*cyc,sz=9*(1-.45*cyc)*(.35+.65*dens());
        ctx.globalAlpha=.85*a*Math.min(1,ss.streak);ctx.drawImage(spr.tg,ex-sz/2,ey-sz/2,sz,sz)}}
    ctx.globalAlpha=1}
  function resize(){
    var r=cv.getBoundingClientRect();if(!r.width||!r.height)return;dpr=Math.min(2,window.devicePixelRatio||1);
    if(Math.abs(r.width-W)<.5&&Math.abs(r.height-H)<.5&&cv.width===Math.round(r.width*dpr))return;
    W=r.width;H=r.height;cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
    makeSprites();makeWall();seed();if(rm.matches){cur.glu=tgt.glu;cur.tg=tgt.tg;cur.ins=tgt.ins;cur.pl=tgt.pl}settle();draw();
  }
  function settle(){var c=counts();parts.forEach(function(p){p.a=p.i<c[p.type]?1:0})}
  function pulse(t){var s=Math.max(0,Math.sin(t*2*Math.PI*1.15));return .72+.5*s*s*s}
  function step(dt){
    var k=1-Math.exp(-dt*2.4);cur.glu+=(tgt.glu-cur.glu)*k;cur.tg+=(tgt.tg-cur.tg)*k;cur.ins+=(tgt.ins-cur.ins)*k;cur.pl+=(tgt.pl-cur.pl)*(1-Math.exp(-dt*1.3));
    var c=counts(),G=geo(),vmax=Math.max(70,W*.42)*pulse(t);
    parts.forEach(function(p){
      var want=p.i<c[p.type]?1:0;p.a+=(want-p.a)*Math.min(1,dt*2.6);
      var lam=1-p.y*p.y; // laminar (parabolic) flow: fastest in the centre
      p.x+=vmax*(.18+.82*lam)*(p.type==="rbc"?1:1.04)*dt;p.rot+=p.spin*dt;
      if(p.x>W+20){p.x=-20-rnd(p.i,t)*30;}
    });
  }
  function draw(){
    if(!W)return;var G=geo();ctx.clearRect(0,0,W,H);ctx.drawImage(wall,0,0,W,H);
    // plasma: straw tint, turning milky as triglyceride-rich particles rise (lipaemia)
    ctx.fillStyle="rgba(255,214,150,"+(.05+.08*cur.tg).toFixed(3)+")";ctx.fillRect(0,G.top,W,G.bot-G.top);
    if(cur.tg>.02){ctx.fillStyle="rgba(255,244,226,"+(.4*Math.pow(cur.tg,1.2)).toFixed(3)+")";ctx.fillRect(0,G.top,W,G.bot-G.top)}
    var PL=cur.pl>=.01?plaqueLayers(G):null;if(PL)ctx.drawImage(PL.back,0,0,W,H);
    var order=["rbc","tg","glu","ins"],sz={rbc:[30,15],tg:[17,17],glu:[13,13],ins:[11,11]};
    for(var o=0;o<4;o++){var type=order[o],im=spr[type],d=sz[type];
      for(var i=0;i<parts.length;i++){var p=parts[i];if(p.type!==type||p.a<.02)continue;
        var sc=.35+.65*dens(),lm=lumenAt(p.x,G),y=(G.top+lm[0]+G.bot-lm[1])/2+p.y*((G.bot-lm[1])-(G.top+lm[0]))/2*.92+Math.sin(t*1.3+p.wob)*1.2,w=d[0]*p.s*sc,h=d[1]*p.s*sc;
        ctx.globalAlpha=p.a*(type==="rbc"?.8:1);
        if(type==="rbc"||type==="ins"){ctx.save();ctx.translate(p.x,y);ctx.rotate(type==="rbc"?Math.sin(p.rot)*.5:p.rot);ctx.drawImage(im,-w/2,-h/2,w,h);ctx.restore()}
        else ctx.drawImage(im,p.x-w/2,y-h/2,w,h)}}
    ctx.globalAlpha=1;
    if(PL){ctx.drawImage(PL.front,0,0,W,H);drawPlaques(G,false)}
    // soft lens vignette
    var vg=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*.35,W/2,H/2,Math.max(W,H)*.75);vg.addColorStop(0,"rgba(5,10,16,0)");vg.addColorStop(1,"rgba(5,10,16,.55)");ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  }
  function loop(now){raf=0;var dt=Math.min(.05,(now-(last||now))/1000);last=now;t+=dt;step(dt);draw();if(running())raf=requestAnimationFrame(loop)}
  function running(){return onScreen&&!rm.matches&&!document.hidden&&sec.getAttribute("data-collapsed")!=="true"}
  function kick(){if(running()){if(!raf){last=0;raf=requestAnimationFrame(loop)}}else{cur.glu=tgt.glu;cur.tg=tgt.tg;cur.ins=tgt.ins;cur.pl=tgt.pl;settle();draw()}}
  // ---- model -> levels, words, meters ----
  var lastKey="";
  function update(m){
    if(!m)return;
    var glu=m.profile==="extreme"?clamp(m.glucose*3):clamp((m.a1c-5.2)/(10.1-5.2));
    var tg=clamp(m.lipids);
    // V26: insulin rises monotonically with the slider (compensatory hyperinsulinaemia) and is
    // maxed out in the type 2 diabetes range: high but ineffective, because fat cells, liver and
    // muscle are full past the personal fat threshold (Taylor twin-cycle: prolonged hyperinsulinaemia;
    // beta-cell output declines only late, mentioned as a note).
    var early=clamp(m.fatLoad/60),mp=clamp((m.muscle-.03)/.97),lp=clamp((m.liver-.02)/.98),pp=clamp((m.pancreas-.02)/.98);
    var ins=m.profile==="extreme"?clamp(.18+.1*early+.3*(m.hyperplasia||0)):clamp(.18+.1*early+.3*mp+.22*lp+.2*pp);
    // rising glucose drives insulin up smoothly into the "very high" range by the diabetes cutoff
    if(m.profile!=="extreme")ins=Math.max(ins,.92*clamp((m.a1c-5.3)/1.2));
    if(m.glycemicState==="diabetes")ins=Math.max(ins,.9);
    tgt.glu=glu;tgt.tg=tg;tgt.ins=ins;
    // V28: plaque. Cholesterol-carrying particles (LDL, triglyceride-rich remnants) drive it; high glucose and
    // insulin resistance make it worse. Starts from the prediabetes range, strongest in the diabetes range.
    var g=clamp((m.a1c-5.6)/1.6),lf=clamp(m.lipids/.65);
    var pl=m.profile==="extreme"?.12*sm(40,100,m.x):clamp(g*(.55+.45*lf)*1.15);
    // V30: plaque is a pure function of the current slider/profile state, so it shrinks back to a smooth wall
    // exactly as it grew. Direction is tracked only to word the label/caption while it is shrinking.
    if(m.profile!==plProfile){plProfile=m.profile;plPeak=0;plFalling=false;plLast=pl;cur.pl=Math.min(cur.pl,pl)}
    if(pl<plLast-1e-4)plFalling=true;else if(pl>plLast+1e-4)plFalling=false;
    plLast=pl;plPeak=Math.max(plPeak,pl);if(pl<.01)plPeak=0;
    var plT=pl,regress=plFalling&&plPeak>.08&&pl>=.03;tgt.pl=plT;
    var gw=m.glycemicState==="diabetes"?"Diabetes range":m.glycemicState==="prediabetes"?"Prediabetes range":"Normal range";
    var tw=tg<.06?"Normal":tg<.35?"Rising":"High";
    var dm=m.glycemicState==="diabetes",pre=m.glycemicState==="prediabetes";
    var iv=dm||ins>=.9?"Very high":pre||ins>=.6?"High":ins>=.23?"Raised":"Normal";
    var iw=dm?"Not working well":pre?"Less effective":ins>=.6?"Working hard":ins>=.23?"Working harder":"Keeping up";
    set("art-glu-val","HbA1c "+m.a1c.toFixed(1)+"%");set("art-glu-word",gw);set("art-tg-val",tw==="Normal"?"Low":tw);set("art-tg-word",tg<.06?"Normal":tg<.35?"More fat circulating":"Milky plasma");
    set("art-ins-val",iv);set("art-ins-word",iw);
    lvl("glu",.1+.9*glu);lvl("tg",.08+.92*tg);lvl("ins",.12+.88*ins);
    sec.style.setProperty("--glu",(.08+.92*glu).toFixed(3));sec.style.setProperty("--tg",(.05+.95*tg).toFixed(3));
    sec.dataset.state=m.glycemicState;sec.dataset.profile=m.profile;
    var key=m.profile==="extreme"&&m.fatLoad>=5?"ext":dm?"dm":regress?"reg":pre?"pre":(mp>.12||lp>.05)?"ir":(tg>.06||early>.2)?"fat":"norm";
    var cap={norm:"Normal circulation. After meals, glucose and fat pass through the arteries into fat cells, liver and muscle. A normal amount of insulin moves them in.",
      fat:"Fats rising. Storage under the skin is filling, so a little more fat circulates. The pancreas makes more insulin, and glucose stays normal.",
      ir:"Insulin rising. Muscle and liver are filling with fat and respond less to insulin, so the pancreas pumps out more to keep glucose normal.",
      pre:"Past the personal fat threshold. Fat cells, liver and muscle are nearly full, so even high insulin can’t push enough fuel in. Glucose starts to stay up (prediabetes range).",
      dm:"Type 2 diabetes range. Insulin is very high but not working well: fat cells, liver and muscle are full past the personal fat threshold, so there is no room to push more fuel in. Glucose and fats stay high.",
      reg:"Plaque shrinking as glucose and fats come down. (In real arteries plaque usually shrinks only partly; this model shows the trend.)",
      ext:"Hyperplasia: new fat cells under the skin keep making room for fuel, so glucose stays normal, fats rise only a little and insulin is only moderately raised."}[key];
    set("art-note","Illustrative levels from the same teaching model as the slider, not lab values."+(dm?" Years later, an overworked pancreas can make less insulin.":""));
    if(key!==lastKey){lastKey=key;set("art-caption",cap)}
    var pw=plT<.03?"smooth":regress?"plaque shrinking":plT<.3?"fatty streaks":plT<.7?"plaques forming":"plaques narrowing it";
    set("art-lens-cap","Thigh artery wall: "+pw);sec.dataset.plaque=plT<.03?"none":regress?"regressing":plT<.3?"streaks":plT<.7?"plaque":"advanced";
    var pn=plT<.03?"":regress?" Plaque is shrinking as glucose and fats come down. In real arteries plaque usually shrinks only partly.":plT<.3?" Fatty streaks are starting in the artery wall.":plT<.7?" Fat and cholesterol are building yellow plaques in the artery wall.":" Plaques are bulging into the artery and narrowing it.";
    cv.setAttribute("aria-label","Cut-open artery close-up. Glucose: "+gw.toLowerCase()+" (HbA1c "+m.a1c.toFixed(1)+"%). Fats: "+tw.toLowerCase()+". Insulin: "+iv.toLowerCase()+", "+iw.toLowerCase()+"."+pn);
    kick();
  }
  function set(id,v){var e=$(id);if(e&&e.textContent!==v)e.textContent=v}
  function lvl(k,v){var e=sec.querySelector('.art-vial[data-k="'+k+'"]');if(e)e.style.setProperty("--lvl",v.toFixed(3))}
  document.addEventListener("pft:render",function(e){update(e.detail&&e.detail.model)});
  // collapse
  var tg=$("art-toggle");if(tg)tg.addEventListener("click",function(){var open=tg.getAttribute("aria-expanded")!=="true";tg.setAttribute("aria-expanded",String(open));tg.textContent=open?"Hide":"Show";
    sec.setAttribute("data-collapsed",String(!open));$("art-body").hidden=!open;if(open){W=0;resize()}kick()});
  if(window.IntersectionObserver)new IntersectionObserver(function(es){onScreen=es[0].isIntersecting;kick()},{rootMargin:"80px"}).observe(cv);
  document.addEventListener("visibilitychange",kick);
  if(rm.addEventListener)rm.addEventListener("change",function(){sec.classList.toggle("art-still",rm.matches);kick()});
  sec.classList.toggle("art-still",rm.matches);
  if(window.ResizeObserver)new ResizeObserver(function(){resize();kick()}).observe(cv);else window.addEventListener("resize",function(){resize();kick()});
  resize();
  window.PFTArteries={levels:function(){return{target:Object.assign({},tgt),current:Object.assign({},cur),plaquePeak:plPeak,plaque:sec.dataset.plaque,particles:counts(),running:!!raf}}};
})();
