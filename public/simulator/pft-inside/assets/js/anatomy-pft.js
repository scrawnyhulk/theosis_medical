/* Lazy-loaded 3D atlas for the Personal Fat Threshold model (own procedural anatomy, see CREDITS.md). */

/* Anatomical geometry: Theosis Medical procedural anatomy on a MakeHuman CC0 base (see CREDITS.md).
   Deformations illustrate composition; they are not anatomical measurements. */
(function(root,factory){const api=factory(root.AnatomyThree);if(typeof module==='object'&&module.exports)module.exports=api;else root.Anatomy3D=api;})(typeof globalThis!=='undefined'?globalThis:this,function(T){
 'use strict';
// Personal Fat Threshold adapter, 2026-09-15, refined.
// Atlas meshes and the rendering pipeline are reused from the supplied V8 app.
// pftFat separates visible subcutaneous deposition from visceral distension;
// these are unitless teaching controls, not estimated quantities in a person.
function visceralDisplacement(x,y,z,amount){
 const v=clamp(amount),center=1-smooth(.17,.235,Math.abs(x));
 const envelope=bell(y,1.035,.255)*center;
 const front=smooth(-.028,.066,z),lateral=.32+.68*front;
 return [x*.38*v*envelope*lateral,-.008*v*bell(y,.95,.14)*front*center,.26*v*envelope*front];
}

const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t)};
const bell=(x,c,r)=>{const t=clamp(1-Math.abs(x-c)/r);return t*t*(3-2*t)};
const span=(x,a,b,edge=.15)=>smooth(a,a+(b-a)*edge,x)*(1-smooth(b-(b-a)*edge,b,x));
const connective=name=>/tendon|aponeurosis|tract|retinacul|ligament|fascia/i.test(name);
function muscleRatio(o,group){return o._ratios?.[group]??clamp((1+(o.baselineLeanRatio||0))*(1+(o.groupRatios?.[group]??o.leanChangeRatio??0))-1,-.35,.65)}
function armCenterAt(y,side){return [side*(.195+(1.245-y)*.245),-.028+.025*clamp((1.12-y)/.30)]}
// The muscle compartment expands around the bone axis, so deeper muscle
// pushes superficial muscle outward. Scaling every belly about its own
// centre made mass gains disappear inside an unchanged outer silhouette.
function muscleDisplacement(x,y,z,group,name,ratio){
 const side=Math.sign(x)||1,growth=Math.sqrt(1+ratio)-1;
 if(!growth)return [0,0,0];
 if(group==='arms'||/deltoid/i.test(name)){
  const [cx,cz]=armCenterAt(y,side),envelope=/deltoid/i.test(name)?span(y,1.24,1.45,.2):Math.max(span(y,1.07,1.40,.22),span(y,.85,1.105,.24)*.75);
  return [(x-cx)*growth*envelope,0,(z-cz)*growth*envelope];
 }
 if(group==='legs'){
  if(/gluteus/i.test(name)){const e=span(y,.70,.99,.2);return [(x-side*.055)*growth*e,0,(z+.008)*ratio*.57*e]}
  const cx=side*(.078+.016*clamp((y-.43)/.45)),cz=-.026,e=Math.max(span(y,.415,.93,.16),span(y,.085,.43,.20));
  return [(x-cx)*growth*e,0,(z-cz)*growth*e];
 }
 if(group==='chest'){
  const e=span(y,1.16,1.425,.18)*smooth(0,.024,Math.abs(x));
  // The sheet's thickness carries most of its added volume. These factors
  // account for the fixed insertion edge; atlas volume checks at +11.4%
  // muscle give +11.4% pec volume without enlarging the rib cage.
  return [(x-side*.045)*growth*.26*e,(y-1.30)*growth*.10*e,Math.max(0,z+.010)*ratio*.845*e];
 }
 if(group==='back'){
  const lat=/latissimus/i.test(name),e=span(y,lat?.90:1.10,lat?1.40:1.59,.17),anchor=lat?-.025:-.035;
  return [x*growth*(lat?1:.22)*e,0,Math.min(0,z-anchor)*ratio*(lat?.50:.935)*e];
 }
 return [0,0,0];
}
function classify(name,center){
 const n=name.toLowerCase();
 if(/pectoralis|deltoid/.test(n))return 'chest';
 if(/trapezius|latissimus|rhomboid|erector|iliocostalis|longissimus|spinalis/.test(n))return 'back';
 if(/biceps_brachii|triceps_brachii|brachialis|brachioradialis|carpi|pronator|supinator|anconeus/.test(n))return 'arms';
 if(/femoris|vastus|semitendinosus|semimembranosus|gluteus|gastrocnemius|soleus|adductor|gracilis|sartorius|tibialis|fibularis/.test(n))return 'legs';
 if(/flexor|extensor/.test(n))return center[1]>.7?'arms':'legs';
 return null;
}
function readable(name,kind='muscle',paired=kind==='muscle'&&/(?:muscle|brachii|femoris|carpi|ulnaris|radialis|teres|gastrocnemius|soleus|sartorius|gracilis|adductor|supinator|pronator)[lr]$/.test(name)){
 const label=(paired?name.slice(0,-1):name).replace(/_/g,' ').replace(/[()]/g,'').replace(/^./,c=>c.toUpperCase())+(paired?(name.endsWith('l')?' · left':' · right'):'');
 return kind==='organ'?/omentum|mesocolon/i.test(name)?'Visceral fat · '+label:/jejunum|ileum|duodenum/i.test(name)?'Small intestine · '+label:/colon|cecum|rectum/i.test(name)?'Large intestine · '+label:label:label;
}
function armPose(x,y,z,amount,weight){
 const side=Math.sign(x)||1,px=side*.175,py=1.40,theta=side*amount*.085*weight,dx=x-px,dy=y-py,c=Math.cos(theta),s=Math.sin(theta);
 return [px+dx*c-dy*s,py+dx*s+dy*c,z];
}
function hyperplasiaPattern(o){
 const cue=(o.profile==='extreme'?1:0);
 return Math.max(cue,clamp(o.hyperplasia||0),clamp((o.pftFat?.subcutaneous||0)-(o.pftFat?.visceral||0)-.28));
}
function fatCoverage(x,y,z,o){
 const female=o.sex==='female',f=clamp((o.bodyFat-(female?22:12))/35,0,1.45),arm=smooth(.172,.222,Math.abs(x))*smooth(.58,.72,y)*(1-smooth(1.39,1.50,y));
 const central=1-smooth(.17,.225,Math.abs(x)),leg=1-smooth(.66,.96,y),bodyMask=1-(1-central)*(1-smooth(.85,.99,y)),trunk=(1-arm)*(1-leg)*bodyMask,pelvis=(1-arm)*smooth(.57,.77,y)*central;
 const hyper=hyperplasiaPattern(o);
 // Coverage is an explanatory fat layer, not a prediction of skin colour.
 // No uniform yellow film on the head, hands or feet. Small secondary
 // deposits fade into the dominant abdominal and gluteofemoral pads.
 const pads=trunk*(.18*bell(y,1.30,.15)+.96*bell(y,1.025,.245))+pelvis*(female?.90:.64)*bell(y,.84,.29)+(1-arm)*central*leg*((female?.98:.72)*bell(y,.70,.39)+.13*bell(y,.29,.21))+arm*((female?.60:.52)*bell(y,1.22,.23)+.12*bell(y,.98,.18));
 const diffuse=trunk*((female?.20:.16)*bell(y,1.24,.20)+(female?.82:1.05)*bell(y,1.01,.30))+pelvis*(female?1.08:1.22)*bell(y,.80,.35)+(1-arm)*leg*central*((female?1.10:1.02)*bell(y,.69,.44)+.24*bell(y,.30,.24))+arm*((female?.70:.82)*bell(y,1.17,.30)+.18*bell(y,.98,.21));
 const coverageShape=clamp(pads*(1-.55*hyper)+diffuse*(.72*hyper));
 if(o.pftFat)return coverageShape*smooth(0,.14,clamp(o.pftFat.subcutaneous));
 return coverageShape*clamp(.42+.58*f,.42,1);
}

// V14: internal tissue burden and external abdominal projection are different
// display quantities. A smaller exterior belly must not hide the visceral stage.
function pftVisceralTissue(o){
 const value=o.pftFat?.visceralTissue??o.pftFat?.visceral??o.depots?.visceral??0;
 return clamp(value);
}
function pftTissueNoise(x,y,z){
 // Stable, smooth multiscale variation: the pattern never flickers on scrubbing.
 return clamp(.5+.22*Math.sin(x*153+y*101+z*71)*Math.sin(y*127-z*97)
                  +.12*Math.sin(x*291-y*67+z*189));
}
function pftVisceralCoverage(x,y,z,o){
 const raw=pftVisceralTissue(o);
 if(raw<=0)return 0;
 if(o.profile==='extreme')return clamp(raw*3.2); // slight late tissue only
 const visible=Math.pow(raw,.62),seed=pftTissueNoise(x,y,z);
 return smooth(0,.03,visible)*(.23+.77*smooth(seed*.52,seed*.52+.36,visible));
}

