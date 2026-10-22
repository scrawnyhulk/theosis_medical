/* Personal fat threshold: how type 2 diabetes develops. Theosis Medical (Nick Holwey, PA-C).
   V21 engine: adapted from personal-fat-threshold-v20. Teaching model only; not a prediction. */
(function(){
  "use strict";
  const root=document.getElementById("pft-app");
  const $=function(id){return document.getElementById(id)};
  const svgNS="http://www.w3.org/2000/svg";
  const isEmbedded=document.documentElement.dataset.embed==="true"||window.self!==window.top||new URLSearchParams(location.search).get("embed")==="1";
  if(isEmbedded)document.documentElement.classList.add("embedded");
  const clamp=function(n){return Math.max(0,Math.min(1,n))};
  const smooth=function(a,b,x){const t=clamp((x-a)/(b-a));return t*t*(3-2*t)};

  // V21: twin-cycle order (Taylor 2008): muscle insulin resistance early, then
  // visceral, liver, pancreas. Muscle uses the old visceral slot spacing.
  const baseTicks=[24,33,40,52,64,88];
  const tickNames=["Skin","Muscle","Visceral","Liver","Pancreas","Blood"];
  const tickDepots=["sat","muscle","vis","liver","pancreas","blood"];
  const colors=["#77cfa5","#f0cb7c","#7fb8dd","#ef9b57","#f17d66","#d59aea","#ed6c80"];
  const stages=[
    {kicker:"Starting point",title:"Room to store fat",copy:"A lean body still has essential fat. In this starting example, fat is stored normally and insulin keeps blood glucose in its usual range.",take:"The threshold is personal. Body size alone cannot tell you where yours is.",depot:"sat"},
    {kicker:"1 · Under the skin",title:"The storage buffer grows",copy:"Subcutaneous fat is the fat you can pinch. It is the body’s safest place to store extra energy. How much it can hold without metabolic strain varies from person to person.",take:"More body fat does not automatically mean diabetes.",depot:"sat"},
    {kicker:"2 · Within muscle",title:"Muscle responds less to insulin",copy:"Fat inside and between muscle fibres interferes with insulin’s signal. Muscle clears and stores less glucose after meals, so more of that fuel flows to the liver, which turns it into fat. In Taylor’s twin-cycle hypothesis, this muscle insulin resistance comes early.",take:"Blood glucose usually stays normal here because the pancreas makes more insulin.",depot:"muscle"},
    {kicker:"3 · Around the organs",title:"More fat on the inside",copy:"Visceral fat is fat deep in the abdomen, around the organs. It can grow alongside fat under the skin and is associated with higher metabolic risk.",take:"Visceral fat is not a second tank that has to become full.",depot:"vis"},
    {kicker:"4 · Within the liver",title:"Fat reaches the liver",copy:"Higher insulin levels push the liver to make more fat. Fat within the liver blunts insulin’s signal to stop releasing glucose, so fasting glucose creeps up. The liver also exports more fat into the bloodstream.",take:"Insulin may rise first, keeping blood glucose normal for a while.",depot:"liver"},
    {kicker:"5 · Within the pancreas",title:"Insulin supply comes under strain",copy:"Fat exported by the liver reaches the pancreas. In susceptible people, excess fat there impairs the beta cells that make insulin, at first reversibly. This is the second cycle in Taylor’s hypothesis.",take:"How well beta cells keep up decides whether glucose rises, and whether it can come back down.",depot:"pancreas"},
    {kicker:"6 · In the bloodstream",title:"Glucose and fats rise",copy:"More fats circulate and glucose control deteriorates. If insulin production cannot keep up with insulin resistance, blood glucose can rise into the diabetes range.",take:"This illustrates a possible path to type 2 diabetes, not an inevitable outcome.",depot:"blood"}
  ];
  // BEGIN FAT MODEL
  // These profiles are fictional teaching examples, not measured capacities.
  // Tissue curves are preserved except for a small visceral rise in Extreme.
  const glycogenPhaseEnd=12;
  const thresholdProfiles={
    "0.72":{key:"lower",label:"Lower threshold",delay:0,internalScale:.72,storageScale:.72,surfaceEnd:68,surfaceMax:.16,visceralMax:.18,bellyScale:.18,a1cTop:10.1,
      note:"A smaller under-skin reserve helps explain why someone can develop type 2 diabetes without being significantly overweight. This is an illustrative phenotype, not a prediction from weight."},
    "1":{key:"moderate",label:"Moderate threshold",delay:0,internalScale:1,storageScale:1,surfaceEnd:80,surfaceMax:.32,visceralMax:.24,bellyScale:.22,a1cTop:8.4,
      note:"A somewhat fuller body stores more under the skin, while visceral fat adds a natural central-belly increase before blood sugar rises. Fictional example; body size does not identify a personal threshold."},
    "1.1":{key:"larger",label:"Larger threshold",delay:32,internalScale:.88,storageScale:1.02,surfaceEnd:95,surfaceMax:1.14,visceralMax:.20,bellyScale:.18,a1cTop:7.0,
      note:"A larger under-skin reserve and fuller body, with internal fat and glucose changes at a higher load. This is an illustrative phenotype, not a prediction from weight."},
    "2":{key:"extreme",label:"Extreme threshold",delay:72,internalScale:1.6,storageScale:2.3,surfaceEnd:100,surfaceMax:1.18,visceralMax:.045,bellyScale:.045,
      note:"An expanding under-skin reserve helps explain why someone with substantial obesity can still have normal glucose and no diabetes. Hyperplasia can contribute; it does not guarantee lasting protection."}
  };
  function model(value,capacity){
    const x=Math.max(0,Math.min(100,Number(value)||0));
    const profile=thresholdProfiles[String(Number(capacity))]||thresholdProfiles["1"];
    // A brief teaching prelude shows replenishment of carbohydrate reserves.
    // It is not a biological gate: fuel oxidation and fat storage overlap.
    const fatLoad=100*clamp((x-glycogenPhaseEnd)/(100-glycogenPhaseEnd));
    const p=Math.max(0,fatLoad-profile.delay)/profile.internalScale;
    const storageP=fatLoad/profile.storageScale;
    const marks=baseTicks.map(function(n){return glycogenPhaseEnd+(100-glycogenPhaseEnd)*(profile.delay+n*profile.internalScale)/100});
    // Hyperplasia remains predominantly subcutaneous, with a small explicit
    // late visceral stage. Hidden later ticks are outside this illustration.
    if(profile.key==='extreme'){marks[0]=16.4;marks[1]=101;marks[2]=88;marks[3]=102;marks[4]=103;marks[5]=104}
    let stage=fatLoad<5?0:1;
    for(let i=0;i<marks.length;i++)if(x>=marks[i])stage=Math.min(6,i+1);
    // These A1c values illustrate hypothetical sustained glucose levels. They
    // are not fitted to body fat, clinical risk, or an individual patient.
    // Only the 5.7% and 6.5% category cutoffs are clinical thresholds.
    const extreme=profile.key==="extreme";
    const originalA1c=q=>q<=69?5.2:q<80?5.2+.5*(q-69)/11:q<96?5.7+.8*(q-80)/16:6.5+.085*(q-96);
    const glucoseStart=profile.delay+69*profile.internalScale;
    const endpointAdjustment=profile.a1cTop?profile.a1cTop-originalA1c((100-profile.delay)/profile.internalScale):0;
    // V21: illustrative start at 5.2%, an ordinary normal-range value. Glucose
    // stays flat until late, as it usually does in real life.
    // The early rise rejoins the original curve at its glucose-rise point,
    // preserving the other presets' existing cutoffs, spill timing and maxima.
    const a1cBaseline=5.2;
    const glucoseStartSlider=glycogenPhaseEnd+(100-glycogenPhaseEnd)*glucoseStart/100;
    const earlyBaselineAdjustment=(5.2-a1cBaseline)*(1-smooth(0,glucoseStartSlider,x));
    const a1cRaw=extreme
      ? a1cBaseline+.2*smooth(0,100,x)
      : originalA1c(p)+endpointAdjustment*smooth(glucoseStart,100,fatLoad)-earlyBaselineAdjustment;
    // V27: while insulin still compensates, average glucose drifts up a little inside the normal
    // range (HbA1c 5.2 -> about 5.5%), then joins the original curve, so the prediabetes (5.7%) and
    // diabetes (6.5%) crossings, the stage captions and the endpoints are unchanged.
    const a1cDrift=extreme?0:.3*smooth(0,glucoseStart,fatLoad);
    const a1cTenths=Math.round(Math.max(a1cRaw,a1cBaseline+a1cDrift)*10);
    const glycemicState=a1cTenths>=65?"diabetes":a1cTenths>=57?"prediabetes":"normal";
    // Continuous particle burden avoids an early plateau at the old cap.
    // A shared scale keeps the differences between profiles visible.
    const glucose=clamp((Math.max(a1cRaw,a1cBaseline+a1cDrift)-5.2)/5);
    const lipids=extreme?.05*smooth(25,100,fatLoad):clamp((p-29)/(100/.72-29));
    // Keep tissue curves overlapping. A larger surface reserve shifts internal
    // changes later; no depot is required to be literally full first.
    // Every added compartment starts at ZERO at its own labeled stage.
    // smoothstep has zero slope at onset: no fat shell switches on at full size.
    // This ordering is a teaching device; real depots can change together.
    const stageGrowth=(start)=>start>=100?0:smooth(start,100,x);
    // Muscle insulin resistance develops early and quickly in this sequence.
    const muscleProgress=marks[1]>=100?0:smooth(marks[1],Math.min(100,marks[1]+22*profile.internalScale),x),visProgress=stageGrowth(marks[2]);
    const liverProgress=stageGrowth(marks[3]),pancreasProgress=stageGrowth(marks[4]);
    return {x:x,fatLoad:fatLoad,p:p,storageP:storageP,profile:profile.key,profileLabel:profile.label,profileNote:profile.note,
      glycogenPhase:x<=glycogenPhaseEnd,glycogenLiver:.25+.75*smooth(0,10,x),glycogenMuscle:.25+.75*smooth(0,glycogenPhaseEnd,x),
      surfaceVolume:profile.surfaceMax*smooth(0,profile.surfaceEnd,fatLoad),
      hyperplasia:extreme?smooth(5,100,fatLoad):0,
      a1c:a1cTenths/10,glycemicState:glycemicState,
      marks:marks,stage:stage,diabetes:glycemicState==="diabetes",
      sat:.08+.92*smooth(0,70,storageP),vis:.04+(profile.visceralMax||.96)*visProgress,visProgress:visProgress,bellyScale:profile.bellyScale||visProgress,
      liver:.02+.98*liverProgress,pancreas:.02+.98*pancreasProgress,
      muscle:.03+.97*muscleProgress,lipids:lipids,glucose:glucose};
  }

  // One normalized organ-fat value drives the body illustration, the meters,
  // and the CT-style section. Keeping this in one function prevents the liver
  // or pancreas from appearing at a different stage in either view.
  const organFatBaselines={liver:.02,pancreas:.02};
  function organFatLevel(m,key){
    const baseline=organFatBaselines[key]||0;
    return clamp((m[key]-baseline)/(1-baseline));
  }

  const diabetesOnsetCache=Object.create(null);
  function diabetesOnsetFor(capacity){
    const key=String(Number(capacity));
    if(Object.prototype.hasOwnProperty.call(diabetesOnsetCache,key))return diabetesOnsetCache[key];
    let onset=101;
    for(let x=0;x<=100;x++){if(model(x,key).diabetes){onset=x;break}}
    diabetesOnsetCache[key]=onset;
    return onset;
  }
  const reserveProfiles={
    lower:{scale:.78,label:"Lower reserve"},
    moderate:{scale:1,label:"Moderate reserve"},
    larger:{scale:1.15,label:"Larger reserve"},
    extreme:{scale:1.28,label:"Expanding reserve"}
  };
  let hyperplasiaTanks=null;
  function ensureHyperplasiaTankCluster(){
    if(hyperplasiaTanks)return hyperplasiaTanks;
    const cluster=$("hyperplasia-tank-cluster");
    if(!cluster)return hyperplasiaTanks=[];
    const xs=[34,104,174,244],w=42,h=42,top=35,bottom=top+h;
    hyperplasiaTanks=[];
    xs.forEach(function(x,i){
      const g=node("g",{"data-hyperplasia-tank":String(i)},cluster);
      node("rect",{x:x,y:top,width:w,height:h,rx:11,ry:11,fill:"#07131b",opacity:".96"},g);
      const fill=node("rect",{x:x+3,y:bottom-3,width:w-6,height:0,rx:8,ry:8,fill:"url(#reserve-fuel)"},g);
      const glow=node("ellipse",{cx:(x+w/2).toFixed(1),cy:(bottom-3).toFixed(1),rx:((w-10)/2).toFixed(1),ry:"3.8",fill:"#ffe39a",opacity:"0"},g);
      const glint=node("ellipse",{cx:(x+w/2-3).toFixed(1),cy:(bottom-4.2).toFixed(1),rx:((w-18)/2).toFixed(1),ry:"1.6",fill:"#fff4c0",opacity:"0"},g);
      node("rect",{x:x+3,y:top+3,width:w-6,height:h-6,rx:8,ry:8,fill:"url(#reserve-glass)",opacity:".38"},g);
      node("rect",{x:x,y:top,width:w,height:h,rx:11,ry:11,fill:"none",stroke:"url(#reserve-shell)","stroke-width":"2"},g);
      node("path",{d:`M${x+3} ${bottom-7} C${x+8} ${bottom-2} ${x+w-8} ${bottom-2} ${x+w-3} ${bottom-7}`,fill:"none",stroke:"#7e97a2","stroke-opacity":".62","stroke-width":"1"},g);
      node("circle",{cx:(x+w/2).toFixed(1),cy:(top-7).toFixed(1),r:"7.2",fill:"#0d1a22",stroke:"#8aa4ad","stroke-width":"1"},g);
      node("path",{d:`M${x+w/2-3.5} ${top-7} h7`,stroke:"#c6e8e6","stroke-width":"1.4","stroke-linecap":"round"},g);
      node("path",{d:`M${x+w/2} ${top-10.5} v7`,stroke:"#c6e8e6","stroke-width":"1.4","stroke-linecap":"round"},g);
      if(i<xs.length-1){
        node("path",{d:`M${x+w+6} ${top+21} h16`,stroke:"#88a4ad","stroke-width":"1.4","stroke-dasharray":"2.6 3.6","stroke-linecap":"round",opacity:".42"},cluster);
      }
      hyperplasiaTanks.push({group:g,fill:fill,glow:glow,glint:glint,top:top,bottom:bottom});
    });
    return hyperplasiaTanks;
  }
  function renderFuelReserve(m){
    const reserve=$("fuel-reserve"),svg=$("fuel-reserve-svg"),cfg=reserveProfiles[m.profile]||reserveProfiles.moderate;
    const onset=diabetesOnsetFor($("capacity-select").value);
    const postGlycogen=clamp((m.x-glycogenPhaseEnd)/(100-glycogenPhaseEnd));
    const fill=onset<=100?clamp((m.x-glycogenPhaseEnd)/Math.max(1,onset-glycogenPhaseEnd)):.72*postGlycogen;
    const isExtreme=m.profile==="extreme";
    const mainTank=$("tank-capacity-group"),overflowRim=$("fuel-overflow-rim"),backPuddle=$("fuel-puddle-back"),frontPuddle=$("fuel-puddle-front"),cluster=$("hyperplasia-tank-cluster");
    if(isExtreme){
      ensureHyperplasiaTankCluster();
      if(cluster)cluster.setAttribute("opacity","1");
      mainTank.setAttribute("opacity","0");
      overflowRim.setAttribute("opacity","0");
      backPuddle.setAttribute("opacity","0");
      frontPuddle.setAttribute("opacity","0");
      const total=postGlycogen*4;
      hyperplasiaTanks.forEach(function(tank,i){
        const part=clamp(total-i);
        tank.group.setAttribute("opacity",total>i+.02?"1":".14");
        const y=tank.bottom-3-(tank.bottom-tank.top-6)*part;
        tank.fill.setAttribute("y",y.toFixed(2));
        tank.fill.setAttribute("height",Math.max(0,tank.bottom-3-y).toFixed(2));
        tank.glow.setAttribute("cy",y.toFixed(2));
        tank.glint.setAttribute("cy",(y-1.1).toFixed(2));
        tank.glow.setAttribute("opacity",part>.01?(.20+.50*part).toFixed(2):"0");
        tank.glint.setAttribute("opacity",part>.01?(.12+.22*part).toFixed(2):"0");
      });
      let status="Reserve cells available";
      if(postGlycogen>=.2)status="Small reserve cells filling";
      if(postGlycogen>=.45)status="New reserve cells added";
      if(postGlycogen>=.72)status="More reserve cells recruited";
      if(postGlycogen>=.92)status="Many reserve cells storing fuel";
      reserve.dataset.state="filling";reserve.dataset.profile=m.profile;reserve.dataset.fill=postGlycogen.toFixed(4);reserve.dataset.overflow="0";reserve.dataset.diabetesOnset="none";reserve.dataset.a1c=m.a1c.toFixed(1);
      $("fuel-reserve-status").textContent=status;
      $("fuel-reserve-note").textContent="Hyperplasia analogy · one reserve cell fills, then another is added";
      svg.setAttribute("aria-valuenow",Math.round(postGlycogen*100));
      svg.setAttribute("aria-valuetext",Math.round(postGlycogen*100)+" percent through the hyperplasia example. Small reserve tanks fill one after another as new storage cells are added.");
      $("fuel-reserve-desc").textContent="Small reserve tanks fill one after another as the model illustrates hyperplasia adding new storage cells instead of overflowing a single tank.";
      return;
    }
    if(cluster)cluster.setAttribute("opacity","0");
    mainTank.setAttribute("opacity","1");
    const overflowBase=m.diabetes&&onset<=100?clamp(.13+(m.x-onset)/28):0;
    const overflow=m.profile==="larger"&&overflowBase>0?clamp(.03+1.35*overflowBase):overflowBase;
    const top=27,bottom=84,surfaceY=bottom-(bottom-top)*fill;
    $("fuel-tank-fill").setAttribute("y",surfaceY.toFixed(2));
    $("fuel-tank-fill").setAttribute("height",Math.max(0,bottom-surfaceY+7).toFixed(2));
    $("fuel-tank-surface").setAttribute("cy",surfaceY.toFixed(2));
    $("fuel-tank-surface-glint").setAttribute("cy",(surfaceY-1.2).toFixed(2));
    $("fuel-tank-surface").setAttribute("opacity",fill>.008?(m.diabetes?.94:.76).toFixed(2):"0");
    $("fuel-tank-surface-glint").setAttribute("opacity",fill>.008?(m.diabetes?.62:.36).toFixed(2):"0");
    $("fuel-tank-danger-fill").setAttribute("opacity",m.diabetes?.72:m.glycemicState==="prediabetes"?.27:0);
    const shellScale=1.22*cfg.scale;
    mainTank.setAttribute("transform","translate(160 0) scale("+shellScale.toFixed(3)+" 1) translate(-160 0)");
    overflowRim.setAttribute("opacity",overflow.toFixed(3));
    if(m.profile==="larger")overflowRim.setAttribute("transform","translate(160 27) scale(1 1.65) translate(-160 -27)");
    else overflowRim.removeAttribute("transform");
    const puddleX=m.profile==="larger"?1.15+1.9*overflow:.58+1.72*overflow;
    const puddleY=m.profile==="larger"?.65+.85*overflow:.38+.66*overflow;
    [backPuddle,frontPuddle].forEach(function(el){
      el.setAttribute("opacity",overflow.toFixed(3));
      el.setAttribute("transform","translate(160 92) scale("+puddleX.toFixed(3)+" "+puddleY.toFixed(3)+") translate(-160 -92)");
    });
    let status="Storage available",state="available";
    if(m.diabetes){status="Reserve overwhelmed";state="diabetes"}
    else if(m.glycemicState==="prediabetes"||fill>=.84){status="Reserve nearly full";state="prediabetes"}
    else if(fill>=.28){status="Reserve filling";state="filling"}
    $("fuel-reserve-status").textContent=status;
    $("fuel-reserve-note").textContent=cfg.label+" · hypothetical capacity";
    reserve.dataset.state=state;reserve.dataset.profile=m.profile;reserve.dataset.fill=fill.toFixed(4);reserve.dataset.overflow=overflow.toFixed(4);reserve.dataset.diabetesOnset=onset<=100?String(onset):"none";reserve.dataset.a1c=m.a1c.toFixed(1);
    svg.setAttribute("aria-valuenow",Math.round(fill*100));
    svg.setAttribute("aria-valuetext",Math.round(fill*100)+" percent full. "+status+". Illustrative "+cfg.label.toLowerCase()+".");
    $("fuel-reserve-desc").textContent="The hypothetical "+cfg.label.toLowerCase()+" is "+Math.round(fill*100)+" percent full. "+(overflow>0?"Fuel is overflowing around the tank after the model reached an HbA1c in the diabetes range.":status+".");
  }
  function node(tag,attrs,parent){const n=document.createElementNS(svgNS,tag);Object.keys(attrs).forEach(function(k){n.setAttribute(k,attrs[k])});parent.appendChild(n);return n}
  // A dedicated tissue material expands around fixed anatomical landmarks.
  // Each row is [x,y,maximum left width,maximum right width]. Width zero at
  // both ends produces tapered deposits; no whole-person image is crossfaded.
  const fatRegions=[
    {id:"flank-left",points:[[260,313,0,0],[259,356,21,13],[260,411,37,28],[255,465,49,34],[255,516,48,32],[285,559,0,0]]},
    {id:"flank-right",points:[[432,313,0,0],[433,356,13,21],[432,411,28,37],[437,465,34,49],[437,516,32,48],[407,559,0,0]]},
    {id:"arm-left-outer",points:[[224,246,0,0],[211,286,18,8],[194,345,25,9],[175,401,24,8],[168,458,15,6],[170,529,0,0]]},
    {id:"arm-left-inner",points:[[238,286,0,0],[231,333,8,16],[212,384,7,20],[205,430,7,17],[190,483,5,9],[180,532,0,0]]},
    {id:"arm-right-outer",points:[[468,246,0,0],[481,286,8,18],[498,345,9,25],[517,401,8,24],[524,458,6,15],[522,529,0,0]]},
    {id:"arm-right-inner",points:[[454,286,0,0],[461,333,16,8],[480,384,20,7],[487,430,17,7],[502,483,9,5],[512,532,0,0]]},
    {id:"thigh-left-outer",points:[[264,511,0,0],[242,555,32,13],[233,603,36,16],[241,654,31,14],[256,697,16,7],[271,729,0,0]]},
    {id:"thigh-left-inner",points:[[310,555,0,0],[305,591,8,16],[301,632,10,19],[292,677,7,15],[280,720,0,0]]},
    {id:"thigh-right-outer",points:[[428,511,0,0],[450,555,13,32],[459,603,16,36],[451,654,14,31],[436,697,7,16],[421,729,0,0]]},
    {id:"thigh-right-inner",points:[[382,555,0,0],[387,591,16,8],[391,632,19,10],[400,677,15,7],[412,720,0,0]]},
    {id:"calf-left",points:[[261,738,0,0],[242,779,11,5],[243,824,10,4],[247,875,5,3],[244,923,0,0]]},
    {id:"calf-right",points:[[431,738,0,0],[450,779,5,11],[449,824,4,10],[445,875,3,5],[448,923,0,0]]},
    // A continuous lower-abdominal fold joins the flanks around the fixed
    // organ window. Expansion is normal to this arc, never a limb transform.
    {id:"lower-abdomen",orientation:"normal",points:[[253,478,0,0],[267,511,16,18],[299,539,26,26],[346,548,32,36],[393,539,26,26],[425,511,18,16],[439,478,0,0]]}
  ];
  function smoothOutline(points){
    if(!points.length)return "";
    const f=n=>Number(n).toFixed(2);
    let d="M"+f(points[0][0])+" "+f(points[0][1]);
    for(let i=0;i<points.length;i++){
      const a=points[(i-1+points.length)%points.length],b=points[i],c=points[(i+1)%points.length],e=points[(i+2)%points.length];
      d+=" C"+f(b[0]+(c[0]-a[0])/6)+" "+f(b[1]+(c[1]-a[1])/6)+" "+f(c[0]-(e[0]-b[0])/6)+" "+f(c[1]-(e[1]-b[1])/6)+" "+f(c[0])+" "+f(c[1]);
    }
    return d+"Z";
  }
  function fatRibbon(points,amount,from=0,to=1){
    if(amount<=0)return "M0 0Z";
    const edge=(p,u)=>[p[0]+(-p[2]+(p[2]+p[3])*u)*amount,p[1]];
    return smoothOutline(points.map(p=>edge(p,from)).concat(points.slice().reverse().map(p=>edge(p,to))));
  }
  function tissueContour(points,seed){
    // Subtle, stable lobulation belongs to the tissue edge only; the body's
    // pose and joint landmarks never move. Zero-width endpoints stay fixed.
    const detailed=[];
    for(let i=0;i<points.length-1;i++){
      const a=points[Math.max(0,i-1)],b=points[i],c=points[i+1],d=points[Math.min(points.length-1,i+2)];
      for(let j=0;j<7;j++){
        const t=j/7,t2=t*t,t3=t2*t;
        const row=[0,1,2,3].map(k=>.5*(2*b[k]+(-a[k]+c[k])*t+(2*a[k]-5*b[k]+4*c[k]-d[k])*t2+(-a[k]+3*b[k]-3*c[k]+d[k])*t3));
        for(let side=2;side<4;side++){
          const micro=.74*Math.sin(row[1]*.43+row[0]*.15+seed+side*1.4)+.32*Math.sin(row[1]*.91+seed*2.7);
          row[side]=Math.max(0,row[side]+micro*Math.min(1,Math.max(0,row[side])/4));
        }
        detailed.push(row);
      }
    }
    detailed.push(points[points.length-1].slice());return detailed;
  }
  const adiposePaths=fatRegions.map(function(region,index){
    const surface=tissueContour(region.points,index*.93);
    const ribbon=region.orientation==="normal"?surfaceRibbon:fatRibbon;
    const group=node("g",{"data-fat-region":region.id},$("subcutaneous-fat"));
    const tissue=node("path",{fill:"url(#adipose-texture)",filter:"url(#adipose-material-tone)",d:"M0 0Z"},group);
    // Lighting follows the changing cross-section instead of painting a flat
    // yellow outline. Tissue remains opaque; only its geometry changes.
    const clip=node("clipPath",{id:"fat-light-clip-"+region.id,clipPathUnits:"userSpaceOnUse"},$("anatomy-defs"));
    const clipShape=node("path",{d:"M0 0Z"},clip);
    const clipped=node("g",{"clip-path":"url(#fat-light-clip-"+region.id+")"},group);
    const lightSurface=node("g",{filter:"url(#soft-tissue-lighting)"},clipped);
    const bands=Array.from({length:24},function(_,i){
      const nx=2*(i+.5)/24-1,nz=Math.sqrt(1-nx*nx);
      const light=Math.max(0,-.32*nx+.94*nz);
      return node("path",{fill:"#2e2017","fill-opacity":(.52*(1-light)).toFixed(3),d:"M0 0Z"},lightSurface);
    });
    const shade=node("path",{fill:"url(#adipose-soft-light)",d:"M0 0Z"},group);
    return {region:region,surface:surface,ribbon:ribbon,tissue:tissue,shade:shade,bands:bands,clipShape:clipShape};
  });
  // Epicardial deposits follow the registered heart's surface and sulci.
  // The heart image already contains a small physiological fat layer.
  const cardiacFatRegions=[
    {id:"right-av-groove",points:[[586,421,0,0],[531,473,56,43],[439,545,75,54],[373,640,78,55],[354,715,0,0]]},
    {id:"left-av-groove",points:[[567,443,0,0],[694,451,48,49],[822,493,58,68],[936,531,57,48],[1000,571,0,0]]},
    {id:"interventricular-groove",points:[[834,482,0,0],[815,616,66,61],[783,771,86,63],[749,937,71,53],[774,1101,0,0]]},
    {id:"rv-free-wall",points:[[327,577,0,0],[302,682,38,82],[347,826,38,105],[444,952,43,115],[619,1065,0,0]]}
  ].map(function(region,i){
    const points=region.points.map(p=>[298+94*p[0]/1254,249+94*p[1]/1254,94*p[2]/1254,94*p[3]/1254]);
    const surface=tissueContour(points,3+i*.71);
    const group=node("g",{"data-cardiac-fat":region.id},$("epicardial-fat"));
    const tissue=node("path",{d:"M0 0Z",fill:"url(#cardiac-adipose-texture)",filter:"url(#adipose-material-tone)"},group);
    const shade=node("path",{d:"M0 0Z",fill:"url(#adipose-soft-light)"},group);
    return {id:region.id,surface:surface,tissue:tissue,shade:shade};
  });
  function cardiacFatAmount(m){return clamp((m.visProgress||0)*(.28+1.2*(m.bellyScale||0)))}
  function surfaceRibbon(points,amount,from=0,to=1){
    if(amount<=0)return "M0 0Z";
    const edges=points.map(function(p,i){
      const a=points[Math.max(0,i-1)],b=points[Math.min(points.length-1,i+1)],len=Math.hypot(b[0]-a[0],b[1]-a[1])||1;
      const nx=-(b[1]-a[1])/len,ny=(b[0]-a[0])/len;
      const edge=u=>{const offset=(p[2]-(p[2]+p[3])*u)*amount;return [p[0]+nx*offset,p[1]+ny*offset]};
      return [edge(from),edge(to)];
    });
    return smoothOutline(edges.map(p=>p[0]).concat(edges.slice().reverse().map(p=>p[1])));
  }
  // Glycogen is intracellular: increase distributed tissue highlights rather
  // than drawing a fluid level or adding bulk to the organs. Symbols are a key,
  // not visible anatomy or a molecular-scale image.
  const glycogenStores=[
    {id:"liver",key:"glycogenLiver",areas:[[272,330,130,92,110]]},
    {id:"muscle",key:"glycogenMuscle",areas:[[247,547,60,180,92],[382,547,60,180,92],[184,277,54,103,40],[458,277,58,103,40]]}
  ].map(function(store){
    const granules=[];
    store.areas.forEach(function(area,part){
      for(let i=0;i<area[4];i++){
        const x=area[0]+area[2]*((i*.61803398875+part*.137)%1),y=area[1]+area[3]*((i*.41421356237+part*.213)%1);
        const dot=node("g",{opacity:0,fill:"#a4ebdc"},$(store.id+"-glycogen-granules"));
        node("path",{d:"M"+x+" "+y+"l-1.7 -1.3m1.7 1.3l1.5 -1.8m-1.5 1.8l.6 1.8",fill:"none",stroke:"#83d6c8","stroke-width":.6},dot);
        [[0,0,1.1],[-1.7,-1.3,.8],[1.5,-1.8,.8],[.6,1.8,.8]].forEach(p=>node("circle",{cx:x+p[0],cy:y+p[1],r:p[2]},dot));
        granules.push({el:dot,order:(i*.754877666+part*.217)%1});
      }
    });
    return {...store,granules:granules};
  });

  const organFatStores=[
    {key:"liver",group:$("liver-fat-visual"),dropletHost:$("liver-fat-droplets"),edge:$("liver-fat-edge"),box:[276,329,126,90],count:48,seed:.173},
    {key:"pancreas",group:$("pancreas-fat-visual"),dropletHost:$("pancreas-fat-droplets"),edge:$("pancreas-fat-edge"),box:[306,371,101,62],count:28,seed:.419}
  ].map(function(store){
    store.droplets=[];
    for(let i=0;i<store.count;i++){
      const fx=(i*.61803398875+store.seed)%1,fy=(i*.41421356237+store.seed*1.73)%1;
      const x=store.box[0]+store.box[2]*fx,y=store.box[1]+store.box[3]*fy;
      const rx=1.25+(i%5)*.34,ry=.9+((i*3)%5)*.25;
      const dot=node("ellipse",{cx:x.toFixed(2),cy:y.toFixed(2),rx:rx.toFixed(2),ry:ry.toFixed(2),fill:"url(#organ-fat-droplet)",opacity:0,transform:"rotate("+(-28+(i*47)%57)+" "+x.toFixed(2)+" "+y.toFixed(2)+")"},store.dropletHost);
      store.droplets.push({el:dot,order:(i*.754877666+store.seed*.83)%1});
    }
    return store;
  });
  function renderOrganFat(m){
    organFatStores.forEach(function(store){
      const level=organFatLevel(m,store.key);
      const visible=level>0;
      store.group.setAttribute("opacity",visible?(.16+.78*Math.sqrt(level)).toFixed(3):"0");
      store.group.setAttribute("data-fat-level",level.toFixed(4));
      store.edge.setAttribute("stroke-opacity",visible?(.12+.5*level).toFixed(3):"0");
      let visibleCount=0;
      store.droplets.forEach(function(dot){
        const opacity=clamp((level-dot.order*.88)/.11)*(.28+.64*Math.sqrt(level));
        dot.el.setAttribute("opacity",opacity.toFixed(3));
        if(opacity>.04)visibleCount++;
      });
      store.group.setAttribute("data-visible-droplets",String(visibleCount));
    });
  }
  function renderGlycogen(m){
    glycogenStores.forEach(function(store){
      const value=m[store.key],status=m.x===0?"Starting":value>=.999?"Stocked":"Filling";
      // V29: Extreme's thick fat already covers the muscle, so the green muscle tone fades out after
      // the prelude instead of washing the whole body like a flat sheet.
      const toneK=store.id==="muscle"&&m.profile==="extreme"?1-.8*smooth(12,30,m.x):1;
      $(store.id+"-glycogen-tone").setAttribute("opacity",(.60*value*toneK).toFixed(3));
      store.granules.forEach(dot=>dot.el.setAttribute("opacity",(.85*clamp((value-dot.order)/.06)).toFixed(3)));
      $("glycogen-"+store.id+"-bar").style.width=(value*100).toFixed(1)+"%";
      $("glycogen-"+store.id+"-meter").setAttribute("aria-valuenow",Math.round(value*100));
      $("glycogen-"+store.id+"-meter").setAttribute("aria-valuetext",status+"; "+Math.round(value*100)+" percent of this illustrative display range, not a measured reserve");
      $("glycogen-"+store.id+"-value").textContent=status;
      $("glycogen-"+store.id+"-row").classList.toggle("active",m.glycogenPhase);
    });
    $("glycogen-tick").classList.toggle("passed",m.x>=glycogenPhaseEnd);
    $("glycogen-tick").classList.toggle("current",m.glycogenPhase);
  }
  // Cell recruitment is a schematic inset, separate from the body artwork.
  // New cells mature from precursors; existing fat cells are not shown dividing.
  const adipocyteCells=[];
  for(let i=0;i<30;i++){
    const cx=15+(i%10)*32,cy=16+Math.floor(i/10)*27;
    const group=node("g",{opacity:i<6?1:0},$("adipocyte-cells"));
    const cell=node("circle",{cx:cx,cy:cy,r:10.5,fill:"url(#adipocyte-fill)",stroke:"#cfb777","stroke-width":1},group);
    const nucleus=node("circle",{cx:cx+6.8,cy:cy-3.8,r:2,fill:"#7695b5"},group);
    adipocyteCells.push({group:group,cell:cell,nucleus:nucleus,cx:cx,cy:cy});
  }
  const bloodFat=[],bloodGlucose=[],bodyParticles=[];
  for(let i=0;i<72;i++){
    bloodFat.push(node("circle",{cx:13+(i*71)%318,cy:15+(i*19)%36,r:2.4+(i%3)*.45,fill:"#f0cb7c",opacity:0},$("blood-fat-particles")));
    const x=14+(i*53)%314,y=17+(i*23)%33;
    bloodGlucose.push(node("rect",{x:x,y:y,width:4.8,height:4.8,rx:.5,fill:"#93dffa",transform:"rotate(45 "+(x+2.4)+" "+(y+2.4)+")",opacity:0},$("blood-glucose-particles")));
  }
  // V31: centrelines projected from our own procedural 3D arterial tree (v31/arteries.py) baked into
  // the Cycles frames (front camera, slim state), so blood-flow markers ride
  // the real vessels under the skin. Coordinates stay in the legacy overlay
  // space (group transform below). Anterior projection: patient's RIGHT is viewer's LEFT. Deep vessels are
  // deliberately visible through tissue. Origins follow OpenStax A&P 20.5.
  // Drawing, lumen clipping, and particles all share these exact centerlines.
  const arterialNetwork=[
    {id:"aortic-root",parent:null,photoWall:true,width:[11,12.8],points:[[348.2,270.9],[347.1,257.5],[346.0,244.1]]},
    {id:"aortic-arch",parent:"aortic-root",width:[12.8,12],points:[[346.0,244.1],[346.9,239.7],[348.2,233.7],[352.0,229.4],[356.4,230.2],[360.7,233.0],[363.9,242.0],[364.6,250.8],[364.9,257.1]]},
    {id:"descending-aorta",parent:"aortic-arch",posterior:true,width:[12,10],points:[[362.2,257.1],[360.8,268.4],[358.7,284.4],[356.8,300.3],[354.5,322.1],[353.1,336.4],[352.0,349.8],[351.3,362.6],[350.7,374.8],[350.0,386.5],[349.3,397.5],[348.2,412.9],[347.4,423.3],[346.6,433.1],[346.0,439.9]]},
    {id:"celiac-trunk-right-hepatic",parent:"descending-aorta",posterior:true,width:[4.2,2.2],points:[[350.4,364.4],[348.1,363.6],[342.7,361.8],[338.1,360.7],[328.7,359.1],[324.3,358.3]]},
    {id:"celiac-trunk-splenic",parent:"descending-aorta",posterior:true,width:[4.0,2.0],points:[[350.4,364.4],[354.8,362.9],[364.5,359.8],[371.0,357.8],[381.7,354.8],[386.7,353.4]]},
    {id:"right-renal",parent:"descending-aorta",posterior:true,width:[4.2,2.0],points:[[349.3,388.7],[343.8,388.1],[332.6,386.6],[327.7,385.6],[323.4,384.1],[321.7,383.5]]},
    {id:"left-renal",parent:"descending-aorta",posterior:true,width:[4.2,2.0],points:[[349.3,388.7],[352.8,388.1],[360.2,386.6],[364.0,385.6],[368.4,384.1],[370.3,383.5]]},
    {id:"superior-mesenteric",parent:"descending-aorta",posterior:true,width:[4.5,2.0],points:[[349.8,375.2],[349.6,378.2],[348.8,386.5],[347.2,396.9],[342.8,421.7],[340.6,434.0]]},
    {id:"inferior-mesenteric",parent:"descending-aorta",posterior:true,width:[3.3,1.5],points:[[347.6,423.6],[350.2,427.6],[355.5,436.5],[358.1,443.2],[361.1,455.5],[362.3,461.3]]},
    {id:"brachiocephalic",parent:"aortic-arch",width:[9.5,8],points:[[351.5,231.4],[348.4,228.5],[342.1,222.2],[339.4,218.7],[337.1,214.1],[336.2,212.0]]},
    {id:"right-common-carotid",parent:"brachiocephalic",width:[6,4.5],points:[[336.2,212.0],[335.3,204.7],[334.1,194.2],[332.5,180.3],[331.8,172.8],[331.1,165.6],[329.9,153.8],[329.1,145.8],[328.5,140.2]]},
    {id:"left-common-carotid",parent:"aortic-arch",width:[6,4.5],points:[[357.9,230.3],[358.9,223.7],[360.2,213.9],[361.4,196.5],[361.3,182.0],[361.2,167.8],[362.0,152.4],[362.9,145.1],[363.5,140.2]]},
    {id:"right-subclavian-axillary",parent:"brachiocephalic",width:[8,7],points:[[336.2,212.0],[331.9,212.5],[325.6,213.3],[315.7,215.5],[309.4,217.0],[301.9,220.2],[291.1,228.2],[276.0,242.0],[261.9,255.2],[252.8,261.6],[252.5,259.7],[252.7,257.9]]},
    {id:"left-subclavian-axillary",parent:"aortic-arch",width:[8,7],points:[[357.9,230.3],[361.7,225.4],[367.1,218.7],[376.3,214.5],[382.5,215.8],[390.2,220.0],[400.9,228.2],[416.0,242.0],[430.2,255.2],[439.2,261.6],[439.5,259.7],[439.3,257.9]]},
    {id:"right-internal-thoracic",parent:"right-subclavian-axillary",width:[3.8,2.6],points:[[324.3,217.5],[324.9,222.6],[325.8,230.4],[327.3,249.1],[328.4,267.6],[329.3,287.1],[328.9,313.0],[327.6,328.9],[326.7,339.9]]},
    {id:"left-internal-thoracic",parent:"left-subclavian-axillary",width:[3.8,2.6],points:[[367.8,217.5],[367.1,222.6],[366.2,230.4],[364.8,249.1],[363.6,267.6],[362.7,287.1],[363.2,313.0],[364.4,328.9],[365.3,339.9]]},
    {id:"right-brachial",parent:"right-subclavian-axillary",width:[7,5.5],points:[[252.7,257.9],[251.2,271.9],[247.3,302.5],[242.9,322.1],[233.1,353.5],[228.2,368.0]]},
    {id:"left-brachial",parent:"left-subclavian-axillary",width:[7,5.5],points:[[439.3,257.9],[440.8,271.9],[444.8,302.5],[449.1,322.1],[459.0,353.5],[463.8,368.0]]},
    {id:"right-radial",parent:"right-brachial",width:[4.5,3],points:[[228.2,368.0],[223.3,383.5],[212.8,418.0],[207.2,443.2],[200.1,488.2],[197.0,509.3]]},
    {id:"right-ulnar",parent:"right-brachial",width:[4.5,3],points:[[228.2,368.0],[226.8,381.1],[223.3,411.3],[220.0,436.5],[213.3,485.8],[210.0,509.3]]},
    {id:"left-radial",parent:"left-brachial",width:[4.5,3],points:[[463.8,368.0],[468.8,383.5],[479.3,418.0],[484.8,443.2],[491.9,488.2],[495.0,509.3]]},
    {id:"left-ulnar",parent:"left-brachial",width:[4.5,3],points:[[463.8,368.0],[465.3,381.1],[468.8,411.3],[472.0,436.5],[478.8,485.8],[482.0,509.3]]},
    {id:"right-common-external-iliac",parent:"descending-aorta",width:[8,7],points:[[346.0,439.9],[340.9,444.8],[333.7,451.9],[324.4,461.5],[319.9,467.3],[315.6,472.6],[308.0,478.4],[302.5,481.3],[298.6,483.1]]},
    {id:"left-common-external-iliac",parent:"descending-aorta",width:[8,7],points:[[346.0,439.9],[351.1,444.8],[358.4,451.9],[367.6,461.5],[372.1,467.3],[376.4,472.6],[384.1,478.4],[389.6,481.3],[393.4,483.1]]},
    {id:"right-internal-iliac",parent:"right-common-external-iliac",width:[4.5,3],points:[[327.0,458.6],[325.5,463.5],[322.5,474.1],[321.0,481.3],[319.6,493.5],[319.0,499.2]]},
    {id:"left-internal-iliac",parent:"left-common-external-iliac",width:[4.5,3],points:[[365.0,458.6],[366.5,463.5],[369.6,474.1],[371.0,481.3],[372.5,493.5],[373.0,499.2]]},
    {id:"right-femoral",parent:"right-common-external-iliac",width:[7,5.5],points:[[298.6,483.1],[295.9,499.6],[292.0,523.5],[288.9,563.9],[289.7,596.1],[290.3,626.4],[285.2,654.7],[279.2,665.1],[274.9,671.8]]},
    {id:"left-femoral",parent:"left-common-external-iliac",width:[7,5.5],points:[[393.4,483.1],[396.2,499.6],[400.0,523.5],[403.1,563.9],[402.3,596.1],[401.8,626.4],[406.8,654.7],[412.8,665.1],[417.2,671.8]]},
    {id:"right-profunda-femoris",parent:"right-femoral",width:[4,2.5],points:[[292.3,498.7],[287.5,511.3],[278.0,539.6],[274.9,560.4],[274.5,598.0],[274.7,615.8]]},
    {id:"left-profunda-femoris",parent:"left-femoral",width:[4,2.5],points:[[399.7,498.7],[404.5,511.3],[414.0,539.6],[417.2,560.4],[417.5,598.0],[417.3,615.8]]},
    {id:"right-popliteal",parent:"right-femoral",width:[5.5,5],points:[[274.9,671.8],[274.9,680.3],[274.9,698.5],[274.9,709.1],[274.9,724.3],[274.9,731.1]]},
    {id:"left-popliteal",parent:"left-femoral",width:[5.5,5],points:[[417.2,671.8],[417.1,680.3],[417.1,698.5],[417.1,709.1],[417.1,724.3],[417.2,731.1]]},
    {id:"right-anterior-tibial",parent:"right-popliteal",width:[3.1,.9],points:[[274.9,731.1],[272.4,729.9],[268.8,729.7],[264.7,752.1],[263.0,786.9],[261.8,826.6],[260.9,862.6],[260.3,899.8],[259.9,932.2],[258.7,957.2],[257.6,961.4],[256.8,963.4]]},
    {id:"left-anterior-tibial",parent:"left-popliteal",width:[3.1,.9],points:[[417.2,731.1],[419.7,729.9],[423.2,729.7],[427.3,752.1],[429.0,786.9],[430.2,826.6],[431.2,862.6],[431.7,899.8],[432.1,932.2],[433.4,957.2],[434.4,961.4],[435.2,963.4]]},
    {id:"right-posterior-tibial",parent:"right-popliteal",width:[2.9,.85],points:[[274.9,731.1],[275.0,738.0],[275.1,749.7],[274.1,795.0],[272.2,853.2],[270.4,910.5],[269.8,950.4],[270.3,956.3],[270.8,958.9]]},
    {id:"left-posterior-tibial",parent:"left-popliteal",width:[2.9,.85],points:[[417.2,731.1],[417.0,738.0],[416.9,749.7],[417.9,795.0],[419.8,853.2],[421.6,910.5],[422.2,950.4],[421.7,956.3],[421.3,958.9]]},
    {id:"right-fibular",parent:"right-posterior-tibial",width:[2.1,.75],points:[[274.0,750.8],[269.6,775.0],[260.3,827.2],[255.9,859.2],[251.2,908.1],[249.3,930.4]]},
    {id:"left-fibular",parent:"left-posterior-tibial",width:[2.1,.75],points:[[418.0,750.8],[422.5,775.0],[431.7,827.2],[436.1,859.2],[440.8,908.1],[442.7,930.4]]},
    {id:"right-coronary",parent:"aortic-root",photoWall:true,width:[2.7,1.8],points:[[343.3,267.1],[339.3,269.5],[333.8,273.2],[328.3,280.6],[326.6,287.6],[326.4,294.4],[329.9,301.0],[334.5,303.8],[337.8,305.6]]},
    {id:"left-main-coronary",parent:"aortic-root",photoWall:true,width:[2.9,2.5],points:[[352.6,261.8],[356.2,264.2],[359.8,266.7]]},
    {id:"left-anterior-descending",parent:"left-main-coronary",photoWall:true,width:[2.5,1.5],points:[[359.8,266.7],[361.1,270.8],[364.1,279.9],[366.6,285.7],[371.3,295.0],[373.5,299.3]]},
    {id:"left-circumflex",parent:"left-main-coronary",photoWall:true,width:[2.3,1.5],points:[[359.8,266.7],[363.6,267.4],[371.4,269.2],[375.0,271.4],[378.4,276.6],[379.9,279.1]]},
    {id:"right-marginal",parent:"right-coronary",photoWall:true,width:[2,1.2],points:[[326.8,297.1],[328.9,298.6],[333.4,301.6],[336.8,303.0],[343.1,304.4],[346.0,305.0]]},
    {id:"diagonal-coronary",parent:"left-anterior-descending",photoWall:true,width:[1.8,1.1],points:[[365.3,282.8],[367.9,283.5],[373.2,285.3],[375.6,286.6],[378.0,289.3],[378.9,290.5]]}
  ];
  function sampleArtery(points){
    const samples=[];
    for(let i=0;i<points.length-1;i++){
      const a=points[Math.max(0,i-1)],b=points[i],c=points[i+1],d=points[Math.min(points.length-1,i+2)];
      for(let j=0;j<24;j++){
        const t=j/24,t2=t*t,t3=t2*t;
        samples.push([0,1].map(k=>.5*((2*b[k])+(-a[k]+c[k])*t+(2*a[k]-5*b[k]+4*c[k]-d[k])*t2+(-a[k]+3*b[k]-3*c[k]+d[k])*t3)));
      }
    }
    samples.push(points[points.length-1].slice());
    let length=0;
    return samples.map((p,i)=>{if(i)length+=Math.hypot(p[0]-samples[i-1][0],p[1]-samples[i-1][1]);return {x:p[0],y:p[1],distance:length}});
  }
  function arteryPoint(branch,t){
    const distance=Math.max(0,Math.min(1,t))*branch.length,s=branch.samples;
    let i=1;while(i<s.length-1&&s[i].distance<distance)i++;
    const a=s[i-1],b=s[i],f=(distance-a.distance)/(b.distance-a.distance||1);
    return {x:a.x+(b.x-a.x)*f,y:a.y+(b.y-a.y)*f,angle:Math.atan2(b.y-a.y,b.x-a.x)};
  }
  function vesselOutline(branch,scale,from=0,to=1){
    const s=branch.samples;
    const edges=s.map(function(p,i){
      const a=s[Math.max(0,i-1)],b=s[Math.min(s.length-1,i+1)],angle=Math.atan2(b.y-a.y,b.x-a.x);
      const width=(branch.width[0]+(branch.width[1]-branch.width[0])*p.distance/branch.length)*scale/2;
      const edge=u=>{const offset=(1-2*u)*width;return [p.x-Math.sin(angle)*offset,p.y+Math.cos(angle)*offset]};
      return [edge(from),edge(to)];
    });
    return edges.map(p=>p[0]).concat(edges.slice().reverse().map(p=>p[1])).map((p,i)=>(i?"L":"M")+p.map(n=>n.toFixed(2)).join(" ")).join(" ")+"Z";
  }
  // V23: arm markers sit in their own groups so they can follow the arm
  // abduction baked into the frames for heavier profiles (same linear shear
  // as fields.arm_shift: dx = 0.21 * mass * drop below the shoulder).
  const armGroups={r:node("g",{id:"bp-arm-r"},$("body-blood-particles")),l:node("g",{id:"bp-arm-l"},$("body-blood-particles"))};
  function particleHost(id,y){
    const side=id.indexOf("right-")===0?"r":id.indexOf("left-")===0?"l":null;
    if(side&&(/brachial|radial|ulnar/.test(id)||(/subclavian/.test(id)&&y>262)))return armGroups[side];
    return $("body-blood-particles");
  }
  const ARM_MASS={lower:[0,0,0,0,0,0],moderate:[.10,.14,.18,.22,.26,.28],larger:[.5,.5,.5,.5,.5,.5],extreme:[1,1.16,1.275,1.39,1.48,1.55]},ARM_X=[0,40,55,70,85,100];
  let renderedArm=-1;
  function renderArmShear(m){
    const tbl=ARM_MASS[m.profile]||ARM_MASS.moderate,x=Math.max(0,Math.min(100,m.x||0));
    let i=0;while(i<ARM_X.length-2&&x>ARM_X[i+1])i++;
    const t=clamp((x-ARM_X[i])/(ARM_X[i+1]-ARM_X[i])),mass=tbl[i]+(tbl[i+1]-tbl[i])*t;
    const armKey=m.profile+":"+mass.toFixed(3);if(armKey===renderedArm)return;renderedArm=armKey;
    const k=.21*mass,pivot=201.4; // shoulder line in overlay space (image y ~247)
    armGroups.r.setAttribute("transform","matrix(1 0 "+(-k).toFixed(4)+" 1 "+(k*pivot).toFixed(2)+" 0)");
    armGroups.l.setAttribute("transform","matrix(1 0 "+k.toFixed(4)+" 1 "+(-k*pivot).toFixed(2)+" 0)");
    // V24: the glycogen arm masks were rendered at each profile's first frame,
    // so they only need the extra abduction since then (image space, shoulder y=247).
    const gk=.21*(mass-tbl[0]),gp=247,gr=document.getElementById("gm-arm-r"),gl=document.getElementById("gm-arm-l");
    gr&&gr.setAttribute("transform","matrix(1 0 "+(-gk).toFixed(4)+" 1 "+(gk*gp).toFixed(2)+" 0)");
    gl&&gl.setAttribute("transform","matrix(1 0 "+gk.toFixed(4)+" 1 "+(-gk*gp).toFixed(2)+" 0)");
  }
  arterialNetwork.forEach(function(branch){
    branch.samples=sampleArtery(branch.points);branch.length=branch.samples[branch.samples.length-1].distance;
    const lumenD=vesselOutline(branch,1),wallD=vesselOutline(branch,1.22);
    const depth=branch.posterior?{mask:"url(#behind-heart-mask)"}:{};
    node("path",{...depth,d:vesselOutline(branch,1.34),fill:"#1b1013","fill-opacity":branch.photoWall?0:.22,transform:"translate(.18 .30)"},$("arterial-shadows"));
    node("path",{...depth,id:"artery-"+branch.id,d:wallD,fill:"#9f5a56","fill-opacity":branch.photoWall?.09:.90,"data-artery":branch.id},$("arterial-walls"));
    node("path",{...depth,d:lumenD,fill:"#7f2630","fill-opacity":branch.photoWall?.16:.94,"data-artery":branch.id},$("arterial-lumens"));
    node("path",{d:lumenD},$("arterial-lumen-clip"));
    // Rounded walls follow the same taper and centerline as the lumen. The
    // photograph supplies coronary walls; fuel markers remain above all
    // material shading, so they are never dimmed by the tissue texture.
    if(!branch.photoWall){
      const material=node("g",{...depth,"data-vessel-surface":branch.id},$("arterial-materials"));
      const angle=arteryPoint(branch,.5).angle,nx=-Math.sin(angle),ny=Math.cos(angle);
      for(let i=0;i<14;i++){
        const u=1-2*(i+.5)/14,z=Math.sqrt(Math.max(0,1-u*u));
        const light=clamp(.18+.68*z-.20*nx*u-.22*ny*u);
        const colour=[90+82*light,40+38*light,39+34*light].map(Math.round).join(",");
        node("path",{d:vesselOutline(branch,1.22,i/14,Math.min(1,(i+1.015)/14)),fill:"rgb("+colour+")","fill-opacity":.82},material);
      }
    }
    const highlight=branch.samples.map((p,i)=>{
      const a=branch.samples[Math.max(0,i-1)],b=branch.samples[Math.min(branch.samples.length-1,i+1)],len=Math.hypot(b.x-a.x,b.y-a.y)||1;
      let nx=-(b.y-a.y)/len,ny=(b.x-a.x)/len;if(nx+ny>0){nx=-nx;ny=-ny}
      const r=(branch.width[0]+(branch.width[1]-branch.width[0])*p.distance/branch.length)*.38;
      return(i?"L":"M")+(p.x+nx*r).toFixed(2)+" "+(p.y+ny*r).toFixed(2);
    }).join(" ");
    node("path",{...depth,d:highlight,stroke:"#e8b8ad","stroke-width":.40,"stroke-opacity":branch.photoWall?0:.14},$("arterial-highlights"));
    const pairs=Math.max(4,Math.ceil(branch.length/18));
    for(let i=0;i<pairs;i++)for(let type=0;type<2;type++){
      const t=(i+(type?.7:.2))/pairs,pos=arteryPoint(branch,t),glucose=type===1;
      const width=branch.width[0]+(branch.width[1]-branch.width[0])*t;
      const radius=Math.min(3.25,width*.32),size=radius*1.28;
      const attrs={...depth,opacity:0,"data-artery":branch.id,"data-fuel":glucose?"glucose":"lipid"};
      const host=particleHost(branch.id,pos.y);
      const dot=glucose?node("rect",{...attrs,x:pos.x-size/2,y:pos.y-size/2,width:size,height:size,rx:.3,fill:"url(#glucose-particle)",transform:"rotate(45 "+pos.x+" "+pos.y+")"},host):node("circle",{...attrs,cx:pos.x,cy:pos.y,r:radius,fill:"url(#lipid-particle)"},host);
      bodyParticles.push({el:dot,glucose:glucose,order:(i*.61803398875)%1,branch:branch.id,t:t,x:pos.x,y:pos.y});
    }
  });
  let renderedSurface=-1,renderedCardiacFat=-1,renderedBelly=-1;
  function renderAnatomy(m){
    renderGlycogen(m);renderArmShear(m);
    const abdominal=abdominalState(m),belly=abdominal.distension;
    if(m.surfaceVolume!==renderedSurface||belly!==renderedBelly){
      adiposePaths.forEach(function(part){
        const points=abdominalSurfacePoints(part.region,belly);
        const surface=points===part.region.points?part.surface:tissueContour(points,fatRegions.indexOf(part.region)*.93);
        const d=part.ribbon(surface,m.surfaceVolume);
        part.tissue.setAttribute("d",d);part.shade.setAttribute("d",d);part.clipShape.setAttribute("d",d);
        part.bands.forEach((band,i)=>band.setAttribute("d",part.ribbon(points,m.surfaceVolume,i/24,Math.min(1,(i+1.025)/24))));
      });
      renderedSurface=m.surfaceVolume;renderedBelly=belly;
    }
    $("subcutaneous-fat").setAttribute("data-added-fat",m.surfaceVolume.toFixed(4));
    const cardiacFat=cardiacFatAmount(m);
    if(cardiacFat!==renderedCardiacFat){
      cardiacFatRegions.forEach(function(part){const d=surfaceRibbon(part.surface,cardiacFat);part.tissue.setAttribute("d",d);part.shade.setAttribute("d",d)});
      $("epicardial-fat").setAttribute("data-added-fat",cardiacFat.toFixed(4));
      renderedCardiacFat=cardiacFat;
    }
    // At the leanest setting there should be no visible visceral-fat pad.
    // Deeper abdominal fat now appears only when the model itself reaches it.
    const v=abdominal.visceralTissue;
    const visceralLeft=fatRibbon([[287,402,0,0],[280,430,6,11],[279,462,10,17],[285,494,12,19],[299,520,8,11],[307,529,0,0]],v);
    const visceralRight=fatRibbon([[397,397,0,0],[404,427,11,6],[405,461,17,10],[399,494,19,12],[385,520,11,8],[375,529,0,0]],v);
    $("visceral-left").setAttribute("d",visceralLeft);$("visceral-left-shade").setAttribute("d",visceralLeft);
    $("visceral-right").setAttribute("d",visceralRight);$("visceral-right-shade").setAttribute("d",visceralRight);
    const apron=[[288,430,0],[304,442,18],[331,448,28],[360,446,27],[383,436,17],[400,423,0]];
    const apronD=v===0?"M0 0Z":smoothOutline(apron.map(p=>[p[0],p[1]-p[2]*v*.12]).concat(apron.slice().reverse().map(p=>[p[0],p[1]+p[2]*v*1.05])));
    $("visceral-apron").setAttribute("d",apronD);$("visceral-apron-shade").setAttribute("d",apronD);
    $("hyperplasia-panel").hidden=m.profile!=="extreme";
    $("hyperplasia-status").textContent=m.hyperplasia===0?"Starting cells":m.hyperplasia<.7?"Recruiting new cells":"Larger cell population";
    $("hyperplasia-svg").setAttribute("aria-label",m.hyperplasia===0?"Schematic starting population of fat cells":"Schematic fat-cell population grows as new cells mature and add storage capacity. Counts are illustrative.");
    adipocyteCells.forEach(function(c,i){
      const growth=i<6?1:clamp(6+24*m.hyperplasia-i);
      const radius=6+4.5*growth;
      c.group.setAttribute("opacity",growth.toFixed(3));
      c.cell.setAttribute("r",radius.toFixed(2));
      c.nucleus.setAttribute("cx",(c.cx+radius*.65).toFixed(2));
      c.nucleus.setAttribute("cy",(c.cy-radius*.36).toFixed(2));
    });
    // Follow the existing depot curves. Soft masks preserve organ shading and edges.
    const liverFatLevel=organFatLevel(m,"liver"),pancreasFatLevel=organFatLevel(m,"pancreas");
    $("liver-tissue").setAttribute("opacity",(.98*Math.pow(liverFatLevel,.56)).toFixed(3));
    $("pancreas-tissue").setAttribute("opacity",(.94*Math.pow(pancreasFatLevel,.53)).toFixed(3));
    $("liver-tissue").setAttribute("data-fat-level",liverFatLevel.toFixed(4));
    $("pancreas-tissue").setAttribute("data-fat-level",pancreasFatLevel.toFixed(4));
    renderOrganFat(m);
    $("muscle-tissue").setAttribute("opacity",clamp((m.muscle-.03)/.97)*.85);
    const circulation=Math.max(Math.sqrt(m.glucose),Math.sqrt(m.lipids)*.75);
    $("vascular-trace").setAttribute("opacity",(.18+.54*circulation).toFixed(3));
    bodyParticles.forEach(function(dot){
      const burden=Math.sqrt(dot.glucose?m.glucose:m.lipids);
      dot.el.setAttribute("opacity",clamp((burden-dot.order)/.12)*(.8+.2*burden));
    });
  }
  function renderBloodParticles(particles,burden){
    const baseline=3,added=(particles.length-baseline)*burden;
    particles.forEach(function(p,i){p.setAttribute("opacity",i<baseline?.86:clamp(added-(i-baseline))*.9)});
  }
  // BEGIN ABDOMINAL VIEW
  // Shared, illustrative shape parameters. These are not volumes, HU values,
  // waist measurements, or a fitted relationship between body shape and A1c.
  function abdominalState(m){
    const visceralStageRaw=clamp(m.visProgress||0);
    const visceralStage=visceralStageRaw<=0?0:(.08+.92*visceralStageRaw);
    const visceral=(m.bellyScale||0)*visceralStage;
    const liver=organFatLevel(m,"liver");
    const pancreas=organFatLevel(m,"pancreas");
    const muscle=clamp((m.muscle-.03)/.97);
    // Visible tissue follows the Visceral marker, not the body-contour gain.
    // All onsets/overlap still come from the existing numerical model. These
    // are rendering amplitudes, not fat percentages or measured volumes.
    const tissueCapacity={lower:.48,moderate:.68,larger:.84};
    const visceralTissue=m.profile==='extreme'?visceral:(tissueCapacity[m.profile]||.68)*visceralStage;
    return {subcutaneous:m.surfaceVolume,visceral,visceralStage,visceralTissue,profile:m.profile,liver,pancreas,muscle,
      distension:visceral};
  }

  // Added tissue occupies the space around ONE fixed organ window. Neither
  // the photograph, organ layers nor vessel network is scaled or displaced.
  const fixedOrganOutline="M278 334 Q332 321 398 337 Q411 354 410 389 L407 438 Q409 480 383 506 Q355 528 326 518 Q293 506 281 472 Q271 441 270 403Z";
  function abdominalWallOffset(y,amount){
    const mid=smooth(335,430,y)*(1-smooth(500,590,y));
    return (18*amount+14*amount*amount)*mid;
  }
  function expandedFatOutline(amount){
    return fixedOrganOutline.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g,function(_,sx,sy){
      const x=Number(sx),y=Number(sy),side=clamp(Math.abs(x-342)/54)*Math.sign(x-342);
      return (x+side*abdominalWallOffset(y,amount)).toFixed(3)+" "+(y+7*amount*smooth(472,542,y)).toFixed(3);
    });
  }
  function abdominalSurfacePoints(region,amount){
    if(region.id!=="flank-left"&&region.id!=="flank-right"&&region.id!=="lower-abdomen")return region.points;
    return region.points.map(p=>{
      const q=p.slice();
      q[0]+=Math.sign(p[0]-346)*abdominalWallOffset(p[1],amount);
      if(region.id==="lower-abdomen")q[1]+=10*amount*smooth(470,544,p[1]);
      return q;
    });
  }
  function renderDeepAbdominalFat(s){
    const added=s.visceral;
    const bed=added<=0?'M0 0Z':expandedFatOutline(added);
    $('deep-abdominal-fat-tissue').setAttribute('d',bed);
    $('deep-abdominal-fat-shade').setAttribute('d',bed);
    $('deep-abdominal-fat-edge').setAttribute('d',bed);
    $('deep-abdominal-fat').setAttribute('opacity',smooth(0,.12,added).toFixed(6));
    $('deep-abdominal-fat').setAttribute('data-added-fat',added.toFixed(6));
  }

  // CT-style axial teaching diagram: anterior at the top, patient's right
  // on the viewer's left. Geometry is explicit and color is an explanatory
  // segmentation overlay, not an actual CT, segmentation, or clinical scan.
  const ctPalette={sat:[240,203,124],vis:[239,155,87],organ:[213,154,234],glycogen:[128,217,200]};
  // Warm intracellular-fat overlays mirror the gold lipid treatment used on
  // the human model while the underlying organ also becomes lower-density.
  const ctOrganFatPaint={
    liver:{wash:[242,183,74],speck:[255,229,156],shadow:[78,55,29],rim:[241,125,102],count:58},
    pancreas:{wash:[237,196,116],speck:[255,237,186],shadow:[82,62,34],rim:[213,154,234],count:38}
  };
  function ctTint(gray,rgb,amount){return "rgb("+rgb.map(c=>Math.round(gray*(1-amount)+c*amount)).join(",")+")"}
  function ctRgba(rgb,alpha){return "rgba("+rgb.join(",")+","+clamp(alpha).toFixed(3)+")"}
  const ctNoise=document.createElement("canvas");ctNoise.width=720;ctNoise.height=560;
  const ctNoiseContext=ctNoise.getContext("2d");
  if(ctNoiseContext){
    const noise=ctNoiseContext.createImageData(720,560);let seed=7717;
    for(let y=0;y<560;y++)for(let x=0;x<720;x++){
      seed=(1664525*seed+1013904223)>>>0;
      const fine=(seed>>>24)/255-.5;
      const broad=Math.sin(x*.107+Math.sin(y*.039)*2)*Math.cos(y*.093-x*.012);
      const v=Math.round(128+fine*76+broad*20),i=4*(y*720+x);
      noise.data[i]=noise.data[i+1]=noise.data[i+2]=v;noise.data[i+3]=92;
    }
    ctNoiseContext.putImageData(noise,0,0);
  }
  function ctContour(rx,front,back){
    const p=new Path2D();
    p.moveTo(180,151-front);
    p.bezierCurveTo(180+rx*.60,151-front-2,180+rx,151-front*.56,180+rx,151);
    p.bezierCurveTo(180+rx,151+back*.65,180+rx*.65,151+back,202,151+back);
    p.bezierCurveTo(192,151+back-1,185,151+back-6,180,151+back-6);
    p.bezierCurveTo(175,151+back-6,168,151+back-1,158,151+back);
    p.bezierCurveTo(180-rx*.65,151+back,180-rx,151+back*.65,180-rx,151);
    p.bezierCurveTo(180-rx,151-front*.56,180-rx*.60,151-front-2,180,151-front);p.closePath();return p;
  }
  function ctOrgan(ctx,path,gray,fat,glycogen,bounds=[180,138,110]){
    const [cx,cy,r]=bounds;
    const shading=ctx.createRadialGradient(cx-r*.2,cy-r*.15,1,cx,cy,r);
    shading.addColorStop(0,ctTint(gray+6,ctPalette.organ,.17*fat));
    shading.addColorStop(.65,ctTint(gray,ctPalette.organ,.17*fat));
    shading.addColorStop(1,ctTint(gray-14,ctPalette.organ,.17*fat));
    ctx.fillStyle=shading;ctx.fill(path);
    ctx.strokeStyle="rgba(199,199,199,.09)";ctx.lineWidth=.65;ctx.stroke(path);
    ctx.save();ctx.clip(path);
    // Glycogen is shown on the figure, not assigned a CT-visible color.
    ctx.globalCompositeOperation="soft-light";
    ctx.drawImage(ctNoise,cx-r,cy-r,2*r,2*r);
    ctx.globalCompositeOperation="source-over";
    ctx.fillStyle="rgba(31,31,34,.055)";
    for(let i=0;i<90;i++){const x=cx-r+((i*71)%197)/197*2*r,y=cy-r+((i*37)%113)/113*2*r;ctx.beginPath();ctx.ellipse(x,y,.6+(i%3)*.34,.4+(i%2)*.28,i*.7,0,Math.PI*2);ctx.fill();}
    ctx.restore();
  }
  function ctEllipse(ctx,x,y,rx,ry,color,rotation=0){
    ctx.beginPath();ctx.ellipse(x,y,rx,ry,rotation,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();
  }
  function ctBowel(ctx,x,y,rx,ry,index){
    ctx.save();ctx.translate(x,y);ctx.rotate(index*.73);
    const loop=new Path2D("M-.9 -.25 C-.86 -.78 -.3 -1 .22 -.83 C.65 -.96 1 -.44 .88 .06 C1 .56 .43 .91 -.1 .86 C-.6 1 -1 .46 -.9 -.25Z");
    ctx.scale(rx,ry);ctx.fillStyle="#88898c";ctx.fill(loop);
    ctx.scale(.72,.65);ctx.fillStyle=index%3===0?"#090a0c":"#414247";ctx.fill(loop);
    ctx.strokeStyle="rgba(158,157,157,.55)";ctx.lineWidth=.13;
    ctx.beginPath();ctx.moveTo(-.66,-.31);ctx.quadraticCurveTo(-.11,-.5,.36,-.09);ctx.moveTo(-.31,.47);ctx.quadraticCurveTo(.1,.15,.58,.3);ctx.stroke();
    ctx.restore();
  }
  // Draw direct, high-contrast labels over both CT-style sections. The label
  // size compensates for the responsive canvas width so the callouts remain
  // readable without changing the panel layout or scan scale.
  function ctLabelFontSize(canvas){
    const measuredWidth=canvas.getBoundingClientRect().width;
    const displayWidth=measuredWidth>=60?measuredWidth:300;
    const desiredCss=Math.max(11,Math.min(12.5,displayWidth*.038));
    return Math.max(11.5,Math.min(34,desiredCss*360/displayWidth));
  }
  function ctRoundRectPath(ctx,x,y,w,h,r){
    const q=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+q,y);ctx.lineTo(x+w-q,y);ctx.quadraticCurveTo(x+w,y,x+w,y+q);ctx.lineTo(x+w,y+h-q);ctx.quadraticCurveTo(x+w,y+h,x+w-q,y+h);ctx.lineTo(x+q,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-q);ctx.lineTo(x,y+q);ctx.quadraticCurveTo(x,y,x+q,y);ctx.closePath();
  }
  function ctCallout(ctx,canvas,label,anchorX,topY,targetX,targetY,color,align){
    const measuredWidth=canvas.getBoundingClientRect().width;
    const displayWidth=measuredWidth>=60?measuredWidth:300;
    const fontSize=ctLabelFontSize(canvas),compact=displayWidth<230&&/ Fat$/.test(label);
    // Narrow scans use two short lines so 11px+ labels never collide.
    const lines=compact?[label.replace(/ Fat$/,"").replace(/^Subcutaneous$/,displayWidth<190?"Subcut.":"Subcutaneous"),"fat"]:[label];
    const padX=Math.max(3.5,fontSize*.30),padY=Math.max(2.6,fontSize*.22),dotR=Math.max(1.8,fontSize*.14),lineH=fontSize*1.03;
    ctx.save();ctx.font="600 "+fontSize+"px Barlow, Inter, Segoe UI, Arial, sans-serif";ctx.textBaseline="middle";ctx.textAlign="left";
    const textW=Math.max.apply(null,lines.map(line=>ctx.measureText(line).width));
    const boxW=padX+dotR*2+fontSize*.27+textW+padX,boxH=padY*2+lineH*lines.length;
    let x=align==="right"?anchorX-boxW:anchorX,y=topY;x=Math.max(3,Math.min(357-boxW,x));y=Math.max(22,Math.min(258-boxH,y));
    const candidates=[[x,y+boxH/2],[x+boxW,y+boxH/2],[x+boxW/2,y],[x+boxW/2,y+boxH]];
    let start=candidates[0],best=Infinity;candidates.forEach(point=>{const d=(point[0]-targetX)**2+(point[1]-targetY)**2;if(d<best){best=d;start=point}});
    ctx.strokeStyle=color;ctx.globalAlpha=.82;ctx.lineWidth=Math.max(.8,fontSize*.065);ctx.beginPath();ctx.moveTo(start[0],start[1]);ctx.lineTo(targetX,targetY);ctx.stroke();
    ctx.fillStyle=color;ctx.beginPath();ctx.arc(targetX,targetY,Math.max(1.35,fontSize*.09),0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=1;ctRoundRectPath(ctx,x,y,boxW,boxH,Math.max(3,fontSize*.22));ctx.fillStyle="rgba(4,9,14,.86)";ctx.fill();ctx.strokeStyle=color;ctx.globalAlpha=.72;ctx.lineWidth=Math.max(.65,fontSize*.045);ctx.stroke();ctx.globalAlpha=1;
    ctx.fillStyle=color;ctx.beginPath();ctx.arc(x+padX+dotR,y+padY+lineH*.5,dotR,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#edf4fb";const tx=x+padX+dotR*2+fontSize*.27;lines.forEach((line,i)=>ctx.fillText(line,tx,y+padY+lineH*(i+.5)));ctx.restore();
  }
  function ctFatMottle(ctx,path,amount,bounds,seedOffset,paint){
    const t=clamp(amount);if(t<=0)return;
    const [cx,cy,rx,ry]=bounds,cfg=paint||ctOrganFatPaint.liver,rootT=Math.sqrt(t);
    ctx.save();ctx.clip(path);

    // A progressive warm wash and visible lipid droplets use the exact same
    // normalized liver/pancreas level as the human model. The darker base
    // underneath preserves the lower-attenuation look of fatty infiltration.
    const wash=ctx.createRadialGradient(cx-rx*.18,cy-ry*.22,1,cx,cy,Math.max(rx,ry));
    wash.addColorStop(0,ctRgba(cfg.wash,.07+.34*rootT));
    wash.addColorStop(.62,ctRgba(cfg.wash,.04+.24*rootT));
    wash.addColorStop(1,ctRgba(cfg.wash,.015+.12*rootT));
    ctx.fillStyle=wash;ctx.fill(path);

    // Lipid droplets appear gradually rather than all at once. Their reveal
    // curve parallels the droplet progression on the front-view organs.
    // V26: patchy (mottled) diffuse change inside the parenchyma
    for(let i=0;i<9;i++){const a=i*2.3999+seedOffset,rr=Math.sqrt(((i*.618034+seedOffset*.3)%1));
      const px=cx+Math.cos(a)*rx*.7*rr,py=cy+Math.sin(a)*ry*.7*rr,pr=Math.max(rx,ry)*(.22+.12*(i%3));
      const g=ctx.createRadialGradient(px,py,0,px,py,pr);g.addColorStop(0,ctRgba(i%3===0?cfg.shadow:cfg.wash,(i%3===0?.05:.04)+(i%3===0?.12:.16)*rootT));g.addColorStop(1,ctRgba(cfg.wash,0));
      ctx.fillStyle=g;ctx.fill(path);}
    ctx.globalCompositeOperation="screen";
    for(let i=0;i<Math.round(cfg.count*2.4);i++){
      const order=(i*.754877666+seedOffset*.113)%1;
      const reveal=clamp((t-order*.90)/.10);if(reveal<=0)continue;
      const angle=i*2.3999632297+seedOffset*1.71;
      const radial=Math.sqrt((i*.61803398875+seedOffset*.137)%1);
      const x=cx+Math.cos(angle)*rx*.86*radial,y=cy+Math.sin(angle)*ry*.82*radial;
      const ex=(.72+(i%5)*.34)*.5,ey=(.48+((i*3)%5)*.23)*.5;
      ctx.save();ctx.translate(x,y);ctx.rotate(angle*.23);
      ctx.fillStyle=ctRgba(cfg.speck,reveal*(.08+.30*rootT));
      ctx.beginPath();ctx.ellipse(0,0,ex,ey,0,0,Math.PI*2);ctx.fill();ctx.restore();
    }

    // A second, darker set of low-attenuation flecks keeps the result from
    // reading as a flat color wash and makes early fatty change visible.
    ctx.globalCompositeOperation="source-over";
    for(let i=0;i<24;i++){
      const order=(i*.682327804+seedOffset*.197)%1;
      const reveal=clamp((t-order*.94)/.12);if(reveal<=0)continue;
      const angle=i*2.129+seedOffset*.93;
      const radial=Math.sqrt((i*.41421356237+seedOffset*.271)%1);
      const x=cx+Math.cos(angle)*rx*.78*radial,y=cy+Math.sin(angle)*ry*.74*radial;
      ctx.fillStyle=ctRgba(cfg.shadow,reveal*(.025+.15*rootT));
      ctx.beginPath();ctx.ellipse(x,y,.55+(i%4)*.31,.38+((i*2)%4)*.24,angle*.16,0,Math.PI*2);ctx.fill();
    }

    ctx.strokeStyle=ctRgba(cfg.speck,.02+.07*rootT);ctx.lineWidth=.5;
    for(let i=0;i<6;i++){
      const y=cy-ry*.62+i*ry*.25;
      ctx.beginPath();ctx.moveTo(cx-rx*.7,y);
      ctx.bezierCurveTo(cx-rx*.2,y-2,cx+rx*.2,y+2,cx+rx*.72,y);ctx.stroke();
    }
    ctx.restore();

    // A subtle organ-specific rim makes the altered tissue easy to locate at
    // smaller embedded sizes without changing the CT geometry.
    ctx.save();ctx.strokeStyle=ctRgba(cfg.rim,.10+.35*t);ctx.lineWidth=.65+.22*t;ctx.stroke(path);ctx.restore();
  }
  function drawCTLabels(ctx,canvas,s,geometry){
    const {innerRx,front,back,sat,v,ctV,left,lift}=geometry;
    const subcutaneousX=180-(innerRx+9+17*sat);
    ctCallout(ctx,canvas,"Liver",7,31,130+left,116+lift,"#f17d66","left");
    ctCallout(ctx,canvas,"Pancreas",353,31,194,138-7*ctV,"#d59aea","right");
    ctCallout(ctx,canvas,"Subcutaneous Fat",7,226,subcutaneousX,151,"#f0cb7c","left");
    ctCallout(ctx,canvas,"Visceral Fat",353,226,260+10*ctV,177-6*ctV,"#ef9b57","right");
  }
  function drawAbdominalCT(canvas,m){
    const ctx=canvas.getContext("2d");if(!ctx)return;
    const s=abdominalState(m),v=s.distension,sat=s.subcutaneous;
    const ctExpansion={lower:.92,moderate:1.30,larger:1.90,extreme:.42}[s.profile]||1;
    const ctV=Math.min(1,v*ctExpansion);
    const profileAnterior={lower:1,moderate:1.08,larger:1.24,extreme:.86}[s.profile]||1;
    const profileLateral={lower:1,moderate:1.10,larger:1.26,extreme:.88}[s.profile]||1;
    // Both panels retain the same field of view. No automatic zoom disguises
    // growth. The abdominal wall remains BETWEEN the two adipose depots.
    // Moderate and larger thresholds should show more obvious deep-abdominal
    // expansion, with widening fat planes and more spacing between organs.
    const innerRx=92+(26*profileLateral)*ctV+6*ctV*ctV,front=65+(44*profileAnterior)*ctV+11*ctV*ctV*profileAnterior,back=65+7*ctV;
    const outer=ctContour(innerRx+12+34*sat,front+13+28*sat,back+12+22*sat);
    const wall=ctContour(innerRx+6,front+6,back+6);
    const cavity=ctContour(innerRx,front,back);
    ctx.setTransform(2,0,0,2,0,0);ctx.clearRect(0,0,360,280);
    ctx.fillStyle="#05090d";ctx.fillRect(0,0,360,280);
    ctx.fillStyle=ctTint(41,ctPalette.sat,.025+.12*sat);ctx.fill(outer);
    ctx.strokeStyle="#959595";ctx.lineWidth=1.15;ctx.stroke(outer);
    ctx.save();ctx.clip(outer);
    // Fine septa within the outer ring stay still as its area expands.
    ctx.strokeStyle="rgba(178,174,166,.13)";ctx.lineWidth=.5;
    for(let i=0;i<150;i++){const x=31+(i*53)%300,y=32+(i*31)%218;ctx.beginPath();ctx.moveTo(x,y);ctx.bezierCurveTo(x+4,y-3,x+7,y+4,x+15,y+1);if(i%3===0){ctx.moveTo(x+7,y+2);ctx.quadraticCurveTo(x+7,y+7,x+3,y+10)}ctx.stroke();}
    ctx.restore();
    ctx.fillStyle=ctTint(113,ctPalette.organ,.1*s.muscle);ctx.fill(wall);
    ctx.strokeStyle="rgba(191,191,191,.26)";ctx.lineWidth=.6;ctx.stroke(wall);
    [1.8,4.2].forEach(d=>{ctx.strokeStyle="rgba(53,54,56,.35)";ctx.lineWidth=.65;ctx.stroke(ctContour(innerRx+d,front+d,back+d))});
    const visceralTint=.34*Math.pow(s.visceralTissue,.54)+.05*s.visceralTissue;ctx.fillStyle=ctTint(31,ctPalette.vis,visceralTint);ctx.fill(cavity);
    ctx.save();ctx.clip(cavity);
    // The deep compartment expands mostly anteriorly. Organs retain their
    // sizes, with modest displacement; fat occupies the intervening space.
    const organScale={lower:.90,moderate:1.06,larger:1.24,extreme:.72}[s.profile]||1;
    const lift=-(13+6*organScale)*ctV-3*ctV*ctV,left=-(8+5*organScale)*ctV,right=(8+5*organScale)*ctV;
    // Separate bowel loops move apart as mesenteric fat increases.
    [[163,112,8,6],[192,123,9,6],[153,153,9,7],[210,158,11,7],[155,172,7,6],[213,179,9,7],[177,153,7,5],[193,109,7,5]].forEach((p,i)=>{
      const x=p[0]+(p[0]-183)*(.30*ctV+.07*ctV*ctV)*profileLateral,
            y=p[1]-(18+7*organScale)*ctV-(4*ctV*ctV)+Math.abs(p[0]-183)*.02*ctV;
      ctBowel(ctx,x,y,p[2],p[3],i);
    });
    // Mesenteric vessels remain fine bright branches amid darker fat.
    ctx.strokeStyle="rgba(175,173,171,.34)";ctx.lineWidth=.65;
    for(let i=0;i<8;i++){const a=3.4+i*.3;ctx.beginPath();const ox=179+Math.cos(a)*12,oy=150+Math.sin(a)*12-(8+4*organScale)*ctV;ctx.moveTo(ox,oy);ctx.bezierCurveTo(ox-5,oy-7,183+Math.cos(a)*29,149+Math.sin(a)*31-(12+6*organScale)*ctV,180+Math.cos(a)*(43+(28*profileLateral)*ctV),152+Math.sin(a)*(40+(28*profileAnterior)*ctV));ctx.stroke();}

    ctx.fillStyle=ctTint(40,ctPalette.vis,.22+.21*s.visceralTissue);
    ctx.beginPath();ctx.ellipse(182,154-(12+3*organScale)*ctV,36+18*ctV*profileLateral,24+14*ctV*profileAnterior,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=ctTint(46,ctPalette.vis,.16+.17*s.visceralTissue);
    ctx.beginPath();ctx.ellipse(182,168-(10+2*organScale)*ctV,51+23*ctV*profileLateral,33+18*ctV*profileAnterior,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="rgba(245,212,138,"+(.06+.12*s.visceralTissue).toFixed(3)+")";
    ctx.beginPath();ctx.ellipse(182,173-8*ctV,24+12*ctV,14+8*ctV,0,0,Math.PI*2);ctx.fill();
    // V26: visceral fat as lobulated tissue with fine septa/vessels (not a flat mass)
    if(s.visceralTissue>.02){const vt=Math.pow(s.visceralTissue,.6),cyv=160-(11+3*organScale)*ctV,ax=51+23*ctV*profileLateral,ay=33+18*ctV*profileAnterior;
      ctx.save();ctx.beginPath();ctx.ellipse(182,cyv,ax,ay,0,0,Math.PI*2);ctx.clip();
      for(let i=0;i<220;i++){const a=i*2.3999632297,r=Math.sqrt((i+.5)/220);const x=182+Math.cos(a)*ax*r,y=cyv+Math.sin(a)*ay*r,rr=1.6+(i%4)*.7;
        ctx.fillStyle=i%3===0?"rgba(20,12,6,"+(.10*vt).toFixed(3)+")":"rgba(252,214,140,"+(.07*vt).toFixed(3)+")";ctx.beginPath();ctx.ellipse(x,y,rr,rr*.8,a,0,Math.PI*2);ctx.fill();}
      ctx.strokeStyle="rgba(190,186,180,"+(.06+.16*vt).toFixed(3)+")";ctx.lineWidth=.45;
      for(let i=0;i<14;i++){const a=i*.45+.2,x0=182+Math.cos(a*3)*8,y0=cyv+4;ctx.beginPath();ctx.moveTo(x0,y0);
        ctx.bezierCurveTo(x0+Math.cos(a*2.1)*ax*.4,y0+Math.sin(a*1.7)*ay*.5,182+Math.cos(a*2.6)*ax*.8,cyv+Math.sin(a*2.3)*ay*.8,182+Math.cos(a*2.6+.4)*ax,cyv+Math.sin(a*2.3+.3)*ay);ctx.stroke();}
      ctx.restore();}
    ctx.save();ctx.translate(left,lift);
    const liverPath=new Path2D("M92 111 C96 96 108 91 119 90 Q132 86 143 91 Q166 91 187 100 Q202 111 184 118 Q170 121 147 127 Q139 141 120 151 Q104 158 96 143 Q87 128 92 111Z");
    ctOrgan(ctx,liverPath,136-34*Math.pow(s.liver,.72),0,0,[130,116,55]);
    ctFatMottle(ctx,liverPath,s.liver,[137,119,48,30],1.7,ctOrganFatPaint.liver);
    // Branching vessels are embedded in the liver, not a second organ.
    ctx.strokeStyle="rgba(58,56,58,.34)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(147,119);ctx.quadraticCurveTo(130,124,116,116);ctx.quadraticCurveTo(110,112,107,107);ctx.moveTo(130,121);ctx.quadraticCurveTo(121,133,106,141);ctx.moveTo(144,119);ctx.quadraticCurveTo(155,106,173,103);ctx.stroke();
    ctx.restore();
    ctx.save();ctx.translate(right,lift);
    ctx.save();ctx.translate(5,13); // anatomy pass: spleen sits posterolateral (ribs 9-11), behind the stomach, lateral to the left kidney
    ctOrgan(ctx,new Path2D("M252 111 Q261 108 266 117 C276 132 267 144 265 151 Q259 161 252 155 C242 142 242 133 245 120 Q247 113 252 111Z"),141,0,0,[257,135,24]);ctx.restore();
    // Stomach: a wall around dark gas/fluid, on the patient's left.
    ctOrgan(ctx,new Path2D("M206 99 C216 90 236 93 242 104 Q250 116 235 126 Q220 132 204 122 Q197 112 206 99Z"),122,0,0,[222,110,26]);
    ctx.fillStyle="#111315";ctx.fill(new Path2D("M207 101 Q220 94 234 101 Q241 102 241 113 L206 115 Q201 109 207 101Z"));
    ctx.fillStyle="#525356";ctx.fill(new Path2D("M206 115 L241 113 Q233 128 218 124 Q209 124 206 115Z"));
    ctx.strokeStyle="#979797";ctx.lineWidth=.9;ctx.beginPath();ctx.moveTo(207,120);ctx.quadraticCurveTo(222,118,235,121);ctx.stroke();
    ctx.restore();
    // Kidneys, psoas muscles, aorta and IVC remain posterior landmarks.
    [-1,1].forEach(side=>{
      ctx.save();ctx.translate(180+side*(51+(5+4*profileLateral)*ctV),164-2*ctV);ctx.scale(side,1);
      ctOrgan(ctx,new Path2D("M-7 -16 C9 -22 20 -10 18 6 Q15 23 1 22 Q-12 19 -10 9 Q1 8 0 0 Q-9 -5 -7 -16Z"),146,0,0,[4,2,25]);
      ctx.fillStyle="#797b7c";ctx.fill(new Path2D("M-3 -10 Q8 -14 12 -4 L9 2 L12 10 Q8 17 1 16 L-3 11 L3 7 L2 0Z"));
      ctx.fillStyle="#b5b5b2";ctx.fill(new Path2D("M-5 -3 Q5 0 4 5 L0 9 L-6 6Z"));
      ctx.restore();
      ctx.save();ctx.translate(180+side*21,183);ctx.scale(side*.6,.62);ctOrgan(ctx,new Path2D("M-7 -19 Q5 -24 11 -10 Q14 2 8 19 Q1 27 -8 19 Q-14 11 -11 -2Z"),112,s.muscle,0,[0,0,26]);ctx.restore(); // anatomy pass: psoas is still small at L1 (it arises T12-L5 and enlarges caudally)
    });
    // Pancreas lies behind the stomach, in front of the central vessels.
    ctx.save();ctx.translate(0,-7*ctV);
    const pancreasPath=new Path2D("M154 132 Q159 125 165 129 L174 132 Q183 129 189 135 Q200 138 210 132 L223 128 Q232 123 236 130 Q231 138 220 140 Q210 147 203 143 Q192 150 181 144 Q173 143 169 148 Q158 151 153 144 Q148 139 154 132Z");
    ctOrgan(ctx,pancreasPath,132-28*Math.pow(s.pancreas,.72),0,0,[189,137,48]);
    ctFatMottle(ctx,pancreasPath,s.pancreas,[194,137,42,10],3.1,ctOrganFatPaint.pancreas);ctx.restore();
    // anatomy pass: diaphragmatic crura wrap the aorta at L1 (right crus larger)
    ctEllipse(ctx,180,170,3.6,9,ctTint(108,ctPalette.organ,0),.35);ctEllipse(ctx,198,170,3,8,ctTint(108,ctPalette.organ,0),-.35);
    ctEllipse(ctx,189,164,6.2,6.2,"#b5b5b5");ctEllipse(ctx,169,162,8,5,"#8a8a8b",.2);
    ctx.restore();
    // Lumbar vertebra, canal, posterior elements and paraspinal muscle.
    [-1,1].forEach(side=>{ctx.save();ctx.translate(180+side*27,209);ctx.scale(side,1);ctOrgan(ctx,new Path2D("M-12 -13 Q-6 -20 4 -17 Q18 -13 20 -1 Q17 13 5 15 Q-12 15 -15 6 Q-19 -6 -12 -13Z"),112,s.muscle,0,[0,0,25]);ctx.restore();});
    const vertebra=new Path2D("M165 175 Q178 168 192 174 Q199 177 198 186 Q197 195 188 197 L173 197 Q163 195 162 186 Q161 179 165 175Z");
    ctOrgan(ctx,vertebra,215,0,0,[180,184,23]);
    const marrow=new Path2D("M167 178 Q179 171 191 177 Q197 180 194 190 Q190 195 179 194 Q165 196 165 186Z");
    ctOrgan(ctx,marrow,146,0,0,[180,184,17]);ctx.save();ctx.clip(marrow);
    for(let i=0;i<58;i++){ctx.fillStyle=i%3===0?"#b8b9b6":"#8a8c8d";ctx.fillRect(164+(i*13)%32,174+(i*7)%22,.5+(i%3)*.3,.6+(i%2)*.4)}ctx.restore();
    // Pedicles, laminae and spinous process surround a darker spinal canal.
    ctOrgan(ctx,new Path2D("M166 191 L171 194 L171 201 Q181 208 190 200 L190 194 L196 191 L198 196 L210 199 L211 203 L196 201 Q193 206 185 211 L184 223 Q181 227 177 223 L177 211 Q166 209 164 201 L150 204 L148 200 L163 196Z"),191,0,0,[181,204,33]);
    ctEllipse(ctx,181,200,6.5,4.5,"#42464a");
    // Paired rectus muscles follow the expanding anterior abdominal wall.
    [-1,1].forEach(side=>ctEllipse(ctx,180+side*(13+2*ctV),149-front,11,3.3,ctTint(127,ctPalette.organ,.12*s.muscle),side*.1));
    ctx.save();ctx.clip(outer);ctx.globalCompositeOperation="soft-light";ctx.drawImage(ctNoise,0,0,360,280);ctx.restore();
    ctx.fillStyle="#c9d2dd";ctx.font="600 13px Barlow, Arial, sans-serif";ctx.textAlign="center";
    ctx.fillText("FRONT",180,15);ctx.fillText("BACK",180,270);ctx.fillText("R",13,149);ctx.fillText("L",347,149);
    drawCTLabels(ctx,canvas,s,{innerRx,front,back,sat,v,ctV,left,lift});
    // No numeric dimensions: this is a shared illustrative field, not a scan.
    canvas.dataset.subcutaneous=sat.toFixed(4);canvas.dataset.visceral=s.visceral.toFixed(4);
    canvas.dataset.liver=s.liver.toFixed(4);canvas.dataset.pancreas=s.pancreas.toFixed(4);
    canvas.dataset.visceralTissue=s.visceralTissue.toFixed(8);canvas.dataset.visceralStage=s.visceralStage.toFixed(8);
    canvas.dataset.profile=m.profile;canvas.dataset.sliderValue=m.x.toFixed(1);
    canvas.dataset.cavityWidth=(2*innerRx).toFixed(3);canvas.dataset.frontDepth=front.toFixed(3);
  }
  let ctBaselineDrawn=false;
  function renderAbdominalView(m){
    const s=abdominalState(m);
    renderDeepAbdominalFat(s);
    if(!ctBaselineDrawn){drawAbdominalCT($("ct-baseline"),model(0,1));ctBaselineDrawn=true;}
    drawAbdominalCT($("ct-current"),m);
    $("ct-current-value").textContent=Math.round(m.x)+" / 100";
    const outer=s.subcutaneous<.02?"Baseline":s.subcutaneous<.35?"Building":s.subcutaneous<.7?"Expanded":"Much thicker";
    const inner=s.visceral<.01?"Baseline":s.visceral<.15?"Slight rise":s.visceral<.6?"Expanding":"Marked expansion";
    $("ct-outer-value").textContent=outer;$("ct-inner-value").textContent=inner;
    const liverState=s.liver<.02?"Baseline":s.liver<.35?"Early fatty change":s.liver<.7?"Increasing fatty change":"Marked fatty change";
    const pancreasState=s.pancreas<.02?"Baseline":s.pancreas<.35?"Early fatty change":s.pancreas<.7?"Increasing fatty change":"Marked fatty change";
    $("ct-organ-fat-value").textContent="Liver: "+liverState+" · Pancreas: "+pancreasState;
    $("ct-current").setAttribute("aria-label","Illustrative labeled axial abdominal section at fuel "+Math.round(m.x)+" of 100 for the "+m.profileLabel+" preset. Subcutaneous fat: "+outer+". Visceral fat: "+inner+". Liver: "+liverState+". Pancreas: "+pancreasState+". The matching Normal section remains fixed and both use the same scale.");
    $("abdomen-caption").textContent=s.visceral>.15?"Added visceral fat fills the expanding space around the organs. The organs keep their shape as the belly becomes rounder.":m.profile==="extreme"&&m.fatLoad>35?"Most growth in this example is under the skin. The deep abdominal compartment increases only slightly.":m.x===0?"At the leanest starting point there is essentially no visible added fat inside the abdomen.":"The outer layer grows first in this teaching sequence. Added visceral fat begins only at the Around organs marker.";
  }
  // V20: CT rendering is independent of the remaining slider-driven panels.
  // Report a genuine CT failure rather than silently freezing the fuel reserve.
  let lastCTRenderError="";
  function renderAbdominalViewSafely(m){
    const status=$("ct-render-status");
    try{
      renderAbdominalView(m);
      status.hidden=true;status.textContent="";
      delete $("ct-current").dataset.renderError;
      lastCTRenderError="";
    }catch(error){
      const message=error&&error.message?error.message:String(error);
      status.textContent="The CT view could not update and may show an earlier frame. The slider, HbA1c and fuel reserve remain active. Move the slider to retry or reload the page.";
      status.hidden=false;
      $("ct-current").dataset.renderError=message;
      if(message!==lastCTRenderError)console.error("CT rendering failed:",error);
      lastCTRenderError=message;
    }
  }
  // END ABDOMINAL VIEW


  // Atlas viewer: the supplied Body Composition V8 meshes and rendering engine.
  let pft3d=null,atlasFrame=0,pendingAtlas=null,atlasState=null,autoFrame=0,autoTime=0,autoRotate=false;
  const stage3d=$("pft3d-stage"),canvas3d=$("pft3d-canvas");
  function setRendererMode(mode){
    const renderer=mode==='3d'?'3d':'2d';
    stage3d.dataset.renderer=renderer;
    root.querySelectorAll('[data-renderer-mode]').forEach(btn=>{const active=btn.dataset.rendererMode===renderer;btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active))});
    if(renderer!=='3d')stopRotation();else initializeAtlas();
  }
  root.querySelectorAll('[data-renderer-mode]').forEach(btn=>btn.addEventListener('click',()=>setRendererMode(btn.dataset.rendererMode)));
  setRendererMode('2d');
  function graphicsError(error){
    stage3d.dataset.ready="false";stage3d.dataset.error="true";setRendererMode('2d');
    $('view-status').textContent='3D graphics are unavailable in this browser. The 2D model and all controls remain available.';
    $("pft3d-status").textContent="3D unavailable · 2D view shown";
    stage3d.querySelector('.pft3d-loading').textContent="3D graphics unavailable. The original 2D illustration is shown instead.";
    console.warn('Atlas graphics unavailable:',error?.message||error);
    // V23: say so visibly instead of silently showing 2D
    const n=$('pft3d-notice');
    if(n){const local=location.protocol==='file:';const why=String(error&&error.message||error||'unknown error');
      n.querySelector('.pft3d-notice-text').textContent=(/webgl/i.test(why)?'3D needs WebGL, which this browser or device has turned off. ':'The 3D model could not be loaded here ('+why+'). ')+
        (local?'This page was opened directly from a file; if your browser blocks local files, open the hosted page or run a local web server. ':'')+'You are seeing the 2D figure.';
      n.hidden=false;}
  }
  function stopRotation(){autoRotate=false;$("pft3d-auto").classList.remove('active');$("pft3d-auto").setAttribute('aria-pressed','false');cancelAnimationFrame(autoFrame);autoFrame=0}
  function rotateFrame(now){
    if(!autoRotate||!pft3d||document.hidden){autoTime=now;if(autoRotate)autoFrame=requestAnimationFrame(rotateFrame);return}
    const dt=Math.min(.05,(now-autoTime)/1000);autoTime=now;pft3d.rotateBy(dt*.25);autoFrame=requestAnimationFrame(rotateFrame);
  }
  function selectCamera(view){
    if(!pft3d)return;stopRotation();pft3d.setView(view);
    root.querySelectorAll('[data-pft3d-view]').forEach(b=>{const active=b.dataset.pft3dView===view;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
  }
  // V21: nothing 3D is downloaded until the reader taps 3D.
  let atlasScripts=null;
  function loadScript(src){return new Promise((resolve,reject)=>{const el=document.createElement("script");el.src=src;el.async=true;el.onload=resolve;el.onerror=()=>reject(new Error("Could not load "+src));document.head.appendChild(el)})}
  function loadAtlasScripts(){
    const cfg=window.PFT_CONFIG||{};
    if(!atlasScripts)atlasScripts=(window.AnatomyThree?Promise.resolve():loadScript(cfg.threeScript||"assets/vendor/three-anatomy.min.js"))
      .then(()=>window.Anatomy3D?null:loadScript(cfg.anatomyScript||"assets/js/anatomy-pft.js"));
    return atlasScripts;
  }
  function initializeAtlas(){
    if(pft3d){if(pendingAtlas)pft3d.update(pendingAtlas);return;}
    if(!window.Anatomy3D||!window.AnatomyThree){
      $("pft3d-status").textContent="Loading 3D…";
      loadAtlasScripts().then(()=>{if(stage3d.dataset.renderer==='3d')initializeAtlas()}).catch(error=>{atlasScripts=null;graphicsError(error)});
      return;
    }
    try{
    pft3d=window.Anatomy3D.create(canvas3d,{
      onReady(){
        stage3d.dataset.ready='true';delete stage3d.dataset.error;if($('pft3d-notice'))$('pft3d-notice').hidden=true;
        $("pft3d-status").textContent='3D anatomy · drag to rotate · scroll to zoom';
      },onError:graphicsError,
      onPick(name){$("pft3d-selection").textContent=name||'Select an anatomical structure to identify it.'}
    });
    pft3d.setLayer('composition',.86);pft3d.setView('three');
    if(pendingAtlas)pft3d.update(pendingAtlas);
    }catch(error){graphicsError(error)}
  }
  // V32: 3D is the primary view. The 2D Blender frames are an automatic fallback
  // for no-WebGL, data-saver or low-power devices. ?view=2d / ?view=3d override;
  // a manual toggle choice is remembered.
  function pickRenderer(){
    try{const q=new URLSearchParams(location.search).get('view');if(q==='2d'||q==='3d')return q}catch(e){}
    try{const s=localStorage.getItem('pft-renderer');if(s==='2d'||s==='3d')return s}catch(e){}
    const c=window.PFT_CONFIG||{};if(!(c.models&&c.models.skin&&c.models.organs))return '2d';
    try{const t=document.createElement('canvas');const gl=t.getContext('webgl2')||t.getContext('webgl');if(!gl)return '2d';
      const ext=gl.getExtension('WEBGL_lose_context');if(ext)ext.loseContext();}catch(e){return '2d'}
    const n=navigator,conn=n.connection||{};
    if(conn.saveData)return '2d';
    if(n.deviceMemory&&n.deviceMemory<3)return '2d';
    if(n.hardwareConcurrency&&n.hardwareConcurrency<4)return '2d';
    return '3d';
  }
  root.querySelectorAll('[data-renderer-mode]').forEach(btn=>btn.addEventListener('click',()=>{try{localStorage.setItem('pft-renderer',btn.dataset.rendererMode)}catch(e){}}));
  // V32: slow-load / lag watchdog -> "Having trouble loading? Try 2D view".
  const qp=(()=>{try{return new URLSearchParams(location.search)}catch(e){return new URLSearchParams()}})();
  const SLOW_MS=Number(qp.get('pft3dtimeout'))||6000, simLag=qp.get('pftlag')==='1', noLag=qp.get('pftlag')==='0';
  let slowTimer=0,lagOn=false,lagDismissed=false;
  const trouble=$('pft3d-trouble');
  // V32i: the notice is a slim banner placed just below the 3D stage, so it never covers the model or its controls.
  if(trouble&&stage3d&&trouble.parentNode===stage3d){(stage3d.closest('.anatomy-layout')||stage3d).after(trouble);trouble.setAttribute('role','status');trouble.setAttribute('aria-live','polite')}
  function showTrouble(kind){
    if(!trouble||stage3d.dataset.renderer!=='3d')return;
    if(kind!=='lag')stopRotation();
    trouble.dataset.kind=kind;
    trouble.querySelector('.pft3d-trouble-text').textContent=kind==='lag'?'3D is running slowly on this device. Try 2D view?':'Having trouble loading? Try 2D view';
    trouble.hidden=false;stage3d.dataset.trouble=kind;
  }
  function hideTrouble(){if(trouble)trouble.hidden=true;delete stage3d.dataset.trouble}
  if(trouble){
    trouble.querySelector('[data-trouble-2d]').addEventListener('click',()=>{try{localStorage.setItem('pft-renderer','2d')}catch(e){}hideTrouble();setRendererMode('2d');$('view-status').textContent='Switched to the 2D view. Use the 3D button to try again.'});
    trouble.querySelector('[data-trouble-wait]').addEventListener('click',()=>{lagDismissed=true;hideTrouble();if(stage3d.dataset.ready!=='true')slowTimer=setTimeout(()=>{if(stage3d.dataset.ready!=='true')showTrouble('slow')},SLOW_MS)});
  }
  function armWatchdog(){
    clearTimeout(slowTimer);
    if(stage3d.dataset.renderer!=='3d'||stage3d.dataset.ready==='true')return;
    slowTimer=setTimeout(()=>{if(stage3d.dataset.ready!=='true')showTrouble('slow')},SLOW_MS);
  }
  // V32i lag rule: measured on the real frame rate after load settles (10 s grace, shader-compile spikes and
  // throttled/background gaps > 1 s ignored); offer 2D only if the MEDIAN frame time over a rolling 4 s window stays
  // above 120 ms (< ~8 fps) continuously for 6 s. Startup spikes alone can never trigger it.
  let simSpike=qp.get('pftspike')==='1'?6:0;
  const LAG_GRACE=Number(qp.get('pftlaggrace'))||10000, LAG_SUSTAIN=Number(qp.get('pftlagsustain'))||6000;
  function lagProbe(){
    if(lagOn)return;lagOn=true;let last=performance.now(),readyAt=0,win=[],slowSince=0;
    const tick=now=>{
      if(stage3d.dataset.renderer!=='3d'||lagDismissed||noLag){lagOn=false;return}
      if(simLag){const t=performance.now();while(performance.now()-t<130){}}
      if(simSpike&&stage3d.dataset.ready==='true'&&simSpike--){const t=performance.now();while(performance.now()-t<(simSpike?400:2500)){}}   // test hook: startup stalls
      const dt=now-last;last=now;
      if(document.hidden||stage3d.dataset.ready!=='true'){readyAt=0;win=[];slowSince=0;requestAnimationFrame(tick);return}
      if(!readyAt)readyAt=now;
      if(now-readyAt<LAG_GRACE||dt>1000){requestAnimationFrame(tick);return}
      win.push([now,dt]);while(win.length&&now-win[0][0]>4000)win.shift();
      if(now-readyAt>=LAG_GRACE+4000){
        const a=win.map(w=>w[1]).sort((x,y)=>x-y),med=a[a.length>>1];stage3d.dataset.frameMs=Math.round(med);
        if(med>120){if(!slowSince)slowSince=now;if(now-slowSince>=LAG_SUSTAIN){showTrouble('lag');lagOn=false;return}}else slowSince=0;
      }
      requestAnimationFrame(tick);
    };requestAnimationFrame(tick);
  }
  const _srm=setRendererMode;
  setRendererMode=function(mode){_srm(mode);if(mode==='3d'){armWatchdog();lagProbe()}else{clearTimeout(slowTimer);hideTrouble()}};
  new MutationObserver(()=>{if(stage3d.dataset.ready==='true'){clearTimeout(slowTimer);if(stage3d.dataset.trouble==='slow')hideTrouble()}}).observe(stage3d,{attributes:true,attributeFilter:['data-ready']});
  stage3d.dataset.autoRenderer=pickRenderer();
  setRendererMode(stage3d.dataset.autoRenderer);
    root.querySelectorAll('[data-pft3d-view]').forEach(btn=>btn.addEventListener('click',()=>selectCamera(btn.dataset.pft3dView)));
    root.querySelectorAll('[data-pft3d-mode]').forEach(btn=>btn.addEventListener('click',()=>{
      if(!pft3d)return;stopRotation();const mode=btn.dataset.pft3dMode;
      stage3d.dataset.mode=mode;
      pft3d.setLayer(mode==='cut'?'internal':mode==='skin'?'external':'composition',Number($("pft3d-opacity").value));
      pft3d.setFraming(mode==='cut'?'abdomen':'full');
      $("pft3d-framing").textContent=mode==='cut'?'Whole body':'Zoom abdomen';$("pft3d-framing").setAttribute('aria-pressed',String(mode==='cut'));
      if(mode==='cut')selectCamera('three');
      root.querySelectorAll('[data-pft3d-mode]').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn))});
      $("pft3d-opacity-row").hidden=mode==='skin';
      $("pft3d-selection").textContent=mode==='cut'?'Click the liver, pancreas, visceral fat, or bowel to identify it.':'Select an anatomical structure to identify it.';
    }));
    $("pft3d-auto").addEventListener('click',function(){
      if(!pft3d)return;if(autoRotate){stopRotation();return}autoRotate=true;this.classList.add('active');this.setAttribute('aria-pressed','true');autoTime=performance.now();autoFrame=requestAnimationFrame(rotateFrame);
    });
    canvas3d.addEventListener('pointerdown',stopRotation);
    $("pft3d-opacity").addEventListener('input',()=>{
      if(!pft3d)return;const mode=stage3d.dataset.mode;pft3d.setLayer(mode==='cut'?'internal':mode==='skin'?'external':'composition',Number($("pft3d-opacity").value));
    });
    $("pft3d-framing").addEventListener('click',function(){if(!pft3d)return;const close=pft3d.framing!=='abdomen';pft3d.setFraming(close?'abdomen':'full');this.textContent=close?'Whole body':'Zoom abdomen';this.setAttribute('aria-pressed',String(close))});
  function updatePFT3D(m){
    const s=abdominalState(m);atlasState={...s,slider:m.x,stage:m.stage,marks:m.marks.slice(),a1c:m.a1c};
    pendingAtlas={sex:'male',profile:m.profile,slider:m.x,glycogenMuscle:m.glycogenMuscle,glycogenLiver:m.glycogenLiver,glycogenPhase:m.glycogenPhase,hyperplasia:m.hyperplasia,bodyFat:12+35*s.subcutaneous,baselineLeanRatio:0,groupRatios:{arms:0,legs:0,chest:0,back:0},depots:{visceral:s.visceral,liver:s.liver,pancreas:s.pancreas},pftFat:{subcutaneous:s.subcutaneous,visceral:s.visceral,visceralTissue:s.visceralTissue,liver:s.liver,pancreas:s.pancreas}};
    if(pft3d&&stage3d.dataset.renderer==='3d'&&!atlasFrame)atlasFrame=requestAnimationFrame(()=>{atlasFrame=0;if(pft3d&&pendingAtlas)pft3d.update(pendingAtlas)});
    stage3d.dataset.slider=String(m.x);stage3d.dataset.subcutaneous=s.subcutaneous.toFixed(8);stage3d.dataset.visceral=s.visceral.toFixed(8);stage3d.dataset.liver=s.liver.toFixed(8);stage3d.dataset.pancreas=s.pancreas.toFixed(8);stage3d.dataset.visceralTissue=s.visceralTissue.toFixed(8);
    $("pft3d-profile").textContent=m.profileLabel+' · added fat, not measured body fat';
    $("pft3d-sat-bar").style.width=(100*s.subcutaneous).toFixed(2)+'%';$("pft3d-vis-bar").style.width=(100*s.visceral).toFixed(2)+'%';
    const burden=v=>v<=.000001?'None added':v<.08?'Small':v<.35?'Building':'Larger';
    $("pft3d-sat-text").textContent=burden(s.subcutaneous);$("pft3d-vis-text").textContent=burden(s.visceral);
    $("pft3d-depth-text").textContent=m.glycogenPhase?'Glycogen':m.profile==='extreme'&&s.subcutaneous>.55?'Mostly under skin':s.visceral===0?'Under skin only':'Inside + under skin';
    $("pft3d-side-hint").classList.toggle('show',s.visceral>.05);
    $("pft3d-sequence").textContent=m.glycogenPhase?'Glycogen prelude · no added fat yet':m.profile==='extreme'?'Hyperplasia · mostly under the skin; only slight late visceral fat':s.pancreas>0?'Visceral + liver + pancreas fat keep increasing':s.liver>0?'Liver turning yellow · visceral fat keeps increasing':s.visceralStage>0?'Visceral fat building around the intestines':'Subcutaneous stage · no added visceral fat';
    const desc=m.profileLabel+' at fuel '+m.x+' of 100. '+$("pft3d-sequence").textContent+'. Own procedural anatomy. Shape changes are illustrative, not patient measurements.';
    canvas3d.setAttribute('aria-label',desc);$("pft3d-description").textContent=desc;
  }
  // Stable inspection interface for integration and regression testing.
  window.PFTAtlas={
    setRenderer:setRendererMode,
    getState:()=>atlasState&&JSON.parse(JSON.stringify(atlasState)),
    model:(load,capacity)=>model(load,capacity),
    compartments:(load,capacity)=>abdominalState(model(load,capacity)),
    inspect:()=>pft3d?.inspect(),organs:()=>pft3d?.organs(),sample:(kind,indices)=>pft3d?.sample(kind,indices),
    setState:(load,capacity)=>{if(capacity!==undefined)$("capacity-select").value=String(capacity);$("fat-range").value=String(Math.max(0,Math.min(100,Number(load)||0)));render(true)},
    setView:selectCamera
  };

  const tickEls=baseTicks.map(function(n,i){
    const div=document.createElement("div");div.className="tick";div.style.bottom=n+"%";
    const b=document.createElement("b");b.textContent=i+1;
    const span=document.createElement("span");span.className="tick-name";span.textContent=tickNames[i];
    div.append(b,span);$("ticks").append(div);return div;
  });
  let lastStage="",announceTimer=0;
  function render(announce){
    const m=model($("fat-range").value,$("capacity-select").value);
    $("capacity-note").textContent=m.profileNote;
    const a1cLabel=m.glycemicState==="diabetes"?"Diabetes range":m.glycemicState==="prediabetes"?"Prediabetes range":"Normal range";
    $("a1c-number").textContent=m.a1c.toFixed(1);
    $("a1c-status").textContent=a1cLabel;
    $("a1c-card").dataset.state=m.glycemicState;
    $("a1c-output").setAttribute("aria-label","Illustrative hemoglobin A1c "+m.a1c.toFixed(1)+" percent. "+a1cLabel);
    $("a1c-prediabetes").classList.toggle("reached",m.a1c>=5.7);
    $("a1c-diabetes").classList.toggle("reached",m.a1c>=6.5);
    let s=stages[m.stage];
    if(m.stage===1&&m.p>=24)s={kicker:"1 · Under-skin storage strain",title:"The storage buffer is strained",copy:"In this example, healthy storage under the skin becomes less effective. Fat increasingly spills into muscle, around the organs and into the liver, even as fat under the skin continues to grow.",take:"A personal threshold is not a literal wall or a fixed body-fat percentage.",depot:"sat"};
    if(m.glycemicState==="prediabetes")s={kicker:"Blood glucose rising · Prediabetes range",title:"Glucose starts to stay elevated",copy:"In this example, insulin is struggling to keep glucose in its usual range. The illustrative HbA1c is now in the 5.7–6.4% prediabetes range, before it reaches the diabetes cutoff.",take:"Prediabetes is a risk state; progression to type 2 diabetes is not inevitable.",depot:"blood"};
    if(m.profile==="extreme"&&m.fatLoad>=5)s={kicker:"Extreme · Expanding storage",title:m.hyperplasia<.7?"New fat cells add capacity":"A much larger storage reserve",copy:"This phenotype helps explain why a person can have substantial obesity without type 2 diabetes. An expanding population of fat cells stores more energy under the skin; a little visceral fat still appears. Glucose stays in the normal range in this chosen example.",take:"Storage capacity is not unlimited, and no amount of excess weight guarantees protection from diabetes.",depot:"sat"};
    if(m.diabetes)s={kicker:"Possible outcome · Type 2 diabetes",title:"Insulin is high but no longer works well",copy:"In a susceptible person, insulin levels are high, but with fat cells, liver and muscle full past the personal fat threshold there is no room to move more fuel in, and the pancreas can no longer raise insulin enough after meals. Blood glucose stays persistently in the diabetes range. Excess body fat can contribute, but body size alone does not establish the diagnosis.",take:"Blood glucose or A1C testing—not the amount of visible fat—establishes diabetes.",depot:"blood"};
    if(m.diabetes&&m.profile==="lower")s={kicker:"Lower threshold · Type 2 diabetes range",title:"Diabetes without marked excess weight",copy:"This phenotype helps explain why someone can have type 2 diabetes without being significantly overweight. A smaller healthy storage reserve and individual susceptibility can allow glucose control to fail after relatively little added fat.",take:"Body size alone cannot establish or exclude type 2 diabetes. Insulin action and beta-cell function also matter.",depot:"blood"};
    if(m.glycogenPhase)s={kicker:"First · Glycogen reserves",title:m.x===0?"Room for stored carbohydrate":m.x<glycogenPhaseEnd?"Glycogen reserves replenish":"Glycogen reserves are stocked",copy:"Liver and muscle store glucose as glycogen. Watch the teal highlights grow inside those tissues as their reserves replenish. The next part of the slider focuses on added fat.",take:"Full glycogen stores are normal. In real life, carbohydrate use, glycogen replenishment, and fat storage overlap.",depot:"glycogen"};
    const hue=m.glycogenPhase?"#80d9c8":m.diabetes?"#ed7a8d":m.glycemicState==="prediabetes"?"#efc16e":colors[m.stage];
    root.style.setProperty("--active",hue);
    $("fat-output").innerHTML=Math.round(m.x)+" <span>/ 100</span>";
    $("fat-range").setAttribute("aria-valuetext",Math.round(m.x)+" of 100 on an illustrative fuel scale. HbA1c example "+m.a1c.toFixed(1)+" percent, "+a1cLabel+". "+s.title);
    $("stage-kicker").textContent=s.kicker;$("stage-title").textContent=s.title;
    $("stage-copy").textContent=s.copy;$("takeaway").textContent=s.take;
    renderAnatomy(m);
    updatePFT3D(m);
    renderAbdominalViewSafely(m);
    renderFuelReserve(m);
    renderBloodParticles(bloodFat,m.lipids);
    renderBloodParticles(bloodGlucose,m.glucose);
    const bloodState=m.profile==="extreme"?"Normal-range glucose":m.glycemicState!=="normal"?"Glucose + fats rising":m.glucose>.002?"Glucose beginning to rise":m.lipids>.015?"Fats rising":"Normal circulation";
    $("blood-caption").textContent=(m.profile==="extreme"?"Only small blood changes appear here; this example retains normal-range glucose.":"Glucose and fats increase in every displayed artery and in the blood view.")+" Arteries are shown through tissue; symbols are enlarged and counts are illustrative.";
    $("blood-status").textContent=bloodState;
    $("blood-svg").setAttribute("aria-label",bloodState+". Gold circles represent circulating fats; blue diamonds represent glucose. Counts are illustrative.");
    tickEls.forEach(function(el,i){el.style.bottom=m.marks[i]+"%";el.hidden=m.marks[i]>100;el.classList.toggle("passed",m.x>=m.marks[i]);el.classList.toggle("current",s.depot===tickDepots[i])});
    root.querySelectorAll("[data-depot]").forEach(function(el){
      const key=el.dataset.depot,val=m[key];
      el.querySelector(".meter i").style.width=(val*100).toFixed(1)+"%";
      const burden=key==="sat"&&m.profile==="extreme"&&m.fatLoad>=5?"Expanding":key==="vis"&&m.profile==="extreme"&&m.fatLoad>35?"Slight rise":val<.13?"Baseline":val<.43?"Building":val<.76?"Elevated":"High";
      el.querySelector(".depot-value").textContent=burden;
      el.classList.toggle("active",s.depot===key);
    });
    const desc=m.profileLabel+". Added fuel "+Math.round(m.x)+" of 100 on an illustrative scale. Teal highlights represent glycogen in liver and muscle. HbA1c example "+m.a1c.toFixed(1)+" percent, "+a1cLabel+". "+s.title+". "+s.copy;
    $("human-desc").textContent=desc;
    const announcedStage=m.profile+":"+s.title;
    if(announce&&lastStage!==announcedStage){
      clearTimeout(announceTimer);
      announceTimer=setTimeout(function(){$("live-summary").textContent=m.profileLabel+". "+s.title+". "+s.copy},220);
    }
    lastStage=announcedStage;
    document.dispatchEvent(new CustomEvent("pft:render",{detail:{model:m,stage:s,a1cLabel:a1cLabel,hue:hue,diabetesOnset:diabetesOnsetFor($("capacity-select").value)}}));
  }
  window.PFT={render:render,model:model,stages:stages,tickNames:tickNames,tickDepots:tickDepots};
  $("fat-range").addEventListener("input",function(){render(true)});
  // Hover over either CT canvas and use the wheel/trackpad to scrub the same
  // fuel slider that drives the person and current CT section.
  [$("ct-baseline"),$("ct-current")].forEach(function(canvas){
    canvas.addEventListener("wheel",function(e){
      e.preventDefault();
      const step=Math.max(1,Math.min(8,Math.round(Math.abs(e.deltaY)/80)||1));
      const dir=e.deltaY>0?1:-1;
      const slider=$("fat-range");
      slider.value=String(Math.max(0,Math.min(100,Number(slider.value)+dir*step)));
      render(true);
    },{passive:false});
    canvas.title="Scroll to scrub the fuel slider";
  });
  // Make ↑ increase and ↓ decrease consistently for a vertical native range.
  $("fat-range").addEventListener("keydown",function(e){
    const delta={ArrowUp:1,ArrowRight:1,ArrowDown:-1,ArrowLeft:-1,PageUp:10,PageDown:-10};
    if(Object.prototype.hasOwnProperty.call(delta,e.key)){
      e.preventDefault();this.value=Number(this.value)+delta[e.key];render(true);
    }else if(e.key==="Home"||e.key==="End"){e.preventDefault();this.value=e.key==="Home"?0:100;render(true)}
  });
  $("capacity-select").addEventListener("change",function(){render(true)});
  render(false);
  // BEGIN WORKBENCH
  // Fit the active surface to the viewport, including when this file is embedded.
  // The same-origin Theosis frame is the only host layout this model adjusts.
  let modelHostFrame=null;
  let modelHostWindow=null;
  try{
    if(window.frameElement&&window.parent.location.origin===location.origin&&
       /(^|\.)theosismedical\.com$/.test(location.hostname)&&
       /^\/minutes\/(create-diabetic|how-type-2-diabetes-develops|personal-fat-threshold)\/?$/.test(window.parent.location.pathname)){
      modelHostFrame=window.frameElement;
      modelHostWindow=window.parent;
      const article=modelHostFrame.closest("article");
      if(article){article.style.maxWidth="1600px";article.style.paddingTop="16px";article.style.paddingBottom="24px"}
      modelHostFrame.parentElement.style.marginTop="12px";
      modelHostFrame.style.display="block";
      modelHostFrame.style.width="100%";
      modelHostFrame.style.scrollMarginTop="80px";
      modelHostFrame.setAttribute("allowfullscreen","");
    }
  }catch(e){/* Cross-origin embeds use their own available viewport. */}
  let fitFrame=0;
  function fitWorkbench(){
    fitFrame=0;
    const full=document.fullscreenElement===root;
    const viewHeight=full?window.innerHeight:modelHostWindow?modelHostWindow.innerHeight:window.innerHeight;
    const width=root.clientWidth;
    const hostNav=modelHostWindow?modelHostWindow.document.querySelector("header"):null;
    const hostInset=!full&&modelHostWindow?(hostNav?hostNav.getBoundingClientRect().height:65)+88:16;
    const heading=root.querySelector(".workbench-header").getBoundingClientRect().height;
    const available=viewHeight-hostInset-heading-36;
    const minimum=width<=700?540:480;
    const workspaceHeight=Math.max(minimum,Math.min(730,available));
    root.style.setProperty("--workspace-height",Math.round(workspaceHeight)+"px");
    root.classList.toggle("compact-height",workspaceHeight<650);
    $("human-svg").setAttribute("viewBox",width<=900?"40 0 640 1080":"0 0 720 1080");
    $("expand-view").textContent=full?"Exit full screen":"Full screen";
    $("expand-view").setAttribute("aria-pressed",String(full));
    if(modelHostFrame&&!full){
      // Let the document grow when a reader deliberately opens the notes.
      // Height comes from the content, never from a 1600px iframe viewport.
      const contentHeight=Math.ceil(root.getBoundingClientRect().height)+2;
      if(Math.abs(parseFloat(modelHostFrame.style.height||"0")-contentHeight)>1)
        modelHostFrame.style.height=contentHeight+"px";
    }
  }
  function scheduleWorkbenchFit(){if(!fitFrame)fitFrame=requestAnimationFrame(fitWorkbench)}
  $("expand-view").addEventListener("click",async function(){
    try{
      if(document.fullscreenElement===root)await document.exitFullscreen();
      else if(root.requestFullscreen)await root.requestFullscreen();
      else throw new Error("Fullscreen not supported");
    }catch(e){
      // A host may disallow fullscreen; the complete model can still open itself.
      if(window.self!==window.top&&location.protocol!=="about:")window.open(location.href,"_blank","noopener");
      else $("view-status").textContent="Full screen is unavailable in this browser. The live panels remain grouped together.";
    }
  });
  window.addEventListener("resize",scheduleWorkbenchFit);
  document.addEventListener("fullscreenchange",scheduleWorkbenchFit);
  if(modelHostWindow)modelHostWindow.addEventListener("resize",scheduleWorkbenchFit);
  if(typeof ResizeObserver!=="undefined"){
    const workbenchObserver=new ResizeObserver(scheduleWorkbenchFit);
    workbenchObserver.observe(root);
    workbenchObserver.observe(root.querySelector(".workbench-header"));
  }
  fitWorkbench();
  // END WORKBENCH



})();
