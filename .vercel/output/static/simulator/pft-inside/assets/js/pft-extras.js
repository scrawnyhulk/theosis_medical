/* V21 extras: config-driven art/3D, mobile dock, guided story, remission note,
   guide buttons and the waist-to-height calculator. No data leaves the page. */
(function(){
  "use strict";
  const $=id=>document.getElementById(id);
  const cfg=window.PFT_CONFIG||{};
  const range=$("fat-range"),capacity=$("capacity-select");
  const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)");
  if(!range||!window.PFT)return;

  /* ---- original artwork, when Nick restores it (see pft-config.js) ---- */
  const art=cfg.art||{};
  [["uploaded-person",art.figure],["heart-source",art.heart],["adipose-source",art.adipose]].forEach(([id,src])=>{if(src&&$(id))$(id).setAttribute("href",src)});
  if(!art.figure&&$("art-credit"))$("art-credit").textContent="The 2D figure, heart and fat-tissue artwork in this build are illustrative stand-ins drawn for the web version.";

  /* ---- 3D toggle appears only when the model files are configured ---- */
  const models=cfg.models||{};
  if(models.skin&&models.organs&&$("renderer-toggle"))$("renderer-toggle").hidden=false;

  /* ---- shared state from each render ---- */
  let last=null,maxDiabetes=false,remissionDismissed=false;
  const setValue=v=>{range.value=String(Math.max(0,Math.min(100,Math.round(v))));window.PFT.render(true)};
  let anim=0;
  function animateTo(target,ms){
    cancelAnimationFrame(anim);
    const from=Number(range.value);target=Math.max(0,Math.min(100,target));
    if(reduceMotion.matches||!ms||from===target){setValue(target);return Promise.resolve()}
    return new Promise(resolve=>{
      const t0=performance.now();
      const step=now=>{const t=Math.min(1,(now-t0)/ms),e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;setValue(from+(target-from)*e);if(t<1)anim=requestAnimationFrame(step);else resolve()};
      anim=requestAnimationFrame(step);
    });
  }
  // Any manual input cancels an animation in progress.
  ["pointerdown","keydown"].forEach(ev=>range.addEventListener(ev,()=>cancelAnimationFrame(anim)));

  /* ---- mobile dock: move the one real slider into a horizontal host ---- */
  const dockHost=$("dock-range-host"),homeParent=range.parentElement,homeNext=range.nextSibling;
  const mobile=window.matchMedia("(max-width: 900px)");
  const dockTicks=[];
  if(dockHost){
    window.PFT.tickNames.forEach((name,i)=>{const s=document.createElement("span");s.textContent=String(i+1);s.title=name;$("dock-ticks").appendChild(s);dockTicks.push(s)});
  }
  function placeSlider(){
    if(!dockHost)return;
    if(mobile.matches){if(range.parentElement!==dockHost)dockHost.appendChild(range);range.setAttribute("aria-orientation","horizontal");$("range-help").textContent="Drag or use ← / → · Illustrative scale"}
    else{if(range.parentElement!==homeParent)homeParent.insertBefore(range,homeNext);range.setAttribute("aria-orientation","vertical");$("range-help").textContent="Drag or use ↑ / ↓ · Illustrative scale"}
  }
  (mobile.addEventListener?mobile.addEventListener("change",placeSlider):mobile.addListener(placeSlider));
  placeSlider();

  const syncCards=()=>document.body.classList.toggle("card-on",!$("story-panel").hidden||!$("remission-note").hidden);
  /* ---- guided story (moderate threshold) ---- */
  const stops=[
    {x:12,title:"Fuel tanks fill first",text:"After a meal, the liver and muscles refill their glycogen, the body’s carbohydrate store. Full glycogen stores are normal and harmless.",cite:"Teaching sequence; glycogen and fat storage overlap in real life."},
    {x:30,title:"Fat goes under the skin",text:"Extra energy is stored as fat under the skin, the body’s safest storage depot. How much it can hold before spilling over is personal: that limit is the personal fat threshold.",cite:"Taylor & Holman, Clin Sci 2015."},
    {x:46,title:"Muscle stops listening to insulin",text:"Early on, muscle becomes resistant to insulin and stores less glucose after meals. In young, lean, insulin-resistant adults, muscle stored about 60% less glycogen while the liver made more than twice as much new fat. Glucose still looks normal because the pancreas makes more insulin.",cite:"Petersen et al., PNAS 2007 · Taylor, Diabetologia 2008."},
    {x:80,title:"Liver, then pancreas",text:"High insulin drives fat into the liver, which then resists insulin and releases more glucose. The liver exports fat that reaches the pancreas, where it impairs the beta cells. When they can no longer keep up, glucose and A1c rise.",cite:"Twin-cycle hypothesis: Taylor, Diabetologia 2008."},
    {x:100,back:34,title:"The path can run in reverse",text:"Losing fat empties the liver first, then the pancreas. In DiRECT, 46% of people were in remission at 12 months and 36% at 24 months. In ReTUNE, 70% of people with a BMI under 27 reached remission after losing about 6.5% of their weight. Remission is more likely when diabetes is caught early.",cite:"Lim et al., Diabetologia 2011 · Lean et al., Lancet 2018 & 2019 · Taylor et al., Clin Sci 2023."}
  ];
  let storyIndex=-1,storyToken=0;
  const panel=$("story-panel"),startBtn=$("story-start");
  function showStop(i){
    storyIndex=i;const s=stops[i],token=++storyToken;
    $("story-step").textContent="Stop "+(i+1)+" of "+stops.length;
    $("story-title").textContent=s.title;$("story-text").textContent=s.text;$("story-cite").textContent=s.cite;
    panel.querySelectorAll(".story-progress i").forEach((el,k)=>{el.className=k<i?"done":k===i?"on":""});
    $("story-prev").disabled=i===0;$("story-next").textContent=i===stops.length-1?"Finish":"Next";
    if(capacity.value!=="1"){capacity.value="1";capacity.dispatchEvent(new Event("change"))}
    const go=animateTo(s.x,1300);
    if(s.back!==undefined)go.then(()=>new Promise(r=>setTimeout(r,reduceMotion.matches?0:900))).then(()=>{if(token===storyToken)return animateTo(s.back,2200)});
  }
  function startStory(){remissionDismissed=true;$("remission-note").hidden=true;panel.hidden=false;document.body.classList.add("story-on");startBtn.setAttribute("aria-expanded","true");syncCards();showStop(0);$("story-title").setAttribute("tabindex","-1");$("story-title").focus({preventScroll:true})}
  function endStory(){storyToken++;cancelAnimationFrame(anim);panel.hidden=true;document.body.classList.remove("story-on");startBtn.setAttribute("aria-expanded","false");storyIndex=-1;remissionDismissed=false;syncCards();startBtn.focus({preventScroll:true})}
  if(startBtn){
    startBtn.addEventListener("click",()=>panel.hidden?startStory():endStory());
    $("story-next").addEventListener("click",()=>storyIndex>=stops.length-1?endStory():showStop(storyIndex+1));
    $("story-prev").addEventListener("click",()=>storyIndex>0&&showStop(storyIndex-1));
    $("story-exit").addEventListener("click",endStory);
    panel.addEventListener("keydown",e=>{if(e.key==="Escape")endStory()});
  }

  /* ---- remission note: appears when moving back down from the diabetes range ---- */
  const note=$("remission-note");
  $("remission-close").addEventListener("click",()=>{note.hidden=true;remissionDismissed=true;syncCards()});
  function maybeShowRemission(m){
    if(m.diabetes)maxDiabetes=true;
    if(storyIndex>=0)return;
    if(maxDiabetes&&!m.diabetes&&!remissionDismissed)note.hidden=false;
    if(!maxDiabetes)note.hidden=true;
    syncCards();
  }

  /* ---- guide buttons step to the next / previous stage marker ---- */
  function nextMark(dir){
    const m=last&&last.model;if(!m)return 0;
    const pts=[0,12].concat(m.marks.filter(v=>v<=100),[last.diabetesOnset<=100?last.diabetesOnset:100,100]).sort((a,b)=>a-b);
    const x=m.x;
    if(dir>0){for(const p of pts)if(p>x+.5)return Math.ceil(p);return 100}
    for(let i=pts.length-1;i>=0;i--)if(pts[i]<x-.5)return Math.floor(pts[i]);return 0;
  }
  $("guide-up").addEventListener("click",()=>animateTo(nextMark(1),700));
  $("guide-down").addEventListener("click",()=>{if(last&&last.model.diabetes){maxDiabetes=true;remissionDismissed=false}animateTo(nextMark(-1),700)});

  /* ---- each render updates the dock ---- */
  document.addEventListener("pft:render",e=>{
    const d=e.detail,m=d.model;last=d;
    if(dockHost){
      $("dock-stage").textContent=d.stage.kicker;
      $("dock-a1c-num").textContent=m.a1c.toFixed(1)+"%";
      $("dock-a1c-label").textContent=m.glycemicState==="diabetes"?"Diabetes":m.glycemicState==="prediabetes"?"Prediabetes":"Normal";
      $("dock-a1c").dataset.state=m.glycemicState;
      $("dock-output").textContent=Math.round(m.x)+" / 100";
      dockTicks.forEach((el,i)=>{const v=m.marks[i];el.hidden=v>100;el.style.left="calc("+v+"% + "+(14-v*.28).toFixed(2)+"px)";el.classList.toggle("passed",m.x>=v)});
    }
    maybeShowRemission(m);
  });
  capacity.addEventListener("change",()=>{maxDiabetes=false;remissionDismissed=false;note.hidden=true;syncCards()});
  window.PFT.render(false);

  /* ---- waist-to-height ratio (NICE NG246 bands) ---- */
  const waist=$("whtr-waist"),height=$("whtr-height"),out=$("whtr-result");
  function whtr(){
    const w=parseFloat(String(waist.value).replace(",",".")),h=parseFloat(String(height.value).replace(",","."));
    if(!(w>0&&h>0)){out.removeAttribute("data-band");out.textContent="Measure your waist midway between the lowest rib and the top of the hip bone.";return}
    const r=w/h;
    if(r<.3||r>1.2){out.removeAttribute("data-band");out.textContent="Check the numbers: both must use the same unit.";return}
    const band=r<.4?"low":r<.5?"healthy":r<.6?"increased":"high";
    const msg={low:"below the usual range; talk with your clinician if you are losing weight unintentionally.",healthy:"healthy central adiposity (0.4–0.49).",increased:"increased central adiposity (0.5–0.59): one sign you may be near your threshold.",high:"high central adiposity (0.6 or more): a strong sign to check your metabolic health."}[band];
    out.dataset.band=band;out.innerHTML="";const b=document.createElement("b");b.textContent=r.toFixed(2);out.append(b," · "+msg);
  }
  [waist,height].forEach(el=>el&&el.addEventListener("input",whtr));
  document.querySelectorAll('input[name="whtr-unit"]').forEach(el=>el.addEventListener("change",whtr));
})();