function legacyDeformPoint(x,y,z,meta,o){
 const female=o.sex==='female',f=o.pftFat?clamp(o.pftFat.subcutaneous):clamp((o.bodyFat-(female?22:12))/35,-.10,1.45),kind=meta.kind,side=Math.sign(x)||1;
 let nx=x,ny=y,nz=z;
 const armWeight=smooth(.172,.222,Math.abs(x))*smooth(.58,.72,y)*(1-smooth(1.39,1.50,y));
 if(kind==='muscle'&&meta.group&&!meta.connective&&!connective(meta.name)){
  const d=muscleDisplacement(x,y,z,meta.group,meta.name,muscleRatio(o,meta.group));
  // Preserve the origin/insertion ends of each atlas belly. The middle 86%
  // retains full compartment expansion instead of a small bell-only bulge.
  // Atlas heads of the pec/deltoid/trapezius share a surface. Tapering each
  // head at its own mesh extrema opened artificial seams between heads.
  // Their shared field already anchors the sternum, clavicle and edges.
  const sharedSheet=/pectoralis|deltoid|trapezius|latissimus/i.test(meta.name);
  const axis=meta.axis||[0,1,0],a=(x-meta.center[0])*axis[0]+(y-meta.center[1])*axis[1]+(z-meta.center[2])*axis[2],e=sharedSheet||meta.axisMin===undefined?1:span(a,meta.axisMin,meta.axisMax,.07);
  nx+=d[0]*e;ny+=d[1]*e;nz+=d[2]*e;
 }
 // A shared anatomical reference is used for both selections. This changes
 // regional proportions, not the sex-specific identity of every organ/bone.
 const frameX=female?1-.065*smooth(1.03,1.34,y)+.055*bell(y,.88,.20):1;
 nx*=frameX;
 if(kind==='organ'&&/omentum|mesocolon/i.test(meta.name)){
  const amount=clamp(o.pftFat?.visceral??o.depots?.visceral??0),omentum=/omentum/i.test(meta.name);
  const cx=meta.center[0],cy=meta.center[1],cz=meta.center[2];
  if(o.pftFat&&o.profile!=='extreme'){
   // Keep the atlas attachments and the bowel-surrounding footprint. Only
   // thickness/fullness grows; the old whole-sheet collapse caused a late pop.
   const tissue=pftVisceralTissue(o),growth=tissue<=0?0:(.10+.90*Math.pow(tissue,.72));
   const apron=smooth(.86,.94,y)*(1-smooth(1.105,1.16,y));
   nx=cx+(nx-cx)*(1+growth*(omentum?.11:.045));
   ny-=growth*(omentum?.009:.002)*apron;
   nz=cz+(nz-cz)*(.24+.86*growth)+growth*(omentum?.013:.006);
   const relief=(pftTissueNoise(x,y,z)-.5)*.003*growth;
   nz+=relief;
   // Follow the existing internal abdominal distension, not an independent bulge.
   nz+=visceralDisplacement(x,y,z,amount)[2]*(omentum?.50:.20);
  }else{
   // Preserve the deliberately small, late hyperplasia compartment.
   const shown=smooth(.018,.11,amount);
   nx=cx+(nx-cx)*(.14+.86*shown);ny=cy+(ny-cy)*(.24+.76*shown);nz=cz+(nz-cz)*(.10+.90*shown)-(1-shown)*(omentum?.006:.004);
   nx*=1+amount*(omentum?.32:.20);nz+=(z+.025)*amount*(omentum?.58:.34);
   const folds=Math.sin(x*218+y*145)*Math.sin(y*189-z*161);
   nz+=amount*.0022*folds;ny-=amount*.008*bell(y,.94,.13);
   if(o.pftFat)nz+=visceralDisplacement(x,y,z,amount)[2]*(omentum?.82:.28);
  }
 }
 if(kind==='organ'&&(/Liver/i.test(meta.name)||/Pancreas/i.test(meta.name))){
  const amount=clamp(/Liver/i.test(meta.name)?(o.pftFat?.liver??o.depots?.liver??0):(o.pftFat?.pancreas??o.depots?.pancreas??0));
  if(amount>0){
   const cx=meta.center[0],cy=meta.center[1],cz=meta.center[2],dx=x-cx,dy=y-cy,dz=z-cz;
   if(/Liver/i.test(meta.name)){
    const e=bell(y,cy,.12)*(1-smooth(.16,.31,Math.abs(dx)))+0.20*bell(y,cy-.03,.18);
    nx+=dx*amount*.055*e;ny+=dy*amount*.016*e;nz+=amount*(.010+Math.max(0,dz+.010)*.12+Math.abs(dx)*.018)*e;
   }else{
    const e=bell(y,cy,.055)*(1-smooth(.05,.21,Math.abs(dx)))+0.12*bell(y,cy,.09);
    nx+=dx*amount*.040*e;ny+=dy*amount*.010*e;nz+=amount*(.020+Math.max(0,dz+.004)*.095)*e;
   }
  }
 }
 if(kind==='skin'){
  const central=1-smooth(.17,.225,Math.abs(x)),bodyMask=1-(1-central)*(1-smooth(.85,.99,y));
  // The thigh-to-pelvis handoff is deliberately broad. Narrow, separately
  // peaked pads caused a waist/hip shelf and a pinch at the top of the leg.
  const chest=bell(y,1.30,.16),waist=bell(y,1.025,.245),hips=bell(y,.84,.29),leg=1-smooth(.66,.96,y),trunk=(1-armWeight)*(1-leg)*bodyMask,pelvicWeight=(1-armWeight)*smooth(.57,.77,y)*central*(1-.55*leg),front=smooth(-.025,.045,z),back=1-smooth(-.065,.005,z),hyper=hyperplasiaPattern(o),hyperScale=hyper*smooth(.42,.92,f),isExtreme=o.profile==='extreme',isLarger=o.profile==='larger',isModerate=o.profile==='moderate',isLower=o.profile==='lower',visceralAmt=clamp(o.pftFat?.visceral??o.depots?.visceral??0),subqAmt=clamp(o.pftFat?.subcutaneous??f),sideWaist=(female?.40:(isExtreme?.76:(isLarger?1.08:(isModerate?.70:.65)))),sideHip=(female?.62:(isExtreme?.44:(isLarger?.66:.34))),frontWaist=(female?.092:(isExtreme?.118:(isLarger?.072:(isModerate?.124:.145)))),frontHip=(female?.033:(isExtreme?.030:(isLarger?.050:.021)));
  // Illustrative average regional deposition, not a blanket scale of the
  // whole body: abdominal/flank emphasis for male, gluteofemoral emphasis
  // for female. Keep upper chest padding modest; the face remains the
  // same anatomical reference because these inputs cannot predict it.
  nx+=x*f*((.035*chest+sideWaist*waist)*trunk+sideHip*hips*pelvicWeight);
  nz+=f*((.007*chest+frontWaist*waist+frontHip*hips)*front-(.007*chest+.037*waist)*back)*trunk;
  ny-=Math.max(0,f)*Math.max(0,f)*(.020+(isExtreme?.010:0))*bell(y,.94,.145)*front*trunk;
  // Rounder central-adiposity profile for the lower / moderate / larger
  // thresholds. The user wanted the larger threshold to resemble a smooth,
  // rounded beer belly rather than a pointy cone.
  if(!isExtreme){
   const beerStage=(isLower?.35:isModerate?.74:1.0)*clamp(isLarger?(subqAmt*1.18+visceralAmt*.24):(subqAmt*.82+visceralAmt*.56));
   const upperBeer=bell(y,1.08,.15)*front*trunk*central;
   const midBeer=bell(y,1.00,.245)*front*trunk*central;
   const lowerBeer=bell(y,.90,.215)*front*trunk*central;
   const roundBelly=bell(y,.98,.36)*trunk*central;
   const beerApron=bell(y,.84,.150)*front*trunk*central*smooth(.76,.99,y);
   const beerUnder=bell(y,.79,.118)*front*trunk*central*smooth(.78,.99,y);
   const flankRound=bell(y,.96,.30)*trunk*(1-front*.18);
   const lowerFlank=bell(y,.88,.19)*trunk*(1-front*.10);
   nx+=x*beerStage*((isLarger?.36:isModerate?.11:.05)*roundBelly+(isLarger?.22:isModerate?.05:.02)*lowerBeer+(isLarger?.10:0)*beerApron+(isLarger?.16:0)*flankRound+(isLarger?.11:0)*lowerFlank);
   // Larger-threshold reference: broader from the front and more rounded below,
   // while the upper abdomen stays comparatively flatter.
   nz-=beerStage*(isLarger?.168:isModerate?.064:.030)*upperBeer;
   nz+=beerStage*((isLarger?.010:isModerate?.030:.018)*upperBeer+(isLarger?.102:isModerate?.094:.048)*midBeer+(isLarger?.220:isModerate?.103:.062)*lowerBeer+(isLarger?.152:isModerate?.038:.012)*beerApron+(isLarger?.086:isModerate?.012:0)*beerUnder);
   ny-=beerStage*((isLarger?.045:isModerate?.016:.007)*lowerBeer+(isLarger?.082:isModerate?.020:.005)*beerApron+(isLarger?.040:isModerate?.007:0)*beerUnder);
  }
  if(hyperScale>0){
   nx+=x*f*.16*waist*trunk*hyperScale;
   nz-=f*.095*waist*front*trunk*hyperScale;
   ny-=f*.012*bell(y,.99,.18)*front*trunk*hyperScale;
  }
  const legCenter=side*(.082+.018*bell(y,.70,.27)),rz=z+.025,rx=x-legCenter,thigh=bell(y,.70,.39),calf=bell(y,.29,.21);
  const legFat=f*((female?1.12:.64)*thigh+.12*calf+.10*bell(y,.43,.11))*leg*central;
  nx+=rx*legFat*smooth(0,.075,Math.abs(x));nz+=rz*legFat*(1-back*smooth(.40,.52,y));
  // One continuous posterior fat pad spans glutes and upper hamstrings.
  // Separate trunk/leg blend peaks previously made an artificial shelf.
  nz-=f*(female?.135:.073)*bell(y,.67,.43)*back*(1-armWeight)*central;
  // Cross-section expansion is local to each arm, so a larger torso cannot
  // squeeze the arm. Bone length is preserved; arms open slightly at obesity.
  const [armCenter,armZ]=armCenterAt(y,side),upperArm=bell(y,1.22,.23),armFat=f*((female?.83:.72)*upperArm+.16*bell(y,.98,.18))*armWeight;
  nx+=(x-armCenter)*armFat;nz+=(z-armZ)*armFat;
  // A softer posterior upper-arm pad avoids turning fat into a swollen
  // biceps/deltoid. Forearms and joints receive much less added tissue.
  nz-=Math.max(0,f)*(female?.014:.010)*upperArm*armWeight*(1-smooth(armZ-.012,armZ+.014,z));
  // Hyperplasia pattern: carry more fat under the skin over the lower abdomen,
  // buttocks, thighs, calves and arms, while keeping deep abdominal fat low.
  if(hyperScale>0){
   // Hyperplasia pattern, refined using both the halfway and extreme reference
   // bodies: smoother under-skin storage, prominent lower-abdominal roll/apron,
   // wide flanks/hips, gluteofemoral storage, and fuller limbs. It should look
   // soft and distributed, not like a pointed central cone.
   const hyperMid=smooth(.50,.76,f),hyperLate=smooth(.76,1.08,f);
   const upperBelly=bell(y,1.08,.16)*central*front*trunk;
   const midBelly=bell(y,1.00,.20)*central*front*trunk;
   const lowerBelly=bell(y,.91,.18)*central*front*trunk;
   const pannus=bell(y,.82,.16)*central*front*trunk*smooth(.72,.98,y);
   const flank=bell(y,1.00,.35)*trunk;
   const lowerFlank=bell(y,.89,.25)*trunk;
   const pelvisSpread=bell(y,.79,.41)*(1-armWeight)*central;
   const chestPad=bell(y,1.20,.18)*front*trunk;
   const gluteShelf=bell(y,.69,.28)*back*(1-armWeight)*central;
   nx+=x*f*(.24*flank+.23*lowerFlank+.24*pelvisSpread+.05*midBelly+.05*lowerBelly)*hyperScale;
   // Suppress a sharp upper dome so the abdomen reads as softer stacked rolls.
   nz-=f*(.108*upperBelly+.052*midBelly)*hyperScale;
   nz+=f*(
      .020*upperBelly+
      (.066+.014*hyperMid)*midBelly+
      (.128+.052*hyperMid)*lowerBelly+
      (.102+.086*hyperMid)*pannus+
      .066*flank*front+
      .066*lowerFlank*front+
      .062*pelvisSpread*front+
      .034*chestPad
    )*hyperScale;
   ny-=f*(.010*midBelly+.038*lowerBelly+(.060+.026*hyperLate)*pannus+.010*chestPad)*hyperScale;
   // Create a gentle stacked-roll contour in side view instead of a single point.
   nz-=f*.052*bell(y,1.14,.10)*front*trunk*hyperScale;
   nz+=f*(.012*bell(y,1.00,.07)+.032*bell(y,.93,.08)+.048*bell(y,.84,.10))*front*trunk*hyperScale;
   // Larger buttocks / posterior thigh blend, matching diffuse subcutaneous storage.
   nz-=f*(female?.136:.194)*gluteShelf*hyperScale;
   const thighExtra=bell(y,.69,.48)*leg*central*hyperScale,calfExtra=.58*bell(y,.28,.26)*leg*central*hyperScale;
   nx+=rx*f*(.25*thighExtra+.10*calfExtra)*smooth(0,.075,Math.abs(x));
   nz+=rz*f*(.15*thighExtra+.072*calfExtra)*(1-back*smooth(.32,.56,y));
   nz-=f*.066*bell(y,.74,.34)*back*leg*central*hyperScale;
   const armExtra=bell(y,1.18,.34)*armWeight*hyperScale;
   nx+=(x-armCenter)*f*.17*armExtra;nz+=(z-armZ)*f*.12*armExtra;
  }
  const legMuscle=muscleRatio(o,'legs'),armMuscle=muscleRatio(o,'arms'),chestMuscle=muscleRatio(o,'chest'),backMuscle=muscleRatio(o,'back');
  const limbEnvelope=Math.max(span(y,.415,.93,.16),span(y,.085,.43,.20)),armEnvelope=Math.max(span(y,1.07,1.40,.22),span(y,.85,1.105,.24)*.75);
  // Carry proximal quadriceps growth up to the groin. Fat's trunk/thigh
  // blend ends lower and must not clip the underlying muscle expansion.
  // Hands share the thighs' height in this pose, but not their compartment.
  // Central ownership keeps hip/thigh fat and leg training out of the hands.
  const legMuscleWeight=(1-armWeight)*(1-smooth(.87,.94,y))*central;
  const shoulder=smooth(.12,.18,Math.abs(x))*span(y,1.27,1.46,.23);
  // Blend the deltoid and arm compartments once; adding both previously
  // doubled growth at the shoulder while the humeral region barely moved.
  const armGrowth=(Math.sqrt(1+armMuscle)-1)*armWeight*armEnvelope*(1-shoulder)+(Math.sqrt(1+chestMuscle)-1)*shoulder;
  nx+=rx*(Math.sqrt(1+legMuscle)-1)*limbEnvelope*legMuscleWeight*smooth(0,.075,Math.abs(x))+(x-armCenter)*armGrowth;
  nz+=rz*(Math.sqrt(1+legMuscle)-1)*limbEnvelope*legMuscleWeight+(z-armZ)*armGrowth;
  // Match pectoral thickness, lat width, gluteal depth and shoulder caps.
  nz+=.092*chestMuscle*span(y,1.16,1.425,.18)*front*trunk-.073*backMuscle*span(y,1.10,1.59,.17)*back*trunk-.049*legMuscle*span(y,.70,.99,.20)*back*trunk;
  nx+=x*(Math.sqrt(1+backMuscle)-1)*bell(y,1.21,.24)*back*trunk;
  // This shared teaching envelope is not a sex-specific external-genital
  // atlas: flatten the source projection to a neutral anterior pelvis.
  const neutralPelvis=(1-smooth(.027,.060,Math.abs(x)))*smooth(.69,.725,y)*(1-smooth(.835,.885,y))*smooth(-.005,.025,z);
  ny+=Math.max(0,.824-y)*neutralPelvis;nz-=Math.max(0,z-.018)*neutralPelvis;
 }
 // Keep the anterior abdominal wall and outer envelope on the SAME
 // visceral displacement field. Subcutaneous fullness is outside that wall;
 // the bones and solid organs are not inflated to create a bigger belly.
 if(o.pftFat&&(kind==='skin'||(kind==='muscle'&&/rectus_abdominis|oblique.*abdom|transversus_abdominis|abdom.*oblique/i.test(meta.name)))){
  const d=visceralDisplacement(x,y,z,o.pftFat.visceral||0);nx+=d[0];ny+=d[1];nz+=d[2];
 }
 let poseWeight=armWeight;
 if(kind!=='skin')poseWeight=meta.isArm?1:0;
 return armPose(nx,ny,nz,Math.max(0,f),poseWeight);
}
// Reference-guided, bounded shape targets (V11). These are illustrative surfaces,
// not a diagnosis or measured amount of subcutaneous/visceral fat.
// Each row is [source height, target height, half-width, anterior z, posterior z].
// One closed cross-section replaces the accumulation of competing local bulges.
const PFT_REF_SECTIONS=[
 [.65,.65,.17,.071,-.10],[.74,.74,.179,.081,-.113],[.82,.82,.178,.103,-.144],
 [.90,.90,.166,.107,-.144],[1.00,1.00,.151,.126,-.097],[1.10,1.10,.156,.124,-.103],
 [1.20,1.20,.171,.133,-.131],[1.30,1.30,.184,.122,-.136],[1.40,1.40,.185,.071,-.126],
 [1.47,1.47,.090,.067,-.084],[1.53,1.53,.055,.087,-.065]
];
const PFT_DIFFUSE_MID=[
 [.65,.65,.203,.076,-.136],[.74,.74,.230,.094,-.161],[.82,.810,.251,.182,-.203],
 [.88,.851,.260,.237,-.211],[.94,.918,.261,.266,-.189],[1.00,.985,.251,.250,-.153],
 [1.06,1.051,.238,.218,-.150],[1.12,1.111,.239,.220,-.154],[1.18,1.170,.227,.193,-.152],
 [1.24,1.228,.220,.201,-.152],[1.31,1.305,.210,.162,-.149],[1.40,1.40,.195,.088,-.135],
 [1.47,1.47,.098,.070,-.089],[1.53,1.53,.055,.087,-.065]
];
const PFT_DIFFUSE_MAX=[
 [.65,.65,.250,.084,-.178],[.74,.74,.286,.128,-.213],[.80,.759,.310,.219,-.235],
 [.85,.775,.335,.315,-.251],[.91,.835,.343,.363,-.240],[.98,.951,.336,.349,-.209],
 [1.035,1.024,.310,.294,-.191],[1.09,1.078,.311,.281,-.202],[1.15,1.137,.294,.255,-.193],
 [1.20,1.185,.275,.224,-.177],[1.25,1.235,.269,.233,-.161],[1.32,1.313,.247,.172,-.154],
 [1.40,1.40,.214,.097,-.140],[1.47,1.47,.103,.072,-.092],[1.53,1.53,.055,.087,-.065]
];
const PFT_CENTRAL_MAX=[
 [.65,.65,.194,.075,-.112],[.74,.74,.218,.094,-.149],[.80,.793,.236,.145,-.171],
 [.85,.826,.258,.198,-.182],[.90,.867,.277,.242,-.180],[.96,.932,.286,.276,-.169],
 [1.025,1.006,.285,.286,-.156],[1.085,1.075,.275,.278,-.149],[1.14,1.136,.255,.245,-.145],
 [1.19,1.188,.232,.198,-.146],[1.25,1.249,.214,.160,-.146],
 [1.34,1.34,.204,.114,-.140],[1.43,1.43,.160,.070,-.112],[1.53,1.53,.055,.087,-.065]
];
function pftSection(table,y,column){
 if(y<=table[0][0])return table[0][column];
 if(y>=table[table.length-1][0])return table[table.length-1][column];
 let i=0;while(i+1<table.length&&table[i+1][0]<y)i++;
 const a=table[i],b=table[i+1],h=b[0]-a[0],u=(y-a[0])/h,delta=(b[column]-a[column])/h;
 // Shape-preserving Hermite tangents: no overshoot or spikes between sections.
 const tangent=j=>{
  if(j===0)return (table[1][column]-table[0][column])/(table[1][0]-table[0][0]);
  if(j===table.length-1)return (table[j][column]-table[j-1][column])/(table[j][0]-table[j-1][0]);
  const hp=table[j][0]-table[j-1][0],hn=table[j+1][0]-table[j][0];
  const p=(table[j][column]-table[j-1][column])/hp,n=(table[j+1][column]-table[j][column])/hn;
  if(p*n<=0)return 0;
  return (3*(hp+hn))/((2*hn+hp)/p+(hn+2*hp)/n);
 };
 const m0=tangent(i),m1=tangent(i+1),u2=u*u,u3=u2*u;
 return (2*u3-3*u2+1)*a[column]+(u3-2*u2+u)*h*m0+(-2*u3+3*u2)*b[column]+(u3-u2)*h*m1;
}
function pftShapeProgress(o){const s=o.pftFat?.subcutaneous||0;return clamp(s/(o.profile==='extreme'?1.18:o.profile==='moderate'?.60:1.24))}
function pftOwnership(x,y,z){
 const ax=Math.abs(x);
 // Reference coordinates own compartments; growing flanks never become arms.
 const boundary=.178+.025*(1-smooth(.90,1.24,y));
 const arms=smooth(boundary,boundary+.025,ax)*smooth(.55,.65,y)*(1-smooth(1.40,1.49,y));
 const transition=smooth(.70,.92,y);
 const torso=transition*(1-smooth(1.405,1.515,y))*(1-arms);
 const legs=(1-transition)*(1-arms)*(1-smooth(.205,.27,ax));
 return {arms,torso,legs};
}
function pftReferenceSurface(x,y,z,o){
 const h=o.profile==='extreme',m=o.profile==='moderate',l=o.profile==='larger',t=pftShapeProgress(o),side=x<0?-1:1;
 const ownership=pftOwnership(x,y,z);
 let nx=x,ny=y,nz=z;
 // Preserve the existing neutral pelvis at baseline. This is a shared atlas.
 const neutral=(1-smooth(.027,.060,Math.abs(x)))*smooth(.69,.725,y)*(1-smooth(.835,.885,y))*smooth(-.005,.025,z);
 ny+=Math.max(0,.824-y)*neutral;nz-=Math.max(0,z-.018)*neutral;
 const sy=ny,sz=nz;
 if(t>0&&ownership.torso>0){
  const rx=pftSection(PFT_REF_SECTIONS,sy,2),zf=pftSection(PFT_REF_SECTIONS,sy,3),zb=pftSection(PFT_REF_SECTIONS,sy,4),c=(zf+zb)*.5,rz=(zf-zb)*.5;
  const sx=x/rx,szn=(sz-c)/rz,angle=Math.atan2(sx,szn),radius=Math.hypot(sx,szn);
  // Preserve small anatomical irregularities, but don't amplify them into spears.
  const detail=1+(.10+.22*smooth(1.15,1.32,sy))*clamp(radius-1,-.4,.25);
  const project=table=>{
   const width=pftSection(table,sy,2),front=pftSection(table,sy,3),back=pftSection(table,sy,4),cy=(front+back)/2;
   const facing=Math.max(0,Math.cos(angle));
   // Gravity changes the front apron, not an entire horizontal belt of vertices.
   const sag=(pftSection(table,sy,1)-sy)*(.12+.88*facing*facing);
   let py=sy+sag,pz=cy+Math.cos(angle)*(front-back)/2*detail;
   if(h){
    const cleft=Math.exp(-Math.pow(x/.045,2)-Math.pow((sy-.895)/.07,2));
    py+=.010*cleft;pz-=.010*cleft;
    const navel=Math.exp(-Math.pow(x/.012,2)-Math.pow((sy-1.045)/.015,2));pz-=.012*navel;
   }
   return [Math.sin(angle)*width*detail,py,pz];
  };
  let target,blend;
  if(h){
   const mid=project(PFT_DIFFUSE_MID),max=project(PFT_DIFFUSE_MAX);
   if(t<=.5){target=mid;blend=t*2}
   else{const q=(t-.5)*2;target=mid.map((v,i)=>v+(max[i]-v)*q);blend=1}
  }else{
   target=project(PFT_CENTRAL_MAX);
   // Lower, moderate and larger thresholds should all stay rounded rather than
   // becoming spear-like. Moderate now sits between the leaner lower preset and
   // the larger threshold, while the larger threshold is scaled back toward the
   // prior moderate size per user feedback.
   const eased=t*t*(3-2*t);
   blend=m?(eased*.32):(l?(eased*.64):eased);
  }
  const w=ownership.torso*blend;
  nx+=(target[0]-x)*w;ny+=(target[1]-sy)*w;nz+=(target[2]-sz)*w;
 }
 // Radial, local limb padding — never a height-only displacement across the pelvis.
 if(t>0){
  const arm=ownership.arms,leg=ownership.legs,thigh=Math.exp(-Math.pow((y-.66)/.25,4)),calf=Math.exp(-Math.pow((y-.27)/.17,4)),centralScale=h?1:(m?.56:1);
  const lc=side*(.080+.018*smooth(.38,.78,y)),lz=-.035;
  const qx=(x-lc)/.075,qz=(z-lz)/.075,r=Math.hypot(qx,qz)||1;
  const limbPad=t*(h?(.078*thigh+.034*calf):((m?(.023*thigh+.010*calf):(.026*thigh+.012*calf))*centralScale))*leg;
  nx+=qx/r*limbPad;nz+=qz/r*limbPad;
  const back=1-smooth(-.055,.005,z),glute=Math.exp(-Math.pow((y-.755)/.16,4))*leg;
  nz-=t*(h?.048:((m?.012:.018)))*glute*back;
  nx+=side*t*(h?.020:((m?.004:.006)))*glute*smooth(.04,.12,Math.abs(x));
  const [ac,az]=armCenterAt(y,side),ax=x-ac,ar=Math.hypot(ax,z-az)||1;
  const upper=Math.exp(-Math.pow((y-1.225)/.175,4)),lower=Math.exp(-Math.pow((y-1.01)/.13,4));
  const armPad=t*(h?(.064*upper+.027*lower):((m?(.018*upper+.006*lower):(.021*upper+.008*lower))*centralScale))*arm;
  nx+=ax/ar*armPad;nz+=(z-az)/ar*armPad;
  // Soft posterior upper-arm tissue and a broad hip/thigh handoff.
  nz-=t*(h?.014:.005)*upper*arm*(1-smooth(az-.02,az+.02,z));
 }
 // Visceral distension remains independently driven and exactly zero in early SAT stages.
 const d=visceralDisplacement(x,y,z,o.pftFat?.visceral||0);
 nx+=d[0];ny+=d[1];nz+=d[2];
 return pftDisplayPose(nx,ny,nz,x,y,z,o,ownership.arms,ownership.legs);
}
function pftDisplayPose(nx,ny,nz,x,y,z,o,armWeight,legWeight){
 const h=o.profile==='extreme',m=o.profile==='moderate',t=pftShapeProgress(o),side=x<0?-1:1;
 // Anatomical stance clearance. The same pose is applied to underlying anatomy.
 const theta=side*t*(h?.26:(m?.085:.11))*armWeight,c=Math.cos(theta),s=Math.sin(theta),px=side*.18,py=1.40;
 const dx=nx-px,dy=ny-py;
 nx=px+dx*c-dy*s;ny=py+dx*s+dy*c;
 const shift=side*t*(h?.075:(m?.018:.027))*(1-smooth(.72,.91,y))*legWeight;
 nx+=shift;
 return [nx,ny,nz];
}

