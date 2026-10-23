/* V27 · Estimated average glucose meter beside "In the bloodstream".
   Converts the same illustrative HbA1c the section shows into estimated average glucose with the
   ADAG equation (Nathan et al., Diabetes Care 2008): eAG (mg/dL) = 28.7 × HbA1c − 46.7; mmol/L = mg/dL ÷ 18.
   Analog dial (green < 117 = HbA1c < 5.7 %, amber 117–139 = 5.7–6.4 %, red ≥ 140 = ≥ 6.5 %) + digital readout.
   The needle and number ease to the new value; instant with reduced motion. Listens to pft:render. */
(function(){
  "use strict";
  var box=document.getElementById("art-gauge");if(!box)return;
  var $=function(id){return document.getElementById(id)};
  var dial=$("art-gauge-dial"),needle=$("art-gauge-needle"),num=$("art-gauge-num"),unitEl=$("art-gauge-unit"),foot=$("art-gauge-foot"),sr=$("art-gauge-sr"),live=$("art-gauge-live");
  var rm=window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):{matches:false};
  var NS="http://www.w3.org/2000/svg",CX=80,CY=80,R=62,LO=60,HI=260;
  var eag=function(a1c){return 28.7*a1c-46.7};
  var PRE=eag(5.7),DM=eag(6.5); // 116.9 and 139.9 mg/dL
  var unit="mgdl";try{if(localStorage.getItem("pft-glucose-unit")==="mmol")unit="mmol"}catch(e){}
  var tgt=eag(5.2),cur=tgt,raf=0,last=0,a1c=5.2,first=true,liveT=0,lastSaid="";
  function ang(v){return -90+180*(Math.max(LO,Math.min(HI,v))-LO)/(HI-LO)}
  function pt(v,r){var t=ang(v)*Math.PI/180;return[CX+r*Math.sin(t),CY-r*Math.cos(t)]}
  function el(n,a,p){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);p.appendChild(e);return e}
  function arc(v0,v1,r){var a=pt(v0,r),b=pt(v1,r),big=ang(v1)-ang(v0)>180?1:0;return"M"+a[0].toFixed(2)+","+a[1].toFixed(2)+" A"+r+","+r+" 0 "+big+" 1 "+b[0].toFixed(2)+","+b[1].toFixed(2)}
  var bands=dial.querySelector(".gauge-bands"),ticks=dial.querySelector(".gauge-ticks"),labels=dial.querySelector(".gauge-labels");
  el("path",{d:arc(LO,HI,R),"class":"gb-track"},bands);
  el("path",{d:arc(LO,PRE,R),"class":"gb normal"},bands);
  el("path",{d:arc(PRE,DM,R),"class":"gb pre"},bands);
  el("path",{d:arc(DM,HI,R),"class":"gb dm"},bands);
  for(var v=LO;v<=HI;v+=10){var maj=(v-LO)%40===0,a=pt(v,R-6),b=pt(v,R-(maj?14:10));el("line",{x1:a[0].toFixed(2),y1:a[1].toFixed(2),x2:b[0].toFixed(2),y2:b[1].toFixed(2),"class":maj?"gt maj":"gt"},ticks)}
  [PRE,DM].forEach(function(v){var a=pt(v,R+5.5),b=pt(v,R-5.5);el("line",{x1:a[0].toFixed(2),y1:a[1].toFixed(2),x2:b[0].toFixed(2),y2:b[1].toFixed(2),"class":"gt cut"},ticks)});
  var LBL=[60,100,140,180,220,260];
  function drawLabels(){labels.textContent="";LBL.forEach(function(v){var p=pt(v,R-23),t=el("text",{x:p[0].toFixed(1),y:(p[1]+3).toFixed(1),"class":"gl"},labels);t.textContent=unit==="mmol"?fmtMmol(v/18,true):String(v)})}
  function fmtMmol(x,short){var s=(Math.round(x*10)/10).toFixed(1);return short&&/\.0$/.test(s)?s.slice(0,-2):s}
  function band(v){return v>=DM-.05?"dm":v>=PRE-.05?"pre":"normal"}
  var WORD={normal:"normal range",pre:"prediabetes range",dm:"diabetes range"};
  function txt(v){return unit==="mmol"?fmtMmol(v/18):String(Math.round(v))}
  function unitTxt(){return unit==="mmol"?"mmol/L":"mg/dL"}
  function render(){
    needle.setAttribute("transform","rotate("+ang(cur).toFixed(2)+" "+CX+" "+CY+")");
    var s=txt(cur);if(num.textContent!==s)num.textContent=s;
    var b=band(cur);if(box.dataset.band!==b)box.dataset.band=b;
  }
  function quiet(){ // static, non-live description of the target value (for browse mode)
    var b=band(tgt),s="Estimated average glucose from HbA1c "+a1c.toFixed(1)+"%: "+txt(tgt)+" "+unitTxt()+", "+WORD[b]+".";
    if(sr.textContent!==s)sr.textContent=s;
    var f="HbA1c "+a1c.toFixed(1)+"% · "+WORD[b].charAt(0).toUpperCase()+WORD[b].slice(1);if(foot.textContent!==f)foot.textContent=f;
    return s;
  }
  function announce(){ // polite, debounced: only once the value has settled, never on page load
    clearTimeout(liveT);if(first)return;
    liveT=setTimeout(function(){var s="Estimated average glucose "+txt(tgt)+" "+unitTxt()+", "+WORD[band(tgt)]+".";if(s!==lastSaid){lastSaid=s;live.textContent=s}},1400);
  }
  function loop(now){raf=0;var dt=Math.min(.25,Math.max(0,(now-(last||now))/1000));last=now;
    var d=tgt-cur;if(Math.abs(d)<.05){cur=tgt;render();return}
    var k=1-Math.exp(-dt*2.6),stepv=d*k,maxv=90*dt; // ease, but never faster than ~90 mg/dL per second
    cur+=Math.max(-maxv,Math.min(maxv,stepv));render();raf=requestAnimationFrame(loop)}
  function go(){if(rm.matches||document.hidden){cancelAnimationFrame(raf);raf=0;cur=tgt;render();return}if(!raf){last=0;raf=requestAnimationFrame(loop)}}
  function update(m){
    if(!m)return;
    // v7.6.78: only an A1c the person entered is shown (as estimated average glucose); blank = dial hidden, no invented value
    box.hidden=typeof m.userA1c!=="number";if(box.hidden)return;
    var v=eag(m.userA1c);a1c=m.userA1c;
    if(first){cur=v;tgt=v;quiet();render();lastSaid="Estimated average glucose "+txt(v)+" "+unitTxt()+", "+WORD[band(v)]+".";first=false;return}
    if(Math.abs(v-tgt)<1e-6)return;
    tgt=v;quiet();announce();go();
  }
  function setUnit(u){unit=u;try{localStorage.setItem("pft-glucose-unit",u)}catch(e){}
    box.querySelectorAll(".gauge-units button").forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.unit===u))});
    unitEl.textContent=unitTxt();drawLabels();quiet();render();
    var s="Estimated average glucose "+txt(tgt)+" "+unitTxt()+", "+WORD[band(tgt)]+".";lastSaid=s;live.textContent=s}
  box.querySelectorAll(".gauge-units button").forEach(function(b){b.addEventListener("click",function(){if(b.dataset.unit!==unit)setUnit(b.dataset.unit)})});
  box.querySelectorAll(".gauge-units button").forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.unit===unit))});
  unitEl.textContent=unitTxt();drawLabels();render(); // correct needle even before the first pft:render
  document.addEventListener("pft:render",function(e){update(e.detail&&e.detail.model)});
  document.addEventListener("visibilitychange",go);
  if(rm.addEventListener)rm.addEventListener("change",go);
  // test hook: geometry of the drawn needle (tip angle measured from the hub, 0 = straight up, clockwise +)
  function needleGeom(){var hub=dial.querySelector(".gauge-hub").getBoundingClientRect(),tip=dial.querySelector(".gn-tipmark").getBoundingClientRect(),hx=hub.x+hub.width/2,hy=hub.y+hub.height/2,dx=tip.x-hx,dy=tip.y-hy;
    return{deg:Math.atan2(dx,-dy)*180/Math.PI,len:Math.hypot(dx,dy),expect:ang(cur),scale:dial.getBoundingClientRect().width/160}}
  window.PFTGlucose={state:function(){return{a1c:a1c,target:tgt,current:cur,unit:unit,band:band(cur),display:num.textContent,animating:!!raf}},eag:eag,angle:ang,needle:needleGeom,
    showValue:function(v){cancelAnimationFrame(raf);raf=0;tgt=cur=v;render();return needleGeom()}};
})();
