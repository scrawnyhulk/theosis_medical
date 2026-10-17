/* V23 · rendered figure series (V22 base + per-profile masks, glycogen fill).
   Pixel-aligned Cycles renders of Theosis Medical's own procedural anatomy (MakeHuman CC0 body base; see CREDITS.md) at
   six fuel levels per threshold profile. The slider crossfades neighbouring
   frames; a profile change fades between series. Callouts stay as SVG/HTML.
   Also: "Become diabetic" / "Reverse diabetes" slider animations. */
(function(){
  "use strict";
  const $=id=>document.getElementById(id);
  const svg=$("human-svg"),range=$("fat-range"),capacity=$("capacity-select");
  if(!svg||!range||!window.PFT||!$("ps-a"))return;
  const X=[0,40,55,70,85,100];
  const PROFILE={"0.72":"lower","1":"moderate","1.1":"larger","2":"extreme"};
  const BASE="/pft/v35/assets/img/figure/";
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
  const A=$("ps-a"),B=$("ps-b"),PA=$("ps-prev-a"),PB=$("ps-prev-b"),prev=$("ps-prev"),person=$("uploaded-person");
  const size=()=>{const w=svg.getBoundingClientRect().width||600;return w*(window.devicePixelRatio||1)>730?1080:720};
  const url=(p,x,s)=>BASE+p+"-"+x+"-"+s+".webp";
  const cache=new Map();
  function want(u){
    if(!cache.has(u)){const im=new Image();im.decoding="async";im.src=u;cache.set(u,(im.decode?im.decode():new Promise((r,j)=>{im.onload=r;im.onerror=j})).then(()=>u,()=>u))}
    return cache.get(u);
  }
  let cur={p:null,a:null,b:null,t:0},token=0,fadeTimer=0,prefetched={};
  function setHref(el,u){if(el.getAttribute("href")!==u)el.setAttribute("href",u)}
  function show(x,p){
    const s=size();
    let i=0;while(i<X.length-2&&x>X[i+1])i++;
    const t=Math.max(0,Math.min(1,(x-X[i])/(X[i+1]-X[i])));
    const ua=url(p,X[i],s),ub=url(p,X[i+1],s),my=++token;
    const swapProfile=cur.p&&cur.p!==p;
    Promise.all([want(ua),want(ub)]).then(()=>{
      if(my!==token)return;
      if(swapProfile&&!reduce.matches){
        setHref(PA,A.getAttribute("href"));setHref(PB,B.getAttribute("href")||A.getAttribute("href"));PB.setAttribute("opacity",B.getAttribute("opacity")||"0");
        prev.style.transition="none";prev.setAttribute("opacity","1");prev.style.opacity="1";
        clearTimeout(fadeTimer);
        requestAnimationFrame(()=>{prev.style.transition="opacity .7s ease";prev.style.opacity="0";fadeTimer=setTimeout(()=>prev.setAttribute("opacity","0"),760)});
      }
      setHref(A,ua);setHref(B,ub);B.setAttribute("opacity",t.toFixed(3));setHref(person,t<.5?ua:ub);
      cur={p,a:ua,b:ub,t};
      svg.dataset.figureFrame=p+":"+X[i]+"-"+X[i+1]+"@"+t.toFixed(2);
      if(!prefetched[p+s]){prefetched[p+s]=1;idle(()=>X.forEach(v=>want(url(p,v,s))))}
    });
  }
  const idle=f=>(window.requestIdleCallback?requestIdleCallback(f,{timeout:2500}):setTimeout(f,1200));
  /* V23: per-profile masks (skin silhouette for the vessel clip, visible
     muscle for the glycogen overlay) and the glycogen fill driver. */
  const vMaskImg=document.querySelector("#vessel-mask-v23 image"),gMaskImg=document.querySelector("#gly-muscle-mask-v23 .gm-base"),gArmImgs=document.querySelectorAll("#gly-muscle-mask-v23 .gm-arm");
  const gm=$("muscle-glycogen-fill"),gl=$("liver-glycogen-fill"),legend=$("gly-legend");
  let maskProfile=null;
  function glycogen(m,p){
    if(p!==maskProfile){maskProfile=p;vMaskImg&&vMaskImg.setAttribute("href",BASE+"mask-body-"+p+".webp");gMaskImg&&gMaskImg.setAttribute("href",BASE+"mask-muscle-"+p+".webp");gArmImgs.forEach(function(im){im.setAttribute("href",BASE+"mask-muscle-"+p+"-arm-"+im.getAttribute("data-side")+".webp")})}
    if(!m)return;
    const k=v=>Math.max(0,Math.min(1,(v-.25)/.75));
    // After the prelude glycogen stays stocked; the muscle tint fades as fat
    // covers the muscle so it never reads as fat colour.
    const cover=1-.6*Math.max(0,Math.min(1,(m.surfaceVolume||0)));
    // V29: in Extreme the thick fat layer is already opaque over most muscle, so the
    // resting tint is a faint hint (no flat teal sheet); glycogen-phase teal unchanged.
    const rest=p==="extreme"?.40*(.38-.2*Math.max(0,Math.min(1,(m.surfaceVolume||0)))):.40*cover;
    const om=m.glycogenPhase?.30+.62*k(m.glycogenMuscle):rest,ol=m.glycogenPhase?.32+.62*k(m.glycogenLiver):.48;
    gm&&gm.setAttribute("opacity",om.toFixed(3));gl&&gl.setAttribute("opacity",ol.toFixed(3));
    svg.dataset.glycogen=om.toFixed(2)+"/"+ol.toFixed(2);
    legend&&legend.classList.toggle("active",!!m.glycogenPhase);
  }
  document.addEventListener("pft:render",e=>{
    const m=e.detail&&e.detail.model;const x=m&&typeof m.x==="number"?m.x:Number(range.value);
    glycogen(m,PROFILE[String(Number(capacity.value))]||"moderate");
    show(x,PROFILE[String(Number(capacity.value))]||"moderate");
  });
  show(Number(range.value)||0,PROFILE[String(Number(capacity.value))]||"moderate");
  window.addEventListener("resize",()=>{clearTimeout(show.r);show.r=setTimeout(()=>show(Number(range.value)||0,PROFILE[String(Number(capacity.value))]||"moderate"),250)});

  const credit=$("art-credit");
  if(credit)credit.textContent="2D figure: Blender Cycles renders of our own procedurally modelled anatomy on a MakeHuman CC0 body base (see CREDITS.md), one pixel-aligned frame per fuel level. Organ fat changes are illustrative; the figure is male only because the body base is a single male body.";
  /* ---- Become diabetic / Reverse diabetes ---- */
  let anim=0;
  function stop(){cancelAnimationFrame(anim);anim=0;["become-diabetic","reverse-diabetes"].forEach(id=>$(id)&&$(id).setAttribute("aria-pressed","false"))}
  function animateTo(target,ms,btn){
    stop();const from=Number(range.value);
    const set=v=>{range.value=String(Math.round(v));window.PFT.render(true)};
    if(reduce.matches||from===target){set(target);return}
    btn&&btn.setAttribute("aria-pressed","true");
    const dur=ms*Math.abs(target-from)/100+300,t0=performance.now();
    const step=now=>{const k=Math.min(1,(now-t0)/dur),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;set(from+(target-from)*e);if(k<1)anim=requestAnimationFrame(step);else stop()};
    anim=requestAnimationFrame(step);
  }
  ["pointerdown","keydown"].forEach(ev=>range.addEventListener(ev,stop));
  if($("become-diabetic"))$("become-diabetic").addEventListener("click",function(){animateTo(100,4200,this)});
  // V33: Reverse diabetes is handled in pft.js (liver -> pancreas -> other depots playback)
})();