function deformPoint(x,y,z,meta,o){
 if(o.pftFat&&(o.profile==='extreme'||o.profile==='larger'||o.profile==='moderate')){
  if(meta.kind==='skin')return pftReferenceSurface(x,y,z,o);
  // Retain all atlas organ changes, but pose arms/legs once, not twice.
  const zeroPose={...o,pftFat:{...o.pftFat,subcutaneous:0},bodyFat:12};
  const p=legacyDeformPoint(x,y,z,meta,zeroPose);
  const arm=meta.isArm?1:0;
  const leg=meta.kind==='organ'?0:(Math.abs(meta.center[0])<.18&&meta.center[1]<.88?1:0);
  return pftDisplayPose(...p,x,y,z,o,arm,leg);
 }
 return legacyDeformPoint(x,y,z,meta,o);
}

function muscleFrame(g,center){
 const p=g.attributes.position,cov=[0,0,0,0,0,0];
 for(let i=0;i<p.count;i++){const x=p.getX(i)-center[0],y=p.getY(i)-center[1],z=p.getZ(i)-center[2];cov[0]+=x*x;cov[1]+=x*y;cov[2]+=x*z;cov[3]+=y*y;cov[4]+=y*z;cov[5]+=z*z}
 let axis=[.2,1,.1];for(let j=0;j<12;j++){const [x,y,z]=axis,v=[cov[0]*x+cov[1]*y+cov[2]*z,cov[1]*x+cov[3]*y+cov[4]*z,cov[2]*x+cov[4]*y+cov[5]*z],l=Math.hypot(...v)||1;axis=v.map(n=>n/l)}
 if(axis[1]<0)axis=axis.map(n=>-n);
 const side=Math.abs(axis[2])<.9?[axis[1],-axis[0],0]:[0,axis[2],-axis[1]],l=Math.hypot(...side)||1;for(let i=0;i<3;i++)side[i]/=l;
 let axisMin=Infinity,axisMax=-Infinity;for(let i=0;i<p.count;i++){const t=(p.getX(i)-center[0])*axis[0]+(p.getY(i)-center[1])*axis[1]+(p.getZ(i)-center[2])*axis[2];axisMin=Math.min(axisMin,t);axisMax=Math.max(axisMax,t)}
 return {axis,transverse:side,axisMin,axisMax};
}
function fiberCoordinate(x,y,z,r){
 const n=r.name.toLowerCase(),side=Math.sign(r.center[0])||1,dx=x-r.center[0],dy=y-r.center[1],dz=z-r.center[2];
 let u=dx*r.transverse[0]+dy*r.transverse[1]+dz*r.transverse[2],v=dx*r.axis[0]+dy*r.axis[1]+dz*r.axis[2];
 // Fan muscles converge toward their attachment; long limb muscles retain
 // longitudinal fascicles. Fine striation is illustrative material detail.
 if(/pectoralis_major/.test(n))u=Math.atan2(y-1.345,side*x-.198)*.035;
 else if(/latissimus/.test(n))u=Math.atan2(y-1.355,side*x-.177)*.038;
 else if(/deltoid/.test(n))u=Math.atan2(side*x-.205,y-1.265)*.025;
 else if(/trapezius/.test(n))u=(y+(side*x)*(/ascending/.test(n)?.60:/descending/.test(n)?-.72:.08))*.74;
 return [u,v,r.connective?0:1];
}
function refineSkinGeometry(source){
 const entries=Object.entries(source.attributes), arrays=Object.fromEntries(entries.map(([k,a])=>[k,Array.from(a.array)]));
 const edges=new Map(),idx=source.index.array,out=[];
 let next=source.attributes.position.count;
 function mid(a,b){
  const lo=Math.min(a,b),hi=Math.max(a,b),key=lo+':'+hi;
  if(edges.has(key))return edges.get(key);
  const n=next++;edges.set(key,n);
  for(const [name,attr] of entries){const size=attr.itemSize,target=arrays[name];for(let j=0;j<size;j++)target.push((attr.array[a*size+j]+attr.array[b*size+j])*.5)}
  return n;
 }
 for(let i=0;i<idx.length;i+=3){const a=idx[i],b=idx[i+1],c=idx[i+2],ab=mid(a,b),bc=mid(b,c),ca=mid(c,a);out.push(a,ab,ca,ab,b,bc,ca,bc,c,ab,bc,ca)}
 const g=new T.BufferGeometry();for(const [name,a] of entries)g.setAttribute(name,new T.Float32BufferAttribute(arrays[name],a.itemSize,a.normalized));
 g.setIndex(out);g.computeVertexNormals();g.computeBoundingSphere();return g;
}

function buildBatch(scene,kind){
 scene.updateMatrixWorld(true);const parts=[],ranges=[];let vertexCount=0,indexCount=0;
 scene.traverse(node=>{if(!node.isMesh)return;const g=node.geometry.clone().applyMatrix4(node.matrixWorld);g.computeBoundingBox();const min=g.boundingBox.min.toArray(),max=g.boundingBox.max.toArray(),center=min.map((v,i)=>(v+max[i])/2),name=node.name,group=kind==='muscle'?classify(name,center):null;
  const isArm=(Math.abs(center[0])>.15&&center[1]>.65&&center[1]<1.44&&!/pectoralis|latissimus|trapezius|scapul|clavicl|rib/i.test(name));
  const count=g.attributes.position.count,ic=g.index?g.index.count:count;
  ranges.push({name,kind,group,isArm,min,max,center,connective:connective(name),...muscleFrame(g,center),start:vertexCount,count,indexStart:indexCount,indexCount:ic});parts.push(g);vertexCount+=count;indexCount+=ic;
 });
 const names=new Set(ranges.map(r=>r.name));for(const r of ranges)r.paired=/[lr]$/.test(r.name)&&names.has(r.name.slice(0,-1)+(r.name.endsWith('l')?'r':'l'));
 const positions=new Float32Array(vertexCount*3),normals=new Float32Array(vertexCount*3),colors=new Float32Array(vertexCount*3),fiber=new Float32Array(vertexCount*3),indices=new Uint32Array(indexCount);
 parts.forEach((g,j)=>{const r=ranges[j],p=g.attributes.position,n=g.attributes.normal,c=g.attributes.color;for(let i=0;i<r.count;i++){const k=(r.start+i)*3;positions[k]=p.getX(i);positions[k+1]=p.getY(i);positions[k+2]=p.getZ(i);normals[k]=n?.getX(i)||0;normals[k+1]=n?.getY(i)||1;normals[k+2]=n?.getZ(i)||0;colors[k]=c?c.getX(i):.65;colors[k+1]=c?c.getY(i):.20;colors[k+2]=c?c.getZ(i):.17}for(let i=0;i<r.indexCount;i++)indices[r.indexStart+i]=r.start+(g.index?g.index.getX(i):i);g.dispose()});
 for(const r of ranges)for(let i=r.start;i<r.start+r.count;i++){const k=i*3,v=fiberCoordinate(positions[k],positions[k+1],positions[k+2],r);fiber[k]=v[0];fiber[k+1]=v[1];fiber[k+2]=v[2]}
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(positions,3));geometry.setAttribute('normal',new T.BufferAttribute(normals,3));geometry.setAttribute('color',new T.BufferAttribute(colors,3));geometry.setAttribute('anatomyFiber',new T.BufferAttribute(fiber,3));geometry.setIndex(new T.BufferAttribute(indices,1));geometry.computeBoundingSphere();
 geometry.setAttribute('anatomyReference',new T.BufferAttribute(positions.slice(),3));
 if(kind==='skin'||kind==='organ')geometry.setAttribute('anatomyCoverage',new T.BufferAttribute(new Float32Array(vertexCount).fill(kind==='organ'?1:0),1));
 if(kind==='skin'){
  const refined=refineSkinGeometry(geometry);geometry.dispose();
  for(const r of ranges){r.start=0;r.count=refined.attributes.position.count;r.indexStart=0;r.indexCount=refined.index.count}
  return {geometry:refined,ranges,base:refined.attributes.position.array.slice(),baseColors:refined.attributes.color.array.slice(),kind};
 }
 return {geometry,ranges,base:positions.slice(),baseColors:colors.slice(),kind};
}
function deformBatch(batch,o){
 const p=batch.geometry.attributes.position.array,coverage=batch.kind==='skin'?batch.geometry.attributes.anatomyCoverage:null;
 const options={...o,_ratios:Object.fromEntries(['arms','legs','chest','back'].map(k=>[k,muscleRatio(o,k)]))};
 const useTargets=batch.kind==='skin'&&o.pftFat&&(o.profile==='extreme'||o.profile==='larger');
 if(useTargets){
  batch.shapeTargets ||= {};
  let cache=batch.shapeTargets[o.profile];
  if(!cache){
   const tvalues=o.profile==='extreme'?[0,.5,1]:[0,1],max=o.profile==='extreme'?1.18:1.14;
   const target=tvalues.map(t=>{
    const targetOptions={...options,pftFat:{...o.pftFat,subcutaneous:t*max,visceral:0}},array=new Float32Array(batch.base.length);
    for(let i=0;i<array.length;i+=3){const q=pftReferenceSurface(batch.base[i],batch.base[i+1],batch.base[i+2],targetOptions);array[i]=q[0];array[i+1]=q[1];array[i+2]=q[2]}
    return array;
   });
   const vis=new Float32Array(batch.base.length);
   for(let i=0;i<vis.length;i+=3){const q=visceralDisplacement(batch.base[i],batch.base[i+1],batch.base[i+2],1);vis[i]=q[0];vis[i+1]=q[1];vis[i+2]=q[2]}
   const masks=new Float32Array(batch.base.length/3);
   for(let i=0;i<masks.length;i++)masks[i]=pftFatMask(batch.base[i*3],batch.base[i*3+1],batch.base[i*3+2]);
   cache=batch.shapeTargets[o.profile]={target,vis,masks};
  }
  const t=pftShapeProgress(options),hyper=o.profile==='extreme',a=hyper&&t>.5?1:0,b=a+1,u=hyper?(t<=.5?t*2:(t-.5)*2):t;
  for(let k=0;k<p.length;k++)p[k]=cache.target[a][k]+u*(cache.target[b][k]-cache.target[a][k])+cache.vis[k]*(o.pftFat.visceral||0);
  if(coverage){const amount=smooth(0,.12,o.pftFat.subcutaneous);for(let i=0;i<coverage.count;i++)coverage.array[i]=cache.masks[i]*amount}
 }else{
  for(const r of batch.ranges)for(let i=r.start;i<r.start+r.count;i++){const k=i*3,v=deformPoint(batch.base[k],batch.base[k+1],batch.base[k+2],r,options);p[k]=v[0];p[k+1]=v[1];p[k+2]=v[2];if(coverage)coverage.array[i]=fatCoverage(batch.base[k],batch.base[k+1],batch.base[k+2],options)}
 }
 batch.geometry.attributes.position.needsUpdate=true;if(coverage)coverage.needsUpdate=true;
 batch.geometry.computeVertexNormals();batch.geometry.computeBoundingSphere();
}
function pftFatMask(x,y,z){
 const w=pftOwnership(x,y,z);
 return clamp(w.torso+w.legs*smooth(.13,.32,y)+w.arms*smooth(.85,1.03,y));
}

function updateOrganColors(batch,options){
 const c=batch.geometry.attributes.color.array;
 const coverage=batch.geometry.attributes.anatomyCoverage;
 for(const r of batch.ranges){
  const isVisceral=/omentum|mesocolon/i.test(r.name),isLiver=/^Liver$/i.test(r.name),isPancreas=/^Pancreas$/i.test(r.name);
  const key=isLiver?'liver':isPancreas?'pancreas':null;
  const fat=key?clamp(options.pftFat?.[key]??options.depots?.[key]??0):isVisceral?pftVisceralTissue(options):0;
  for(let i=r.start;i<r.start+r.count;i++){
   const j=i*3,x=batch.base[j],y=batch.base[j+1],z=batch.base[j+2];
   const texture=pftTissueNoise(x,y,z);
   if(coverage)coverage.array[i]=isVisceral&&options.pftFat?pftVisceralCoverage(x,y,z,options):1;
   // Normal pancreas is warm pink/tan, not the old gold baseline that made
   // fatty change appear to be present before the pancreas marker.
   const base=isPancreas&&options.pftFat?[.63,.32,.245]:null;
   let mix=0,target=[0,0,0];
   if(isVisceral){mix=.28+.36*fat;target=[.84,.65,.28]}
   else if(isLiver){mix=Math.pow(fat,.60)*(.84+.12*texture);target=[.90,.66,.115]}
   else if(isPancreas){mix=Math.pow(fat,.60)*(.87+.10*texture);target=[.92,.73,.205]}
   for(let axis=0;axis<3;axis++){
    const baseline=base?base[axis]:batch.baseColors[j+axis];
    c[j+axis]=clamp(baseline*(1-mix)+target[axis]*mix);
   }
  }
 }
 batch.geometry.attributes.color.needsUpdate=true;
 if(coverage)coverage.needsUpdate=true;
}
// Internal mode uses a real aperture in the triangle geometry. Removing
// the front wall must not depend on a fragment-shader hook or material cache.
// The untouched batches remain available for the other anatomy layers.
const INTERNAL_APERTURE={x:0,y:1.055,rx:.145,ry:.245,z:-.030};
const OMENTAL_APERTURE={x:.004,y:.984,rx:.071,ry:.100,z:-Infinity};
function clipInternalGeometry(source,kind,ranges=[]){
 const attrs=Object.entries(source.attributes),extra=Object.fromEntries(attrs.map(([name])=>[name,[]])),index=source.index.array,indices=[],groups=[],pickRanges=[],interpolation=[];
 let vertexCount=source.attributes.position.count;
 const parts=ranges.length?ranges.map(r=>({...r,materialIndex:source.groups.find(g=>g.start===r.indexStart)?.materialIndex||0})):[{indexStart:0,indexCount:index.length,materialIndex:0}];
 function appendVertex(a,b,t){const id=vertexCount++;interpolation.push(a.id,b.id,t);for(const [name,attr] of attrs){const target=extra[name];for(let k=0;k<attr.itemSize;k++)target.push(a.values[name][k]+(b.values[name][k]-a.values[name][k])*t)}const values=Object.fromEntries(attrs.map(([name,attr])=>[name,extra[name].slice(-attr.itemSize)]));return {id,values}}
 function vertex(id){return {id,values:Object.fromEntries(attrs.map(([name,attr])=>[name,Array.from(attr.array.subarray(id*attr.itemSize,(id+1)*attr.itemSize))]))}}
 function split(poly,plane,keepInside){const out=[];if(!poly.length)return out;let a=poly[poly.length-1],da=plane(a),inA=keepInside?da<=1e-9:da>=-1e-9;for(const b of poly){const db=plane(b),inB=keepInside?db<=1e-9:db>=-1e-9;if(inA!==inB)out.push(appendVertex(a,b,da/(da-db)));if(inB)out.push(b);a=b;da=db;inA=inB}return out}
 function emit(poly){for(let i=1;i<poly.length-1;i++)indices.push(poly[0].id,poly[i].id,poly[i+1].id)}
 const coordinate=kind==='skin'?'position':'anatomyReference',coordinateArray=source.attributes[coordinate].array;
 // The small upper window reveals the pancreatic gland behind the stomach
 // and transverse mesentery. It is a teaching cutaway, not absent real tissue.
 const pancreasWindow={x:.012,y:1.127,rx:.083,ry:.045,z:-Infinity};
 function subtractWindow(poly,window){
  const q=poly.map(v=>v.values[coordinate]),xs=q.map(p=>(p[0]-window.x)/window.rx),ys=q.map(p=>(p[1]-window.y)/window.ry);
  const near=a=>Math.min(...a)>0?Math.min(...a):Math.max(...a)<0?-Math.max(...a):0;
  if(near(xs)**2+near(ys)**2>=1)return [poly];
  const n=64,edge=Math.cos(Math.PI/n),outside=[];
  if(xs.every((x,i)=>x*x+ys[i]*ys[i]<edge*edge))return outside;
  for(let j=0;j<n&&poly.length;j++){
   const angle=(j+.5)*Math.PI*2/n,c=Math.cos(angle),s=Math.sin(angle);
   const plane=v=>(v.values[coordinate][0]-window.x)/window.rx*c+(v.values[coordinate][1]-window.y)/window.ry*s-edge;
   const distances=poly.map(plane);
   if(distances.every(d=>d<=1e-9))continue;
   if(distances.every(d=>d>=-1e-9)){outside.push(poly);poly=[];break;}
   const fragment=split(poly,plane,false);if(fragment.length>=3)outside.push(fragment);
   poly=split(poly,plane,true);
  }
  return outside;
 }
 for(const part of parts){const first=indices.length,cut=kind!=='organ'?INTERNAL_APERTURE:/omentum/i.test(part.name)?OMENTAL_APERTURE:null;
  if(kind==='organ'&&/omentum|mesocolon/i.test(part.name)){
   const windows=/omentum/i.test(part.name)?[OMENTAL_APERTURE,pancreasWindow]:[pancreasWindow];
   for(let j=part.indexStart;j<part.indexStart+part.indexCount;j+=3){
    let fragments=[[vertex(index[j]),vertex(index[j+1]),vertex(index[j+2])]];
    for(const window of windows){const next=[];for(const poly of fragments)next.push(...subtractWindow(poly,window));fragments=next;}
    for(const poly of fragments)emit(poly);
   }
  }
  else if(!cut){for(let i=part.indexStart;i<part.indexStart+part.indexCount;i++)indices.push(index[i])}
  else {const n=96,edge=Math.cos(Math.PI/n),planes=[];
   if(Number.isFinite(cut.z))planes.push(v=>cut.z-v.values[coordinate][2]);
   for(let i=0;i<n;i++){const angle=(i+.5)*Math.PI*2/n,c=Math.cos(angle),d=Math.sin(angle);planes.push(v=>(v.values[coordinate][0]-cut.x)/cut.rx*c+(v.values[coordinate][1]-cut.y)/cut.ry*d-edge)}
   for(let i=part.indexStart;i<part.indexStart+part.indexCount;i+=3){const ia=index[i],ib=index[i+1],ic=index[i+2],a=ia*3,b=ib*3,c=ic*3,ax=(coordinateArray[a]-cut.x)/cut.rx,ay=(coordinateArray[a+1]-cut.y)/cut.ry,az=coordinateArray[a+2],bx=(coordinateArray[b]-cut.x)/cut.rx,by=(coordinateArray[b+1]-cut.y)/cut.ry,bz=coordinateArray[b+2],cx=(coordinateArray[c]-cut.x)/cut.rx,cy=(coordinateArray[c+1]-cut.y)/cut.ry,cz=coordinateArray[c+2],minX=Math.min(ax,bx,cx),maxX=Math.max(ax,bx,cx),minY=Math.min(ay,by,cy),maxY=Math.max(ay,by,cy),nearX=minX>0?minX:maxX<0?-maxX:0,nearY=minY>0?minY:maxY<0?-maxY:0;
    if(Math.max(az,bz,cz)<=cut.z||nearX*nearX+nearY*nearY>=1){indices.push(ia,ib,ic);continue}
    if(ax*ax+ay*ay<edge*edge&&bx*bx+by*by<edge*edge&&cx*cx+cy*cy<edge*edge&&Math.min(az,bz,cz)>cut.z)continue;
    const ids=[ia,ib,ic];
    let poly=ids.map(vertex);for(const plane of planes){if(!poly.length)break;const distances=poly.map(plane);if(distances.every(v=>v<=1e-9))continue;if(distances.every(v=>v>=-1e-9)){emit(poly);poly=[];break}emit(split(poly,plane,false));poly=split(poly,plane,true)}
   }
  }
  const count=indices.length-first;if(count){groups.push({start:first,count,materialIndex:part.materialIndex});pickRanges.push({...part,indexStart:first,indexCount:count})}
 }
 const geometry=new T.BufferGeometry();for(const [name,attr] of attrs){const values=new Float32Array(attr.array.length+extra[name].length);values.set(attr.array);values.set(extra[name],attr.array.length);geometry.setAttribute(name,new T.BufferAttribute(values,attr.itemSize,attr.normalized))}geometry.setIndex(indices);geometry.groups=groups;geometry.userData.anatomyRanges=pickRanges;geometry.userData.anatomyInterpolation=new Float64Array(interpolation);geometry.userData.sourceVertexCount=source.attributes.position.count;geometry.computeBoundingSphere();return geometry;
}
function refreshClippedAttributes(geometry,source){
 // Muscle, bone and organ apertures use fixed atlas coordinates. Reuse
 // their topology and interpolate only updated positions/colors; a changed
 // calorie input must not rebuild a half-million-triangle cutaway.
 const interpolation=geometry.userData.anatomyInterpolation,baseCount=geometry.userData.sourceVertexCount;
 for(const [name,attr] of Object.entries(source.attributes)){const target=geometry.attributes[name],values=target.array,n=attr.itemSize;values.set(attr.array);for(let j=0;j<interpolation.length;j+=3){const a=interpolation[j]*n,b=interpolation[j+1]*n,t=interpolation[j+2],out=(baseCount+j/3)*n;for(let k=0;k<n;k++)values[out+k]=values[a+k]+(values[b+k]-values[a+k])*t}target.needsUpdate=true}geometry.computeBoundingSphere();
}
function fatSurfaceMaterial({vertexColors=false,opacity=1,omentalWindow=false}={}){
 // Alpha-hashed coverage avoids order-dependent back-face triangles in the old
 // transparent shell. Tissue remains matte, not a glass or membrane material.
 const material=new T.MeshPhysicalMaterial({color:vertexColors?0xffffff:0xdac08a,vertexColors,
  transparent:false,alphaHash:true,opacity,roughness:.86,metalness:0,depthWrite:true,
  side:omentalWindow?T.DoubleSide:T.FrontSide,clearcoat:0,specularIntensity:.32});
 material.onBeforeCompile=shader=>{
  shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nattribute float anatomyCoverage; attribute vec3 anatomyReference; varying float vAnatomyCoverage; varying vec3 vFatReference;').replace('#include <begin_vertex>','#include <begin_vertex>\nvAnatomyCoverage=anatomyCoverage;vFatReference=anatomyReference;');
  shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>
varying float vAnatomyCoverage; varying vec3 vFatReference;
float fatHash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
float fatNoise(vec3 p){
 vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
 return mix(mix(mix(fatHash(i),fatHash(i+vec3(1,0,0)),f.x),mix(fatHash(i+vec3(0,1,0)),fatHash(i+vec3(1,1,0)),f.x),f.y),mix(mix(fatHash(i+vec3(0,0,1)),fatHash(i+vec3(1,0,1)),f.x),mix(fatHash(i+vec3(0,1,1)),fatHash(i+vec3(1,1,1)),f.x),f.y),f.z);
}
`).replace('#include <color_fragment>',`#include <color_fragment>
float fatMask=clamp(vAnatomyCoverage,0.,1.);diffuseColor.a*=fatMask;if(diffuseColor.a<.002)discard;
float fatRelief=fatNoise(vFatReference*175.0)+.23*fatNoise(vFatReference*410.0);
float fatTone=fatNoise(vFatReference*44.0);
diffuseColor.rgb*=.89+.15*fatTone;
diffuseColor.rgb+=vec3(.018,.012,.003)*(fatRelief-.6);
`).replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
vec3 fatDx=dFdx(-vViewPosition),fatDy=dFdy(-vViewPosition);
vec3 fatR1=cross(fatDy,normal),fatR2=cross(normal,fatDx);
float fatDet=dot(fatDx,fatR1);
vec3 fatGrad=sign(fatDet)*(dFdx(fatRelief)*fatR1+dFdy(fatRelief)*fatR2);
normal=normalize(abs(fatDet)*normal-.00015*fatGrad);
`);
 };
 material.customProgramCacheKey=()=> 'pft-tissue-v11-'+(omentalWindow?'omental':'surface');
 return material;
}

function buildCutawayContext(skinGeometry,options={}){
 // A teaching section needs a cut surface, not a paper-thin shell. Sample
 // the actual deformed envelope at the aperture and connect it to a fixed
 // inner edge. This is display geometry, never a quantified fat depot.
 const ray=new T.Raycaster(),probeMaterial=new T.MeshBasicMaterial({side:T.DoubleSide}),probeGeometry=new T.BufferGeometry(),p=skinGeometry.attributes.position,idx=skinGeometry.index.array,candidates=[];
 // Only triangles crossing the elliptical rim can be hit by these rays.
 // Filtering once avoids 128 raycasts through the complete body mesh.
 for(let i=0;i<idx.length;i+=3){const a=idx[i],b=idx[i+1],c=idx[i+2],ax=p.getX(a)/.145,ay=(p.getY(a)-1.055)/.245,bx=p.getX(b)/.145,by=(p.getY(b)-1.055)/.245,cx=p.getX(c)/.145,cy=(p.getY(c)-1.055)/.245,minX=Math.min(ax,bx,cx),maxX=Math.max(ax,bx,cx),minY=Math.min(ay,by,cy),maxY=Math.max(ay,by,cy),nearX=minX>0?minX:maxX<0?-maxX:0,nearY=minY>0?minY:maxY<0?-maxY:0;if(Math.max(p.getZ(a),p.getZ(b),p.getZ(c))>-.03&&nearX*nearX+nearY*nearY<=1&&Math.max(ax*ax+ay*ay,bx*bx+by*by,cx*cx+cy*cy)>=1)candidates.push(a,b,c)}
 probeGeometry.setAttribute('position',p);probeGeometry.setIndex(candidates);probeGeometry.boundingSphere=skinGeometry.boundingSphere;
 const probe=new T.Mesh(probeGeometry,probeMaterial),points=[],positions=[],indices=[],count=128;probe.updateMatrixWorld(true);
 for(let i=0;i<count;i++){const a=i/count*Math.PI*2,x=.145*Math.cos(a),y=1.055+.245*Math.sin(a);ray.set(new T.Vector3(x,y,1),new T.Vector3(0,0,-1));const hit=ray.intersectObject(probe,false).find(h=>h.point.z>-.03);points.push(hit?[x,y,hit.point.z]:null)}
 probeMaterial.dispose();probeGeometry.dispose();
 for(let i=0;i<count;i++){const a=points[i],b=points[(i+1)%count];if(!a||!b)continue;const start=positions.length/3;const inner=(point)=>{const thickness=.006+(options.pftFat?.subcutaneous||0)*.13*bell(point[1],1.025,.29);return [point[0]*.985,1.055+(point[1]-1.055)*.985,point[2]-thickness];};positions.push(...a,...b,...inner(b),...inner(a));indices.push(start,start+1,start+2,start,start+2,start+3)}
 const rim=new T.BufferGeometry();rim.setAttribute('position',new T.Float32BufferAttribute(positions,3));rim.setAttribute('anatomyReference',new T.Float32BufferAttribute(positions,3));rim.setAttribute('anatomyCoverage',new T.Float32BufferAttribute(new Float32Array(positions.length/3).fill(1),1));rim.setIndex(indices);rim.computeVertexNormals();
 const cavity=new T.SphereGeometry(1,48,36,0,Math.PI,0,Math.PI);cavity.rotateY(Math.PI);cavity.scale(.15,.25,.065);cavity.translate(0,1.055,-.047);cavity.computeVertexNormals();
 return {rim,cavity};
}
function assetBytes(id,path){const el=typeof document!=='undefined'?document.getElementById(id):null;if(el){const text=el.textContent.trim(),binary=atob(text),out=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)out[i]=binary.charCodeAt(i);return Promise.resolve(out.buffer)}return fetch(path).then(r=>{if(!r.ok)throw Error('Anatomy file unavailable');return r.arrayBuffer()})}
function muscleMaterial(){
 const material=new T.MeshPhysicalMaterial({vertexColors:true,roughness:.58,metalness:0,clearcoat:.10,clearcoatRoughness:.6,sheen:.22,sheenColor:0xd88177,sheenRoughness:.9,side:T.DoubleSide});
 material.onBeforeCompile=shader=>{
  shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nattribute vec3 anatomyFiber; varying vec3 vAnatomyFiber;');
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvAnatomyFiber = anatomyFiber;');
  shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>
varying vec3 vAnatomyFiber;
float anatomyFiberHeight(vec2 p) {
 float phase=p.x*4400.0+1.1*sin(p.y*53.0)+.36*sin(p.y*177.0);
 float antialias=1.0-smoothstep(.7,2.6,fwidth(phase));
 return antialias*(.65*sin(phase)+.22*sin(phase*2.13)+.13*sin(phase*.43));
}`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
float fiberHeight=anatomyFiberHeight(vAnatomyFiber.xy);
float fleshMask=vAnatomyFiber.z*smoothstep(.10,.28,diffuseColor.r-diffuseColor.g);
diffuseColor.rgb*=1.0+fiberHeight*.105*fleshMask;
diffuseColor.rgb*=.93+.07*sin(vAnatomyFiber.y*24.0+vAnatomyFiber.x*18.0);
`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
vec3 fiberDx=dFdx(-vViewPosition),fiberDy=dFdy(-vViewPosition);
vec3 fiberR1=cross(fiberDy,normal),fiberR2=cross(normal,fiberDx);
float fiberDet=dot(fiberDx,fiberR1);
vec3 fiberGrad=sign(fiberDet)*(dFdx(fiberHeight)*fiberR1+dFdy(fiberHeight)*fiberR2);
normal=normalize(abs(fiberDet)*normal-.000016*fleshMask*fiberGrad);
`);
 };
 material.customProgramCacheKey=()=> 'anatomy-fascicles-v9';return material;
}
function create(canvas,callbacks={}){
 if(!T)throw Error('3D library unavailable');
 const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio||1,2));renderer.setSize(720,1080,false);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.04;
 if(renderer.shadowMap){renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true}
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(32,2/3,.05,30),body=new T.Group();scene.add(body);
 const hemi=new T.HemisphereLight(0xe7f0fb,0x262b30,1.08);scene.add(hemi);const key=new T.DirectionalLight(0xffe5d4,2.6);key.position.set(-2,3,4);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-1,right:1,top:2,bottom:-.2,near:.1,far:8});key.shadow.bias=-.0001;key.shadow.normalBias=.002;scene.add(key);const fill=new T.DirectionalLight(0xa9cfea,1.65);fill.position.set(3,2,-2);scene.add(fill);
 // A restrained neutral fill follows the viewing direction. The fixed key
 // still provides relief and anatomical shadows; rotating to the back no
 // longer moves the inspected muscles into an unlit side of the studio.
 // It casts no shadow, so dragging never rebuilds the dense shadow map.
 const front=new T.DirectionalLight(0xfff7ee,.78);front.name='Anatomy_inspection_fill';front.target.position.set(0,.87,0);scene.add(front,front.target);
 const ground=new T.Mesh(new T.CircleGeometry(.57,80),new T.MeshBasicMaterial({color:0x38566b,transparent:true,opacity:.14,depthWrite:false}));ground.rotation.x=-Math.PI/2;ground.position.y=-.012;scene.add(ground);
 const ring=new T.Mesh(new T.RingGeometry(.48,.485,100),new T.MeshBasicMaterial({color:0x8bb4cc,transparent:true,opacity:.23,side:T.DoubleSide,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.position.y=-.010;scene.add(ring);
 const externalMat=new T.MeshPhysicalMaterial({color:0xc3a18b,roughness:.72,metalness:0,clearcoat:.025,side:T.DoubleSide});
 const muscleMat=muscleMaterial();const boneMat=new T.MeshStandardMaterial({color:0xe5deca,roughness:.78,metalness:0});const skinMat=fatSurfaceMaterial({opacity:.45});const organMat=new T.MeshPhysicalMaterial({vertexColors:true,roughness:.48,metalness:0,side:T.DoubleSide,clearcoat:.08,clearcoatRoughness:.65});
 const visceralMat=fatSurfaceMaterial({vertexColors:true,omentalWindow:true}),mesentericMat=fatSurfaceMaterial({vertexColors:true,omentalWindow:false}),stomachMat=organMat.clone();
 const cutfaceMat=fatSurfaceMaterial(),cavityMat=new T.MeshStandardMaterial({color:0x482b28,roughness:.9,side:T.DoubleSide});cutfaceMat.side=T.DoubleSide;
 // A translucent stomach is an explicit teaching cutaway: it reveals the
 // pancreas behind it while the liver and bowel retain solid depth cues.
 stomachMat.transparent=true;stomachMat.opacity=.28;stomachMat.depthWrite=false;
 const internalGeometry={};let internalGeometryKey='';
 const comparisonScene=new T.Scene(),comparisonTarget=new T.WebGLRenderTarget(720,1080,{minFilter:T.LinearFilter,magFilter:T.LinearFilter,depthBuffer:true}),maskMat=new T.MeshBasicMaterial({color:0xffffff,side:T.DoubleSide,toneMapped:false});
 comparisonTarget.samples=Math.min(4,renderer.capabilities?.maxSamples||0);
 const overlayScene=new T.Scene(),overlayCamera=new T.OrthographicCamera(-1,1,1,-1,0,1),outlineMat=new T.ShaderMaterial({transparent:true,depthWrite:false,depthTest:false,uniforms:{outlineColor:{value:new T.Color(0x7de6f2)},maskMap:{value:comparisonTarget.texture},texel:{value:new T.Vector2(1/720,1/1080)}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}',fragmentShader:'uniform vec3 outlineColor;uniform sampler2D maskMap;uniform vec2 texel;varying vec2 vUv;void main(){float lo=1.0;float hi=0.0;for(int x=-1;x<=1;x++){for(int y=-1;y<=1;y++){float a=texture2D(maskMap,vUv+vec2(float(x),float(y))*texel*1.25).a;lo=min(lo,a);hi=max(hi,a);}}float line=hi-lo;if(line<.02)discard;gl_FragColor=vec4(outlineColor,line*.82);}'}),overlayQuad=new T.Mesh(new T.PlaneGeometry(2,2),outlineMat);overlayScene.add(overlayQuad);
 const batches={},meshes={},contextMeshes={};let contextKey='',yaw=0,pitch=.035,distance=3.15,targetY=.87,framing='full',focus='all',layer='composition',opacity=.45,ready=false,lastOptions=null,lastKey='',framePending=false,disposed=false,comparison=false,comparisonOptions=null,comparisonBatch=null,comparisonMesh=null,comparisonKind='',comparisonKey='',viewportWidth=720,viewportHeight=1080;
 function draw(){if(disposed||framePending)return;framePending=true;requestAnimationFrame(()=>{framePending=false;if(disposed)return;const r=canvas.getBoundingClientRect(),w=Math.max(1,Math.round(r.width||720)),h=Math.max(1,Math.round(r.height||1080));if(w!==viewportWidth||h!==viewportHeight){viewportWidth=w;viewportHeight=h;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();comparisonTarget.setSize(w,h);outlineMat.uniforms.texel.value.set(1/w,1/h)}camera.position.set(Math.sin(yaw)*Math.cos(pitch)*distance,targetY+Math.sin(pitch)*distance,Math.cos(yaw)*Math.cos(pitch)*distance);camera.lookAt(0,targetY,0);front.target.position.set(0,targetY,0);front.position.set(camera.position.x+Math.cos(yaw)*.8,camera.position.y+.6,camera.position.z-Math.sin(yaw)*.8);const compare=ready&&comparisonMesh?.visible&&typeof renderer.setRenderTarget==='function';renderer.render(scene,camera);if(compare){renderer.setRenderTarget(comparisonTarget);renderer.render(comparisonScene,camera);renderer.setRenderTarget(null);renderer.autoClear=false;renderer.render(overlayScene,overlayCamera);renderer.autoClear=true}})}
 function setFraming(value){
  framing=value==='abdomen'?'abdomen':['upper','arms','chest','back'].includes(value)?'upper':['lower','legs'].includes(value)?'lower':'full';
  // Close inspection changes the camera, never the anatomical scale. Keep
  // rotation so a user can inspect back hypertrophy and compare like views.
  targetY=framing==='abdomen'?1.055:framing==='upper'?1.18:framing==='lower'?.48:.87;
  distance=framing==='abdomen'?1.42:framing==='upper'?1.95:framing==='lower'?1.95:3.15;
  pitch=.035;draw();
 }
 function refreshComparison(){
  if(!ready)return;
  const visible=comparison&&!!comparisonOptions&&layer!=='skeleton'&&layer!=='internal',kind=layer==='muscle'&&batches.muscle?'muscle':'skin';
  if(!visible){if(comparisonMesh)comparisonMesh.visible=false;return}
  if(comparisonKind!==kind){if(comparisonMesh){comparisonScene.remove(comparisonMesh);comparisonBatch.geometry.dispose()}const source=batches[kind];comparisonBatch={...source,geometry:source.geometry.clone()};comparisonMesh=new T.Mesh(comparisonBatch.geometry,maskMat);comparisonMesh.frustumCulled=false;comparisonScene.add(comparisonMesh);comparisonKind=kind;comparisonKey=''}
  comparisonMesh.visible=true;
  // Render the baseline to a depth-tested mask first, then trace only its
  // external silhouette. Internal atlas seams never become ghost outlines.
  const options=comparisonOptions,k=JSON.stringify(options);
  if(k!==comparisonKey){comparisonKey=k;deformBatch(comparisonBatch,options)}
 }
 function refreshInternalGeometry(){
  if(!ready)return;const internal=layer==='internal',key=lastKey+'|'+focus;
  if(internal&&key!==internalGeometryKey){internalGeometryKey=key;for(const [kind,batch] of Object.entries(batches)){if(internalGeometry[kind]&&kind!=='skin')refreshClippedAttributes(internalGeometry[kind],batch.geometry);else {internalGeometry[kind]?.dispose();internalGeometry[kind]=clipInternalGeometry(batch.geometry,kind,batch.ranges)}}}
  for(const [kind,mesh] of Object.entries(meshes))mesh.geometry=internal?internalGeometry[kind]:batches[kind].geometry;
 }
 function refreshContext(){
  if(!ready)return;const internal=layer==='internal';
  if(internal&&(!contextMeshes.rim||contextKey!==lastKey)){contextKey=lastKey;const geometry=buildCutawayContext(batches.skin.geometry,lastOptions||{});for(const kind of ['rim','cavity']){if(contextMeshes[kind])contextMeshes[kind].geometry.dispose();else{contextMeshes[kind]=new T.Mesh(undefined,kind==='rim'?cutfaceMat:cavityMat);contextMeshes[kind].name=kind==='rim'?'Illustrative_subcutaneous_cut_surface':'Illustrative_posterior_cavity';contextMeshes[kind].frustumCulled=false;contextMeshes[kind].renderOrder=kind==='rim'?2:0;body.add(contextMeshes[kind])}contextMeshes[kind].geometry=geometry[kind]}}
  for(const [kind,mesh] of Object.entries(contextMeshes))mesh.visible=internal&&(kind!=='rim'||opacity>0);
  cutfaceMat.opacity=opacity*(lastOptions?.pftFat?smooth(0,.055,lastOptions.pftFat.subcutaneous):1);cutfaceMat.transparent=false;cutfaceMat.alphaHash=true;cutfaceMat.depthWrite=true;cutfaceMat.needsUpdate=true;
 }
 function applyLayer(){
  if(!ready)return;const internal=layer==='internal',external=layer==='external';
  refreshInternalGeometry();if(meshes.muscle)meshes.muscle.visible=layer!=='skeleton'&&!external;if(meshes.bone)meshes.bone.visible=!external;if(meshes.organ)meshes.organ.visible=internal||(!meshes.muscle&&layer==='composition');
  meshes.skin.visible=external||((layer==='composition'||internal)&&opacity>0);meshes.skin.material=external?externalMat:skinMat;
  skinMat.opacity=opacity;skinMat.transparent=false;skinMat.alphaHash=true;skinMat.depthWrite=true;skinMat.needsUpdate=true;
  muscleMat.transparent=false;muscleMat.opacity=1;muscleMat.depthWrite=true;if(meshes.muscle){meshes.muscle.renderOrder=0;meshes.muscle.castShadow=!internal}if(meshes.bone)meshes.bone.castShadow=!internal;refreshContext();
  if(renderer.shadowMap)renderer.shadowMap.needsUpdate=true;refreshComparison();draw();
 }
 function setFocus(value){focus=value;if(!ready||!batches.muscle)return;const b=batches.muscle,c=b.geometry.attributes.color.array;for(const r of b.ranges){const match=focus==='all'||r.group===focus;for(let i=r.start;i<r.start+r.count;i++){const k=i*3;c[k]=match?(focus==='all'?b.baseColors[k]:.20):b.baseColors[k]*.35;c[k+1]=match?(focus==='all'?b.baseColors[k+1]:.64):b.baseColors[k+1]*.35;c[k+2]=match?(focus==='all'?b.baseColors[k+2]:.79):b.baseColors[k+2]*.35}}b.geometry.attributes.color.needsUpdate=true;refreshInternalGeometry();draw()}
 function update(options){lastOptions=options;if(!ready)return;const k=JSON.stringify(options);if(k===lastKey){draw();return}lastKey=k;for(const b of Object.values(batches))deformBatch(b,options);if(batches.organ)updateOrganColors(batches.organ,options);refreshInternalGeometry();refreshContext();if(renderer.shadowMap)renderer.shadowMap.needsUpdate=true;draw()}
 const loader=new T.GLTFLoader();if(T.MeshoptDecoder)loader.setMeshoptDecoder(T.MeshoptDecoder);
 const modelCfg=(typeof window!=='undefined'&&window.PFT_CONFIG&&window.PFT_CONFIG.models)||{};const parse=buffer=>new Promise((resolve,reject)=>loader.parse(buffer,'',g=>resolve(g.scene),reject));
 // V21: skin + organs are required; muscles and bones are optional extras.
 Promise.all([['muscle','anatomy-muscles-data',modelCfg.muscles],['bone','anatomy-bones-data',modelCfg.bones],['skin','anatomy-skin-data',modelCfg.skin||'assets/models/anatomy-skin.glb'],['organ','anatomy-organs-data',modelCfg.organs||'assets/models/anatomy-organs.glb']].filter(item=>item[2]).map(async([kind,id,path])=>({kind,scene:await parse(await assetBytes(id,path))}))).then(items=>{if(disposed)return;for(const item of items){const batch=buildBatch(item.scene,item.kind);batches[item.kind]=batch;
  if(item.kind==='organ')for(const r of batch.ranges)batch.geometry.addGroup(r.indexStart,r.indexCount,/omentum/i.test(r.name)?1:/mesocolon/i.test(r.name)?2:/^Stomach$/i.test(r.name)?3:0);
  const mesh=new T.Mesh(batch.geometry,item.kind==='muscle'?muscleMat:item.kind==='bone'?boneMat:item.kind==='organ'?[organMat,visceralMat,mesentericMat,stomachMat]:skinMat);mesh.frustumCulled=false;mesh.castShadow=item.kind==='muscle'||item.kind==='bone';mesh.receiveShadow=item.kind!=='skin';if(item.kind==='skin')mesh.renderOrder=3;meshes[item.kind]=mesh;body.add(mesh);item.scene.traverse(n=>{if(n.isMesh){n.geometry.dispose();for(const m of Array.isArray(n.material)?n.material:[n.material])m.dispose()}})}ready=true;if(lastOptions)update(lastOptions);setFocus(focus);applyLayer();callbacks.onReady?.();draw()}).catch(error=>callbacks.onError?.(error));
 const pointers=new Map();let dragged=0,lastPinch=null;const raycaster=new T.Raycaster();
 canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture?.(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});dragged=0});
 canvas.addEventListener('pointermove',e=>{const old=pointers.get(e.pointerId);if(!old)return;const dx=e.clientX-old.x,dy=e.clientY-old.y;dragged+=Math.abs(dx)+Math.abs(dy);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2){const v=[...pointers.values()],gap=Math.hypot(v[0].x-v[1].x,v[0].y-v[1].y);if(lastPinch)distance=clamp(distance*lastPinch/gap,1.2,5);lastPinch=gap}else{yaw-=dx*.009;pitch=clamp(pitch+dy*.006,-.5,.55)}draw()});
 function end(e){pointers.delete(e.pointerId);lastPinch=null;if(dragged<6&&ready){const r=canvas.getBoundingClientRect(),point=new T.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(point,camera);const kind=layer==='internal'?'organ':layer==='skeleton'?'bone':'muscle',batch=batches[kind];let range=null;
  const pickRanges=layer==='internal'?meshes[kind].geometry.userData.anatomyRanges:batch.ranges;
  for(const hit of raycaster.intersectObject(meshes[kind])){const candidate=pickRanges.find(x=>hit.faceIndex*3>=x.indexStart&&hit.faceIndex*3<x.indexStart+x.indexCount);if(!candidate)continue;
   // The translucent teaching stomach reveals the posterior pancreas.
   // Omental picking now follows its actual window geometry.
   if(kind==='organ'&&/^Stomach$/i.test(candidate.name))continue;
   if(kind==='organ'&&/omentum|mesocolon/i.test(candidate.name)&&lastOptions?.pftFat&&pftVisceralTissue(lastOptions)<=0)continue;
   range=candidate;break;
  }
  callbacks.onPick?.(range?readable(range.name,range.kind,range.paired):'')}}
 canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',e=>{pointers.delete(e.pointerId);lastPinch=null});canvas.addEventListener('wheel',e=>{e.preventDefault();distance=clamp(distance*Math.exp(e.deltaY*.001),1.2,5);draw()},{passive:false});
 canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','Home'].includes(e.key))return;e.preventDefault();if(e.key==='ArrowLeft')yaw+=.12;if(e.key==='ArrowRight')yaw-=.12;if(e.key==='ArrowUp')pitch=clamp(pitch+.08,-.5,.55);if(e.key==='ArrowDown')pitch=clamp(pitch-.08,-.5,.55);if(e.key==='+')distance=clamp(distance-.15,1.2,5);if(e.key==='-')distance=clamp(distance+.15,1.2,5);if(e.key==='Home'){yaw=0;setFraming('full')}draw()});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();callbacks.onError?.(Error('Graphics context lost'))});canvas.addEventListener('webglcontextrestored',()=>{callbacks.onReady?.();draw()});
 const resizeObserver=typeof ResizeObserver!=='undefined'?new ResizeObserver(draw):null;resizeObserver?.observe(canvas);
 draw();return {update,setFocus,setFraming,
  rotateBy:(angle)=>{yaw+=Number(angle)||0;draw()},
  inspect:()=>({ready,layer,opacity,framing,yaw,pitch,distance,options:lastOptions,renderer:'Three.js / WebGL',drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,batches:Object.fromEntries(Object.entries(batches).map(([k,b])=>[k,{vertices:b.geometry.attributes.position.count,triangles:b.geometry.index.count/3,parts:b.ranges.length,bounds:(b.geometry.computeBoundingBox(),{min:b.geometry.boundingBox.min.toArray(),max:b.geometry.boundingBox.max.toArray()})}]))}),
  organs:()=>{
   const batch=batches.organ;if(!batch)return null;
   const colors=batch.geometry.attributes.color.array,cover=batch.geometry.attributes.anatomyCoverage.array;
   return batch.ranges.filter(r=>/^(Liver|Pancreas|Greater_omentum|Mesocolon)$/.test(r.name)).map(r=>{
    const rgb=[0,0,0];let alpha=0;for(let i=r.start;i<r.start+r.count;i++){alpha+=cover[i];for(let k=0;k<3;k++)rgb[k]+=colors[i*3+k]}
    return {name:r.name,meanColor:rgb.map(v=>v/r.count),meanCoverage:alpha/r.count};
   });
  },
  sample:(kind,indices)=>{const b=batches[kind];if(!b)return null;const p=b.geometry.attributes.position.array;return indices.map(i=>Array.from(p.subarray(i*3,i*3+3)))},
  zoomBy:factor=>{if(Number.isFinite(factor)&&factor>0)distance=clamp(distance*factor,1.2,5);draw()},setComparison:(enabled,baselineOptions)=>{comparison=!!enabled;comparisonOptions=baselineOptions||comparisonOptions;refreshComparison();draw()},setLayer:(v,a)=>{layer=v;opacity=clamp(Number.isFinite(a)?a:opacity);applyLayer()},setView:v=>{yaw=({front:0,three:-.62,side:-Math.PI/2,back:Math.PI,left:Math.PI/2,right:-Math.PI/2,reset:0})[v]??0;pitch=.035;if(v==='reset')setFraming('full');callbacks.onPick?.('');draw()},destroy:()=>{disposed=true;resizeObserver?.disconnect();for(const b of Object.values(batches))b.geometry.dispose();for(const g of Object.values(internalGeometry))g.dispose();comparisonBatch?.geometry.dispose();comparisonTarget.dispose();outlineMat.dispose();maskMat.dispose();overlayQuad.geometry.dispose();ground.geometry.dispose();ground.material.dispose();ring.geometry.dispose();ring.material.dispose();externalMat.dispose();muscleMat.dispose();boneMat.dispose();skinMat.dispose();organMat.dispose();visceralMat.dispose();mesentericMat.dispose();stomachMat.dispose();cutfaceMat.dispose();cavityMat.dispose();for(const mesh of Object.values(contextMeshes))mesh.geometry.dispose();renderer.dispose()},get ready(){return ready},get framing(){return framing}};
}
return {create,classify,readable,deformPoint,pftReferenceSurface,pftShapeProgress,pftDisplayPose,buildBatch,deformBatch,muscleDisplacement,fatCoverage,visceralDisplacement,updateOrganColors,pftVisceralTissue,pftVisceralCoverage,buildCutawayContext,clipInternalGeometry,refreshClippedAttributes};
});

