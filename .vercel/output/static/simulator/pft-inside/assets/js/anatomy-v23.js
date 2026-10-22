/* Personal Fat Threshold V23 · lazy 3D anatomy runtime.
   V23: works from file:// (embedded model fallback), free orbit with inertia + pinch zoom, frame-table body states shared with the 2D renders, glycogen tint.
   Geometry: Theosis Medical procedural anatomy on a MakeHuman CC0 base, see CREDITS.md.
   Shape changes (fat pads, abdominal projection, omental fat, organ tint) are illustrative, not measurements. */
(function(){
  "use strict";
  const T=window.AnatomyThree;
  if(!T)return;
  const ROLE={Skin:"skin",Muscles:"muscle",Bones:"bone",Heart:"heart",Liver:"liver",Gallbladder:"gall",Stomach:"stomach",Pancreas:"pancreas",
    Duodenum:"intestine",Jejunum:"intestine",Ascending_colon:"colon",Transverse_colon:"colon",Descending_colon:"colon",Sigmoid_colon:"colon",
    Greater_omentum:"omentum",Mesentery:"mesentery",Spleen:"spleen",Arteries:"vessel","Kidney.l":"kidney","Kidney.r":"kidney",Urinary_bladder:"bladder",Nails:"nail",Lungs:"lung",Diaphragm:"diaphragm",Vena_cava:"vein"}; // anatomy pass: lungs, diaphragm, IVC
  const MUSCLE_NAMES=["Deltoid (anterior part)", "Deltoid (middle part)", "Deltoid (posterior part)", "Biceps brachii", "Brachialis", "Triceps brachii (long head)", "Triceps brachii (lateral head)", "Brachioradialis", "Forearm flexors", "Forearm extensors", "Extensor carpi radialis", "Rectus femoris", "Vastus lateralis", "Vastus medialis", "Sartorius", "Adductor group", "Tensor fasciae latae", "Biceps femoris", "Semitendinosus", "Gastrocnemius (medial head)", "Gastrocnemius (lateral head)", "Soleus", "Tibialis anterior", "Fibularis (peroneus) longus", "Soleus (medial)", "Pectoralis major", "Pectoralis major (abdominal part)", "Rectus abdominis", "Rectus abdominis", "Rectus abdominis", "Rectus abdominis", "External oblique", "External oblique", "Serratus anterior", "Serratus anterior", "Latissimus dorsi", "Trapezius (upper)", "Trapezius (middle)", "Trapezius (lower)", "Infraspinatus", "Teres major", "Erector spinae", "Gluteus maximus", "Gluteus medius", "Sternocleidomastoid", "Infrahyoid (strap) muscles", "Splenius / upper trapezius"]; // V32e: index = muscles.py MUS order (id-1)
  const LABEL={skin:"Skin",fat:"Subcutaneous fat (under the skin)",muscle:"Skeletal muscle",bone:"Skeleton",heart:"Heart",liver:"Liver",gall:"Gallbladder",
    stomach:"Stomach",pancreas:"Pancreas",intestine:"Small intestine",colon:"Large intestine (colon)",omentum:"Greater omentum · visceral fat",mesentery:"Mesentery · visceral fat",
    spleen:"Spleen",kidney:"Kidney",bladder:"Urinary bladder",vessel:"Arteries (arterial tree)",nail:"Nails (finger- and toenails)",lung:"Lungs",diaphragm:"Diaphragm",vein:"Inferior vena cava"};
  // Threshold profiles change the starting body; slider fat is added on top.
  const BASE={lower:{mass:0,belly:0,visc:0},moderate:{mass:0,belly:0,visc:0},larger:{mass:.45,belly:0,visc:0},extreme:{mass:1,belly:.3,visc:.45}};
  // Same body states as the 2D render frames (v22src/frames.json): [subq, mass, belly, visc, liver, pancreas, hyper] at fuel 0/40/55/70/85/100 (V24).
  const FX=[0,40,55,70,85,100];
  const FR={
    lower:[[.06,0,0,0,0,0,0],[.24,0,.13,.13,0,0,0],[.32,0,.25,.25,.09,.01,0],[.38,0,.37,.37,.43,.31,0],[.42,0,.48,.48,.82,.76,0],[.44,0,.55,.55,1,1,0]],
    moderate:[[.2,.1,.06,.06,0,0,0],[.48,.14,.2,.2,0,0,0],[.64,.18,.35,.35,0,0,0],[.8,.22,.53,.53,.2,.01,0],[.92,.26,.72,.72,.71,.54,0],[.98,.28,.85,.85,1,1,0]],
    larger:[[.36,.5,.1,.1,0,0,0],[.62,.5,.2,.2,0,0,0],[.82,.5,.3,.3,0,0,0],[1,.5,.42,.42,0,0,0],[1.14,.5,.72,.66,.14,0,0],[1.2,.5,1.05,1,1,1,0]],
    extreme:[[.5,1,.42,.48,0,0,0],[.6,1,.42,.48,0,0,.32],[.68,1,.42,.48,0,0,.55],[.76,1,.42,.48,0,0,.78],[.82,1,.43,.5,0,0,.96],[.86,1,.47,.53,0,0,1.1]]};
  function frameState(profile,x){const R=FR[profile]||FR.moderate;x=Math.max(0,Math.min(100,+x||0));let i=0;while(i<FX.length-2&&x>FX[i+1])i++;
    const t=(x-FX[i])/(FX[i+1]-FX[i]);return R[i].map((v,k)=>v+(R[i+1][k]-v)*t)}
  const EL_MIN=-1.2,EL_MAX=1.35,D_MIN=.6,D_MAX=7;  // V26: closer zoom (with pan) for liver/visceral detail
  const clampEl=v=>Math.max(EL_MIN,Math.min(EL_MAX,v)),clampDist=v=>Math.max(D_MIN,Math.min(D_MAX,v));
  const VIEWS={front:0,three:-.62,side:-Math.PI/2,back:Math.PI};
  const reduce=window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):{matches:false};

  const GLSL_COMMON=`
  varying vec3 vPos;
  uniform float uCut; uniform float uHalf; uniform float uTime;
  float pftHash(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
  float pftNoise(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);
    return mix(mix(mix(pftHash(i),pftHash(i+vec3(1,0,0)),f.x),mix(pftHash(i+vec3(0,1,0)),pftHash(i+vec3(1,1,0)),f.x),f.y),
               mix(mix(pftHash(i+vec3(0,0,1)),pftHash(i+vec3(1,0,1)),f.x),mix(pftHash(i+vec3(0,1,1)),pftHash(i+vec3(1,1,1)),f.x),f.y),f.z);}
  // V26: cellular (Worley) noise -> (F1,F2): fat lobules, septa and fat droplets
  vec2 pftCell(vec3 p){vec3 i=floor(p),f=fract(p);float d1=8.,d2=8.;
    for(int z=-1;z<=1;z++)for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec3 g=vec3(float(x),float(y),float(z));
      vec3 o=vec3(pftHash(i+g),pftHash(i+g+19.1),pftHash(i+g+47.3));vec3 r=g+o-f;float d=dot(r,r);
      if(d<d1){d2=d1;d1=d;}else if(d<d2){d2=d;}}
    return vec2(sqrt(d1),sqrt(d2));}
  float pftAbd(vec3 p,float front){float ax=pow(abs((p.x+.005)/.13),2.6);float ay=pow(abs((p.y-1.05)/.2),2.6);
    return (1.-smoothstep(.9,1.,ax+ay))*smoothstep(front-.01,front+.01,p.z);}
  `;
  const GLSL_BUMP=`vec3 pftBump(vec3 n,float h,float s){vec3 dpx=dFdx(-vViewPosition),dpy=dFdy(-vViewPosition);float dhx=dFdx(h),dhy=dFdy(h);
    vec3 r1=cross(dpy,n),r2=cross(n,dpx);float det=dot(dpx,r1);vec3 g=sign(det)*(dhx*r1+dhy*r2);return normalize(abs(det)*n-s*g);}
  `;
  function patch(mat,key,o){
    mat.userData.uniforms=o.uniforms;
    mat.onBeforeCompile=function(sh){
      Object.assign(sh.uniforms,o.uniforms);
      sh.vertexShader="varying vec3 vPos;\n"+(o.vdecl||"")+sh.vertexShader.replace("#include <project_vertex>",(o.vpre||"")+"#include <project_vertex>\nvPos=(modelMatrix*vec4(transformed,1.0)).xyz;\n"+(o.vmain||""));
      let f=sh.fragmentShader.replace("#include <common>","#include <common>\n"+GLSL_COMMON+(o.fdecl||""));
      f=f.replace("void main() {",GLSL_BUMP+"\nvoid main() {");
      f=f.replace("#include <clipping_planes_fragment>","#include <clipping_planes_fragment>\n"+(o.discard||""));
      if(o.color)f=f.replace("#include <color_fragment>","#include <color_fragment>\n"+o.color);
      if(o.normal)f=f.replace("#include <normal_fragment_maps>","#include <normal_fragment_maps>\n"+o.normal);
      if(o.light)f=f.replace("#include <lights_fragment_end>","#include <lights_fragment_end>\n"+o.light);
      sh.fragmentShader=f;
    };
    mat.customProgramCacheKey=()=>"pft23-"+key;
    return mat;
  }
  const U=v=>({value:v});

  function create(canvas,opts){
    opts=opts||{};
    const cfg=window.PFT_CONFIG||{},models=cfg.models||{};
    const url=models.anatomy||models.skin;
    let renderer;
    // Probe WebGL first so a missing GPU falls back to 2D quietly (no three.js console errors).
    try{const pc=document.createElement("canvas");if(!(pc.getContext("webgl2")||pc.getContext("webgl")))throw 0}catch(e){setTimeout(()=>opts.onError&&opts.onError(new Error("WebGL unavailable")),0);return stub()}
    try{
      renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:"high-performance"});
    }catch(e){setTimeout(()=>opts.onError&&opts.onError(e),0);return stub()}
    if(!renderer.getContext()){setTimeout(()=>opts.onError&&opts.onError(new Error("WebGL unavailable")),0);return stub()}
    renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
    renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.AgXToneMapping||T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;renderer.setClearColor(0x000000,0);

    const scene=new T.Scene();
    const camera=new T.PerspectiveCamera(28,1,.05,40);
    // Lighting: soft key from front-left, cool rim lights, slate hemisphere fill.
    const hemi=new T.HemisphereLight(0x9fb6d0,0x1a1410,.55);scene.add(hemi);
    const key=new T.DirectionalLight(0xfff1e6,2.6);key.position.set(-2.4,3.2,3.4);key.castShadow=true;
    key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-1.1;key.shadow.camera.right=1.1;key.shadow.camera.top=2.1;key.shadow.camera.bottom=-.3;
    key.shadow.camera.near=.5;key.shadow.camera.far=9;key.shadow.bias=-.0004;key.shadow.normalBias=.025;key.shadow.radius=4;
    key.target.position.set(0,.9,0);scene.add(key,key.target);
    const fill=new T.DirectionalLight(0xc8dcff,.55);fill.position.set(2.6,1.4,2.6);scene.add(fill);
    const rimL=new T.DirectionalLight(0xa9c8ff,1.6);rimL.position.set(-2.2,2.0,-2.6);scene.add(rimL);
    const rimR=new T.DirectionalLight(0xa9c8ff,1.4);rimR.position.set(2.4,2.2,-2.4);scene.add(rimR);
    [fill,rimL,rimR].forEach(l=>{l.target.position.set(0,.9,0);scene.add(l.target)});
    // V25: in the cut-away views the organs are lit by a soft camera headlight instead of shadows (shadows from ribs/muscle hid liver fat and glycogen).
    const head=new T.DirectionalLight(0xfff6ee,0);head.position.set(0,0,1);camera.add(head);head.target.position.set(0,0,-1);camera.add(head.target);scene.add(camera);
    // Floor: soft contact shadow + faint green glow (Theosis palette).
    // soft contact shadow (blob) instead of a cast floor shadow: no clipped shadow fragments
    const sc=document.createElement("canvas");sc.width=sc.height=128;const s2=sc.getContext("2d");const sg=s2.createRadialGradient(64,64,0,64,64,64);
    sg.addColorStop(0,"rgba(0,0,0,.55)");sg.addColorStop(.5,"rgba(0,0,0,.22)");sg.addColorStop(1,"rgba(0,0,0,0)");s2.fillStyle=sg;s2.fillRect(0,0,128,128);
    const floor=new T.Mesh(new T.PlaneGeometry(.75,.42),new T.MeshBasicMaterial({map:new T.CanvasTexture(sc),transparent:true,depthWrite:false}));floor.rotation.x=-Math.PI/2;floor.position.y=.001;scene.add(floor);
    const gc=document.createElement("canvas");gc.width=gc.height=128;const g2=gc.getContext("2d");const gr=g2.createRadialGradient(64,64,0,64,64,64);
    gr.addColorStop(0,"rgba(130,200,80,.55)");gr.addColorStop(.45,"rgba(90,160,60,.18)");gr.addColorStop(1,"rgba(60,120,40,0)");g2.fillStyle=gr;g2.fillRect(0,0,128,128);
    const glow=new T.Mesh(new T.PlaneGeometry(1.2,.8),new T.MeshBasicMaterial({map:new T.CanvasTexture(gc),transparent:true,depthWrite:false,blending:T.AdditiveBlending}));
    glow.rotation.x=-Math.PI/2;glow.position.y=.002;scene.add(glow);

    // ---------- materials ----------
    const shared={uCut:U(0),uHalf:U(0),uTime:U(0)};
    const st={subq:0,mass:0,belly:0,visc:0,liver:0,pancreas:0,hyper:0,gly:0,glyL:0};
    const tgt={...st};
    const fatU={...shared,uSubq:U(0),uMass:U(0),uBelly:U(0),uHyper:U(0),uFatOp:U(.86)};
    const M={};
    M.skin=patch(new T.MeshPhysicalMaterial({color:0xb08672,roughness:.58,metalness:0,specularIntensity:.55,sheen:.3,sheenColor:new T.Color(0xd98e78),sheenRoughness:.6,clearcoat:0,side:T.DoubleSide}),"skin",{
      uniforms:shared,
      discard:"if(uCut>.5&&pftAbd(vPos,.025)>.5)discard;",
      color:"if(!gl_FrontFacing){diffuseColor.rgb=vec3(.20,.035,.03);}else{float cav=clamp(length(fwidth(normalize(vNormal)))*5.,0.,1.);diffuseColor.rgb*=1.-.28*cav;} // V32g2: crease/knuckle shading",
      normal:"if(gl_FrontFacing){normal=pftBump(normal,pftNoise(vPos*260.)*.5+pftNoise(vPos*55.),.0009);float hnd=smoothstep(.17,.20,abs(vPos.x))*smoothstep(.60,.63,vPos.y)*(1.-smoothstep(.78,.81,vPos.y)),ft=1.-smoothstep(.07,.10,vPos.y);if(hnd+ft>.01){normal=pftBump(normal,hnd*pftNoise(vPos*vec3(320.,1500.,320.))+ft*pftNoise(vPos*vec3(320.,320.,1500.))+.6*pftNoise(vPos*820.),.00042*(hnd+ft));}} // V32i: fine skin lines + pores on hands and feet",
      light:`#if NUM_DIR_LIGHTS>0
        for(int i=0;i<NUM_DIR_LIGHTS;i++){float nl=dot(normal,directionalLights[i].direction);float w=max(0.,(nl+.6)/1.6)-max(0.,nl);
        reflectedLight.directDiffuse+=diffuseColor.rgb*vec3(1.,.38,.26)*w*directionalLights[i].color*.55;}
      #endif
      // V25: back rim lights are kept low on the body surface (they drew bright lines along upward-facing folds)`});
    M.fat=patch(new T.MeshPhysicalMaterial({color:0xf0c35a,roughness:.55,sheen:.15,sheenColor:new T.Color(0xffe2a0),clearcoat:.15,transparent:true,depthWrite:false,side:T.FrontSide}),"fat",{
      uniforms:fatU,
      vdecl:"#ifndef USE_COLOR\nattribute vec4 color;\n#endif\nvarying vec4 vW;\n",vmain:"vW=color;",
      fdecl:"varying vec4 vW;uniform float uSubq,uMass,uBelly,uHyper,uFatOp;\n",
      discard:"if(uHalf>.5&&vPos.x<0.0)discard;",
      color:`float th=vW.r*uSubq+vW.a*uHyper*.9+vW.g*uMass*.8+vW.r*uBelly*.2;float lob=pftNoise(vPos*38.);
        diffuseColor.rgb=mix(vec3(.95,.64,.12),vec3(1.,.83,.30),lob*.7+.15);
        diffuseColor.a=min(.96,.42+.24*smoothstep(.0,.3,vW.r+vW.g*.6)+.5*smoothstep(.05,.8,th))*uFatOp;if(diffuseColor.a<.01)discard;`,
      normal:"normal=pftBump(normal,pftNoise(vPos*38.)+.35*pftNoise(vPos*110.),.0016);"});
    const muscleU={uSel:U(0),...shared,uGly:U(0)};
    M.muscle=patch(new T.MeshStandardMaterial({color:0x7d1d17,roughness:.55,metalness:0}),"muscle",{
      uniforms:muscleU,vdecl:"attribute vec3 color;\nvarying float vMid;\n",vmain:"vMid=color.r;\n",fdecl:"uniform float uGly,uSel;\nvarying float vMid;\n",discard:"if(uCut>.5&&pftAbd(vPos,.03)>.5)discard;",
      color:`float fib=sin(vPos.x*1400.+pftNoise(vPos*vec3(60.,8.,60.))*9.)*.5+.5;float fib2=sin(vPos.z*1400.+pftNoise(vPos*vec3(60.,8.,60.)+7.)*9.)*.5+.5;
        float s=fib*fib2;diffuseColor.rgb*=mix(.62,1.12,s);
        float mid=vMid*64.;float mi=floor(mid+.5);float hv=fract(sin(mi*12.9898+.7)*43758.5453);diffuseColor.rgb*=mi>.5?(.74+.46*hv):1.;
        float seam=clamp(fwidth(mid)*3.5,0.,1.);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.93,.86,.78),.55*seam); // pale fascia line between muscles
        if(uSel>.5&&abs(mi-uSel)<.5)diffuseColor.rgb=mix(diffuseColor.rgb,vec3(1.,.72,.36),.42);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.55,.33,.28),pftNoise(vPos*16.)*.18);
        float gr=smoothstep(.64,.74,pftNoise(vPos*230.));diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.15,.62,.55),uGly*.12);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.5,1.,.9),min(.55,uGly*.6*gr)); // V32g: lighter glycogen speckle so muscle borders stay readable`,
      normal:`normal=pftBump(normal,fib*fib2,.0006);`});
    M.nail=new T.MeshStandardMaterial({color:0xc99a8c,roughness:.42,metalness:0});
    M.bone=patch(new T.MeshStandardMaterial({color:0xcfc4ae,roughness:.62}),"bone",{uniforms:shared,discard:"if(uCut>.5&&pftAbd(vPos,.03)>.5)discard;"});
    const organ=(c,r,extra)=>new T.MeshPhysicalMaterial(Object.assign({color:c,roughness:Math.min(.8,r+.2),clearcoat:.06,clearcoatRoughness:.6,specularIntensity:.35,sheen:.12,sheenColor:new T.Color(0xffc0b0)},extra||{}));
    const liverU={...shared,uLiver:U(0),uGlyL:U(0)},pancU={...shared,uPanc:U(0)},omU={...shared,uVisc:U(0)};
    // V26: hepatic steatosis - the whole liver turns paler and yellower from within (diffuse, patchy/mottled
    // parenchyma with fine fat droplets), swells slightly and its edges round off; no fat "blobs" on top.
    M.liver=patch(organ(0x5a1510,.34),"liver",{uniforms:liverU,fdecl:"uniform float uLiver,uGlyL;\n",
      vdecl:"uniform float uLiver;\n",vpre:"transformed+=objectNormal*(.0015+uLiver*.006);\n",
      color:`float n1=pftNoise(vPos*34.),n2=pftNoise(vPos*96.+3.7),n3=pftNoise(vPos*260.+9.1);
        float lw=.55*pftNoise(vPos*9.+1.3)+.3*pftNoise(vPos*21.+5.)+.15*pftNoise(vPos*47.);float lr=1.-abs(2.*pftNoise(vPos*120.+2.2)-1.);
        vec3 healthy=mix(vec3(.25,.045,.032),vec3(.37,.085,.055),lw)*(1.-.07*smoothstep(.75,1.,lr));
        vec3 fatty=mix(vec3(.56,.27,.10),vec3(.68,.42,.17),n2*.7+n3*.3);
        float patchy=smoothstep(.15,.85,n1*.6+lw*.3+n3*.1+(uLiver-.6)*1.1);
        float amt=clamp(uLiver*(.3+.7*patchy),0.,1.);
        diffuseColor.rgb=mix(healthy,fatty,amt*.72);
        if(uLiver>.02){vec2 dc=pftCell(vPos*300.);float drop=(1.-smoothstep(.12,.36,dc.x))*smoothstep(.35,.65,n3*.5+patchy*.5);
        diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.80,.58,.34),drop*uLiver*.13);}
        float gq=smoothstep(.5,.68,n3);float gl=uGlyL*(1.-.35*uLiver);
        diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.15,.62,.55),gl*.10*(1.-.8*uLiver));diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.30,.85,.75),gl*.22*gq);`,
      normal:"normal=pftBump(normal,lw*.25+(uLiver>.02?(1.-smoothstep(.1,.34,pftCell(vPos*300.).x))*.5*uLiver:0.),.0006);"});
    M.pancreas=patch(organ(0xd29a62,.42),"pancreas",{uniforms:pancU,fdecl:"uniform float uPanc;\n",
      color:"vec2 pc=pftCell(vPos*120.);float lob=smoothstep(.0,.5,pc.y-pc.x);float lo=.55*lob+.25*pftNoise(vPos*40.);float dep=smoothstep(.0,.06,pftNoise(vPos*55.)-(.68-uPanc*.3))*min(1.,uPanc*3.);diffuseColor.rgb=mix(mix(vec3(.70,.42,.27),vec3(.88,.62,.40),lo),vec3(.99,.86,.42),dep);",
      normal:"vec2 pc2=pftCell(vPos*120.);normal=pftBump(normal,smoothstep(.0,.5,pc2.y-pc2.x)*(1.-.3*pc2.x)+dep*2.,.00035);"});
    // V26: visceral (omental) fat as lobulated yellow fat with pinkish septa and fine vessels, draped over the
    // bowel (thinner between lobules, so loops show through) instead of one smooth yellow mass.
    M.omentum=patch(organ(0xf0c35a,.5,{transparent:true,depthWrite:false,side:T.DoubleSide,clearcoat:.22,clearcoatRoughness:.35,sheen:0}),"omentum",{uniforms:omU,fdecl:"uniform float uVisc;\n",
      color:`vec2 c=pftCell(vPos*72.);float edge=c.y-c.x;float lob=smoothstep(.03,.22,edge);float dome=1.-smoothstep(.0,.75,c.x);
        float tint=pftNoise(vPos*30.);vec2 c2=pftCell(vPos*190.);float sub=smoothstep(.02,.12,c2.y-c2.x);
        vec3 fat=mix(vec3(.84,.54,.15),vec3(.98,.76,.30),tint*.55+dome*.45)*mix(.86,1.,sub)*mix(.7,1.,dome);
        vec3 sept=vec3(.70,.36,.28);
        float v1=abs(pftNoise(vPos*vec3(18.,26.,18.))-.5),v2=abs(pftNoise(vPos*vec3(44.,60.,44.)+5.3)-.5);
        float ves=max(1.-smoothstep(.0,.018,v1),.7*(1.-smoothstep(.0,.012,v2)));
        diffuseColor.rgb=mix(sept,fat,lob);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.62,.12,.10),ves*.8);
        float base=.08+.46*min(1.,uVisc*1.6);base=min(base,mix(.56,.24,smoothstep(.30,.90,uVisc)));  // v70: thinner veil so organs read in the default view  // V32i: stays partly see-through at high visceral fat so the organs behind still read
        diffuseColor.a=base*mix(.5,1.,lob)+ves*.12;`,
      normal:"normal=pftBump(normal,dome+.25*tint,.0035);"});
    M.mesentery=M.omentum; // V32e: the mesentery sheet shares the lobulated visceral-fat material
    // V26: mesenteric fat - lobulated yellow fat gathers along the bowel loops as visceral fat grows
    const bowelU={...shared,uVisc:omU.uVisc};
    const bowel=(c,r,k)=>patch(organ(c,r),k,{uniforms:bowelU,fdecl:"uniform float uVisc;\n",
      color:`float m=smoothstep(.42,.72,pftNoise(vPos*26.)+.15*pftNoise(vPos*80.))*min(1.,uVisc*1.5);vec2 c=pftCell(vPos*80.);
        float lob=smoothstep(.03,.2,c.y-c.x);float dm=1.-smoothstep(.0,.7,c.x);vec3 fat=mix(vec3(.84,.54,.15),vec3(.98,.76,.30),dm)*mix(.72,1.,dm);
        diffuseColor.rgb=mix(diffuseColor.rgb,mix(vec3(.72,.40,.30),fat,lob),m*.9);`,
      normal:"normal=pftBump(normal,dm*min(1.,uVisc*1.5),.002);"});
    M.heart=organ(0x8f1a14,.3,{emissive:new T.Color(0x5a0804),emissiveIntensity:.6});
    M.gall=organ(0x4d6a38,.25);M.stomach=organ(0xc4787a,.36);M.intestine=bowel(0xb48c88,.38,"intestine");M.colon=bowel(0x9e746c,.4,"colon");
    M.vessel=patch(organ(0x8a0f0c,.3,{emissive:new T.Color(0x3a0402),emissiveIntensity:.5}),"vessel",{uniforms:shared,discard:"if(uCut>.5&&pftAbd(vPos,.03)>.5)discard;"});
    M.spleen=organ(0x7a2240,.35);M.kidney=organ(0x8e3a2a,.35);M.duodenum=bowel(0xd09a7e,.38,"intestine");M.bladder=organ(0xc9a08a,.4);
    // anatomy pass: lungs (pale pink, see-through so the heart reads), diaphragm (muscle with a paler central tendon), IVC (deoxygenated blue)
    M.lung=organ(0xe3aaa6,.6,{transparent:true,opacity:.5,depthWrite:false,clearcoat:.1,sheen:.4});
    M.diaphragm=patch(organ(0x9a3a30,.55,{transparent:true,opacity:.5,depthWrite:false,side:T.DoubleSide,clearcoat:.15}),"diaphragm",{uniforms:shared,vdecl:"attribute vec3 color;\nattribute float aDf;\nvarying float vTen;varying float vDf;\n",vmain:"vTen=color.r;vDf=aDf;\n",fdecl:"varying float vTen;varying float vDf;\n",color:"diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.86,.80,.72),vTen*.85);diffuseColor.a*=mix(.15,1.,smoothstep(.08,.6,abs(dot(normalize(vNormal),normalize(vViewPosition)))))*mix(.12,1.,vDf);"});
    M.vein=organ(0x2c3f86,.32,{emissive:new T.Color(0x0a1030),emissiveIntensity:.4});
    // ---------- v69: painted-illustration surface pass (all original shader code) ----------
    // Adds to organ/bone materials: baked cavity occlusion (aOcc), painterly edge darkening and lit crowns, fine tissue grain
    // in the normal and roughness, a soft studio reflection (wet serosal glisten) and, where asked, a fine surface-vessel net.
    const GLSL_PAINT=`varying vec3 vPw;varying float vOcc;
      float pH(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
      float pN(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(pH(i),pH(i+vec3(1,0,0)),f.x),mix(pH(i+vec3(0,1,0)),pH(i+vec3(1,1,0)),f.x),f.y),mix(mix(pH(i+vec3(0,0,1)),pH(i+vec3(1,0,1)),f.x),mix(pH(i+vec3(0,1,1)),pH(i+vec3(1,1,1)),f.x),f.y),f.z);}
      float pV(vec3 x){vec3 i=floor(x),f=fract(x);float d1=8.,d2=8.;for(int a=-1;a<=1;a++)for(int b=-1;b<=1;b++)for(int c=-1;c<=1;c++){vec3 g=vec3(a,b,c),o=vec3(pH(i+g),pH(i+g+19.1),pH(i+g+47.3));float d=length(g+o-f);if(d<d1){d2=d1;d1=d;}else if(d<d2)d2=d;}return d2-d1;}`;
    function paint(mat,key,o){o=o||{};if(window.__PFT_NOPAINT)return mat;const prev=mat.onBeforeCompile;mat.onBeforeCompile=function(sh,r){if(prev)prev.call(this,sh,r);
      sh.vertexShader="attribute float aOcc;varying vec3 vPw;varying float vOcc;\n"+(o.stom?"attribute vec3 aSt;varying vec3 vSt;\n":"")+sh.vertexShader.replace("#include <project_vertex>","#include <project_vertex>\nvPw=(modelMatrix*vec4(transformed,1.0)).xyz;vOcc=aOcc;\n"+(o.stom?"vSt=aSt;\n":""));
      let f=sh.fragmentShader.replace("#include <common>","#include <common>\n"+GLSL_PAINT+(o.stom?"varying vec3 vSt;\n":""));
      const gs=(o.grain||1).toFixed(2),vs=(o.vessels||0).toFixed(2),gl=(o.gloss==null?1:o.gloss).toFixed(2),vc=o.vcol||"vec3(.55,.06,.05)";
      f=f.replace("#include <roughnessmap_fragment>","#include <roughnessmap_fragment>\nroughnessFactor=clamp(roughnessFactor*(1.-"+(o.rg||.3).toFixed(2)+"*.5+"+(o.rg||.3).toFixed(2)+"*pN(vPw*200.*"+gs+")),.12,1.);");
      f=f.replace("#include <normal_fragment_maps>","#include <normal_fragment_maps>\n{float e=.00006*"+gs+"*"+(o.bump||1).toFixed(2)+";vec3 q=vPw*(170.*"+gs+");float n0=pN(q)+.5*pN(q*2.7);"+(o.stom?"":"")+"vec3 dpx=dFdx(vPw),dpy=dFdy(vPw);float dx=dFdx(n0),dy=dFdy(n0);vec3 r1=cross(dpy,normal),r2=cross(normal,dpx);float det=dot(dpx,r1);e*=smoothstep(.08,.55,abs(normalize(vNormal).z));if(abs(det)>1e-12)normal=normalize(abs(det)*normal-e*sign(det)*(dx*r1+dy*r2)*40.);}");
      f=f.replace("#include <emissivemap_fragment>","#include <emissivemap_fragment>\n{float rim=1.-abs(normalize(vNormal).z);diffuseColor.rgb*=(1.-.45*vOcc)*mix(1.10,.62,pow(rim,1.6));"+
        (o.stom?"float sx=vSt.x,cv=vSt.y,an=atan(vSt.z,vSt.y);float wob=pN(vPw*55.)*.5;float gL=1.-smoothstep(.0,.07,abs(cv-.84+.03*wob));float lL=1.-smoothstep(.0,.06,abs(cv+.84-.03*wob));float br=(1.-smoothstep(.0,.07,abs(fract(sx*9.+wob*2.2+cv*.6)-.5)))*smoothstep(.4,.62,pN(vPw*24.));float gB=br*smoothstep(.55,.86,cv)*step(cv,.86);float lB=br*smoothstep(.45,.86,-cv)*step(-cv,.86)*.7;float vv=max(gL,lL*.8)+0.*(gB+lB)*smoothstep(.06,.16,sx)*(1.-smoothstep(.9,.98,sx));diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.52,.08,.07),vv*.62);":"")+(o.vessels?"float vn=abs(2.*pN(vPw*"+(o.vscale||"90.")+"*.35)-1.);float vl=1.-smoothstep(.0,.07,vn);float vm=smoothstep(.35,.65,pN(vPw*14.));diffuseColor.rgb=mix(diffuseColor.rgb,"+vc+",vl*vm*"+vs+");":"")+"}");
      f=f.replace("#include <lights_fragment_end>","#include <lights_fragment_end>\n{vec3 Vv=normalize(vViewPosition);vec3 nW=(vec4(normal,0.)*viewMatrix).xyz;reflectedLight.indirectDiffuse+=diffuseColor.rgb*vec3(1.,.86,.80)*"+(o.bounce||.35).toFixed(2)+"*(1.-smoothstep(-.85,.05,nW.y));vec3 Rr=reflect(-Vv,normal);float Fr=.04+.96*pow(1.-clamp(dot(normal,Vv),0.,1.),5.);float rf=roughnessFactor;vec3 env=mix(vec3(.17,.14,.13),vec3(1.,.93,.86),smoothstep(-.1-.7*rf,.8+.4*rf,Rr.y))+vec3(.6,.7,.9)*smoothstep(.5-.5*rf,1.,-Rr.x)*.35*(1.-.5*rf);env=mix(env,vec3(.45,.42,.40),rf*rf);reflectedLight.indirectSpecular+=env*Fr*(1.-.85*rf)*(1.-.85*rf)*"+gl+"*.9;}");
      sh.fragmentShader=f;};
      const ck0=mat.customProgramCacheKey,ck=ck0?()=>String(ck0.call(mat)).slice(0,60):()=>"";mat.customProgramCacheKey=()=>ck()+"|v69"+key;mat.needsUpdate=true;return mat}
    // wet serosal sheen on viscera (clearcoat), ivory bone, glossier fat
    [M.liver,M.pancreas,M.stomach,M.spleen,M.kidney,M.heart,M.gall,M.intestine,M.colon,M.duodenum,M.bladder,M.vein].forEach(m=>{if(m&&"clearcoat" in m){m.clearcoat=Math.max(m.clearcoat||0,.32);m.clearcoatRoughness=.28}});
    M.liver.clearcoat=.45;M.liver.clearcoatRoughness=.2;M.liver.roughness=.45;paint(M.liver,"liver",{grain:.7,gloss:.7,rg:.08,bump:.35});paint(M.pancreas,"panc",{grain:.6,gloss:.7,bump:.3});M.stomach.color.set(0xd4867e);paint(M.stomach,"stom",{grain:.5,stom:1,gloss:1.1,bump:.001,rg:.04});paint(M.spleen,"spl");paint(M.kidney,"kid");
    paint(M.heart,"heart",{vessels:.35,vscale:"45.",vcol:"vec3(.85,.72,.45)"});paint(M.gall,"gall",{gloss:1.3});paint(M.intestine,"int",{vessels:.3,vscale:"110."});paint(M.colon,"col",{vessels:.45,vscale:"80."});
    if(M.duodenum!==M.intestine)paint(M.duodenum,"duo",{vessels:.3});paint(M.bladder,"bl");paint(M.lung,"lung",{grain:2.,gloss:.6});paint(M.vein,"vein",{gloss:1.2});
    M.bone.color.set(0xe9dcc2);M.bone.roughness=.55;paint(M.bone,"bone",{grain:1.3,gloss:.25});
    const LOWQ=window.__PFT_LOWQ!=null?!!window.__PFT_LOWQ:!!(window.matchMedia&&matchMedia('(pointer:coarse)').matches)||Math.min(screen.width,screen.height)<600;
    // v70: the fat shell covers most of the screen, so its clearcoat lobe is desktop-only; phones keep a glossy-looking but cheaper fat
    if(LOWQ){M.fat.clearcoat=0;M.fat.roughness=.36;M.fat.specularIntensity=Math.max(M.fat.specularIntensity||.5,.6)}else{M.fat.clearcoat=.38;M.fat.clearcoatRoughness=.3;M.fat.roughness=.42}


    // ---------- labels ----------
    const host=canvas.parentElement;
    const mkLabel=(text,cls)=>{const d=document.createElement("div");d.className="pft3d-flabel "+(cls||"");d.setAttribute("aria-hidden","true");d.innerHTML="<i></i><span></span>";d.querySelector("span").textContent=text;host.appendChild(d);return d};
    const labels=[
      {el:mkLabel("Skin/subcutaneous fat removed","l-left"),anchor:new T.Vector3(-.11,1.33,.105),modes:["composition"],side:-1},
      {el:mkLabel("Visceral fat","l-right"),anchor:new T.Vector3(.05,.98,.11),modes:["composition","internal"],side:1,dyn:true},
      {el:mkLabel("Cross-section showing visceral organs","l-left"),anchor:new T.Vector3(-.04,1.235,.115),modes:["internal"],side:-1}];

    // ---------- camera state (eased) ----------
    const cam={az:VIEWS.three,el:.06,dist:3.85,ty:.9,px:0},camT={...cam};
    let vesselsOn=true;const vBtn=document.getElementById("pft3d-vessels");
    // V32e: hide the muscle layer so the arterial tree (and skeleton) can be seen
    // V32g2: glycogen speckle on/off (3D) so muscle borders can be studied
    let glyOn=true;const gBtn=document.getElementById("pft3d-glytoggle");
    if(gBtn)gBtn.addEventListener("click",()=>{glyOn=!glyOn;gBtn.setAttribute("aria-pressed",String(!glyOn));gBtn.textContent=glyOn?"Hide speckle":"Show speckle";dirty=true;kick()});
    let musclesOn=true;const mBtn=document.getElementById("pft3d-muscles");
    if(mBtn)mBtn.addEventListener("click",()=>{musclesOn=!musclesOn;mBtn.setAttribute("aria-pressed",String(!musclesOn));mBtn.textContent=musclesOn?"Hide muscles":"Show muscles";applyMode();kick()});
    if(vBtn)vBtn.addEventListener("click",()=>{vesselsOn=!vesselsOn;vBtn.setAttribute("aria-pressed",String(vesselsOn));applyMode();kick()});
    let framing="full",mode="composition",dirty=true,ready=false,lastT=performance.now(),raf=0,meshes=[],byRole={};
    function setFramingT(f){framing=f;camT.px=0;if(f==="abdomen"){camT.dist=1.75;camT.ty=1.06;camT.el=.04}else{camT.dist=3.85;camT.ty=.9;camT.el=.06}syncNav(true);kick()}
    const baseDist=()=>framing==="abdomen"?1.75:3.85,baseTy=()=>framing==="abdomen"?1.06:.9;

    function resize(){const w=canvas.clientWidth||1,h=canvas.clientHeight||1;if(canvas.width!==Math.round(w*renderer.getPixelRatio())||canvas.height!==Math.round(h*renderer.getPixelRatio())){renderer.setSize(w,h,false);camera.aspect=w/h;
      // keep the whole body in portrait/narrow stages
      camera.fov=w/h<.62?34:28;camera.updateProjectionMatrix();dirty=true}}
    const ro=window.ResizeObserver?new ResizeObserver(()=>{resize();kick()}):null;if(ro)ro.observe(canvas);

    function applyMode(){
      const show={external:["skin","nail"],composition:["vessel","fat","nail","muscle","bone","heart","liver","gall","stomach","pancreas","intestine","colon","omentum","mesentery","spleen","kidney","bladder","lung","diaphragm","vein"],
        internal:["vessel","skin","nail","muscle","bone","heart","liver","gall","stomach","pancreas","intestine","colon","omentum","mesentery","spleen","kidney","bladder","lung","diaphragm","vein"]}[mode];
      meshes.forEach(m=>{m.visible=show.indexOf(m.userData.role)>=0&&((m.userData.role!=="vessel"&&m.userData.role!=="vein")||vesselsOn)&&(m.userData.role!=="muscle"||musclesOn)&&(m.userData.role!=="heart"||(m.userData.hra&&mode==="composition"&&!musclesOn))}); /* v74: heart is fully covered by the chest wall otherwise (0 px in every view), so skip drawing it */
      if(mBtn)mBtn.hidden=mode==="external";
      if(vBtn)vBtn.hidden=mode==="external";
      shared.uCut.value=mode==="external"?0:1;shared.uHalf.value=mode==="composition"?1:0;
      if(byRole.skin)byRole.skin.forEach(m=>{m.castShadow=mode==="external";});
      // V25: shadows only on the body surface; cut-away views get shadow-free, soft frontal light
      const cut=mode!=="external";key.castShadow=!cut;head.intensity=cut?.85:.6;rimL.intensity=cut?1.6:.42;rimR.intensity=cut?1.4:.38;fill.intensity=cut?.55:.6;hemi.intensity=cut?.75:.55;key.intensity=cut?2.1:2.25;
      // Teaching offset (as in the 2D renders): bring the pancreas and gallbladder forward in the cut-away views so they are not hidden behind stomach/liver.
      const off={pancreas:[0,0,.004],gall:[0,.010,-.016]}; // v7.6.67: true positions (was a large teaching offset that floated the pancreas in front of the liver)
      for(const r in off)(byRole[r]||[]).forEach(m=>{if(!m.userData.p0)m.userData.p0=m.position.clone();m.position.copy(m.userData.p0);if(mode!=="external")m.position.add(new T.Vector3(...off[r]))});
      dirty=true;
    }
    function stepState(dt){
      const k=reduce.matches?1:1-Math.exp(-dt*4.5);let moving=false;
      for(const n in st){const d=tgt[n]-st[n];if(Math.abs(d)>1e-4){st[n]+=d*k;moving=true}else st[n]=tgt[n]}
      if(!ptrs.size&&(Math.abs(vAz)>.003||Math.abs(vEl)>.003)){
        if(reduce.matches){vAz=vEl=0}else{camT.az+=vAz*dt;cam.az=camT.az;const ne=clampEl(camT.el+vEl*dt);if(ne===camT.el)vEl=0;camT.el=ne;cam.el=ne;const f=Math.exp(-dt*3.2);vAz*=f;vEl*=f;moving=true}}
      const ck=reduce.matches?1:1-Math.exp(-dt*5.5);
      let dAz=camT.az-cam.az;dAz=Math.atan2(Math.sin(dAz),Math.cos(dAz));
      if(Math.abs(dAz)>1e-4||Math.abs(camT.dist-cam.dist)>1e-4||Math.abs(camT.ty-cam.ty)>1e-4||Math.abs(camT.el-cam.el)>1e-4||Math.abs(camT.px-cam.px)>1e-4){
        cam.az+=dAz*ck;cam.dist+=(camT.dist-cam.dist)*ck;cam.ty+=(camT.ty-cam.ty)*ck;cam.el+=(camT.el-cam.el)*ck;cam.px+=(camT.px-cam.px)*ck;moving=true}
      return moving;
    }
    // v7.6.67: continuous, capped body-measure bias (height/weight/waist/age/sex/body fat/A1c) from the host page; default = no change
    const bias={subq:0,mass:0,belly:0,visc:0,liver:0,pancreas:0,sx:1,sy:1};let rootRef=null;const bz=(x,m)=>Math.max(0,Math.min(m,x));
    window.PFTAnatomyBias=function(b){b=b||{};const c=(x,l)=>Math.max(-l,Math.min(l,+x||0));bias.subq=c(b.subq,.35);bias.mass=c(b.mass,.3);bias.belly=c(b.belly,.3);bias.visc=c(b.visc,.25);bias.liver=c(b.liver,.2);bias.pancreas=c(b.pancreas,.15);
      bias.sx=1+c((+b.sx||1)-1,.12);bias.sy=1+c((+b.sy||1)-1,.08);dirty=true;applyState();kick&&kick()};
    if(window.__pftBias)Promise.resolve().then(()=>{try{window.PFTAnatomyBias(window.__pftBias)}catch(e){}});
    function applyState(){
      meshes.forEach(m=>{const d=m.morphTargetDictionary,inf=m.morphTargetInfluences;if(!d)return;
        if("subq" in d)inf[d.subq]=bz(st.subq+bias.subq,1.25);if("mass" in d)inf[d.mass]=bz(st.mass+bias.mass,1.1);if("belly" in d)inf[d.belly]=bz(st.belly+bias.belly,1.25);if("visc" in d)inf[d.visc]=bz(st.visc+bias.visc,1);if("hyper" in d)inf[d.hyper]=st.hyper;});
      const B=bias;fatU.uSubq.value=bz(st.subq+B.subq,1.25);fatU.uMass.value=bz(st.mass+B.mass,1.1);fatU.uBelly.value=bz(st.belly+B.belly,1.25);fatU.uHyper.value=st.hyper;
      liverU.uLiver.value=bz(st.liver+B.liver,1);liverU.uGlyL.value=glyOn?st.glyL:0;muscleU.uGly.value=glyOn?st.gly:0;pancU.uPanc.value=bz(st.pancreas+B.pancreas,1);omU.uVisc.value=bz(st.visc+B.visc,1);if(rootRef){rootRef.scale.set(B.sx,B.sy,B.sx);rootRef.position.y=1.05*(1-B.sy);}
      if(M.heart)M.heart.emissiveIntensity=.45;
    }
    const v3=new T.Vector3();
    function placeLabels(){
      const w=canvas.clientWidth,h=canvas.clientHeight,ox=canvas.offsetLeft,oy=canvas.offsetTop;const facing=Math.cos(cam.az);
      labels.forEach(L=>{
        const on=ready&&L.modes.indexOf(mode)>=0&&facing>.25&&!(L.dyn&&st.visc<.04&&mode==="composition");
        L.el.classList.toggle("on",on);if(!on)return;
        v3.copy(L.anchor);if(L.dyn){v3.z+=.1*st.belly;v3.y-=.03*st.visc}
        v3.project(camera);const x=ox+(v3.x*.5+.5)*w,y=oy+(-v3.y*.5+.5)*h;
        // keep the label text inside the stage: flip side when it would be clipped
        // keep the text inside the stage: preferred side, else above the anchor (never flip onto the other structure)
        if(!L.tw)L.tw=L.el.querySelector("span").offsetWidth;const tw=(L.tw||160)+22;
        const fits=L.side<0?x-ox>=tw:ox+w-x>=tw;const top=!fits;
        L.el.classList.toggle("l-left",!top&&L.side<0);L.el.classList.toggle("l-right",!top&&L.side>0);L.el.classList.toggle("l-top",top);
        if(top){const half=(L.tw||160)/2+6;const dx=Math.max(ox+half-x,Math.min(0,ox+w-half-x));L.el.style.setProperty("--dx",dx.toFixed(1)+"px")}
        L.el.style.transform="translate("+x.toFixed(1)+"px,"+y.toFixed(1)+"px)";
      });
    }
    function frame(now){
      raf=0;const dt=Math.max(0,Math.min(.1,(now-lastT)/1000));lastT=Math.max(lastT,now); // V26: rAF time can precede lastT after a long task; never step backwards
      resize();
      const moving=stepState(dt);
      if(moving||dirty){
        applyState();
        const r=cam.dist,ce=Math.cos(cam.el);
        // V26: pan offset (px sideways in the view, ty vertical) moves the orbit target
        const tx=cam.px*Math.cos(cam.az),tz=-cam.px*Math.sin(cam.az);
        camera.position.set(tx+Math.sin(cam.az)*ce*r,cam.ty+Math.sin(cam.el)*r,tz+Math.cos(cam.az)*ce*r);camera.lookAt(tx,cam.ty,tz);
        renderer.render(scene,camera);placeLabels();dirty=false;
      }
      if(moving)kick();
    }
    function kick(){dirty=true;if(!raf)raf=requestAnimationFrame(frame)}

    // ---------- input: free orbit (drag), pinch / wheel zoom, inertia; V26: pan (move) when zoomed ----------
    const ptrs=new Map();let moved=0,vAz=0,vEl=0,lastMove=0,pinch0=0,dist0=0,mid=null,act="rotate";
    let dragMode="rotate",autoNav=true;const coarse=window.matchMedia&&window.matchMedia("(pointer:coarse)").matches;
    canvas.style.touchAction="none";
    const clampPx=v=>Math.max(-.75,Math.min(.75,v)),clampTy=v=>Math.max(.05,Math.min(1.8,v));
    const zoomed=()=>camT.dist<baseDist()*.82;
    function upp(){return 2*cam.dist*Math.tan(camera.fov*Math.PI/360)/Math.max(1,canvas.clientHeight)}
    function pan(dx,dy){const u=upp();camT.px=clampPx(camT.px-dx*u);camT.ty=clampTy(camT.ty+dy*u);cam.px=camT.px;cam.ty=camT.ty;kick()}
    const $n=id=>document.getElementById(id);
    function syncNav(recenter){
      // auto: drag moves the view while zoomed in, rotates otherwise (unless the user picked a mode)
      if(recenter){autoNav=true}
      if(autoNav)dragMode="rotate"; // v7.6.72: one-finger/left drag always rotates (any zoom); two-finger/right/Shift-drag moves
      const mv=$n("pft3d-move");if(mv){mv.setAttribute("aria-pressed",String(dragMode==="pan"));mv.classList.toggle("active",dragMode==="pan")}
      const st=$n("pft3d-status");
      if(st&&ready)st.textContent=dragMode==="pan"?(coarse?"Move mode · drag to move · tap ✥ to rotate":"Move mode · drag to move · Shift-drag to rotate · Reset view to recenter")
        :(coarse?"Drag to rotate · pinch to zoom · two fingers to move":"3D anatomy · drag to rotate · scroll to zoom · right-drag to move");
      const stage=canvas.closest&&canvas.closest(".human-3d-stage");if(stage)stage.dataset.drag=dragMode;
    }
    function zoomTo(d){const was=zoomed();camT.dist=clampDist(d);if(camT.dist>=baseDist()*.98&&!was){}
      // zooming fully back out recenters the view
      if(camT.dist>=baseDist()*.98){camT.px=0;camT.ty=baseTy()}
      syncNav(false);kick()}
    function pinchStart(){const p=[...ptrs.values()];pinch0=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y)||1;dist0=camT.dist;mid={x:(p[0].x+p[1].x)/2,y:(p[0].y+p[1].y)/2}}
    canvas.addEventListener("contextmenu",e=>e.preventDefault());
    canvas.addEventListener("pointerdown",e=>{ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});moved=0;vAz=vEl=0;lastMove=performance.now();
      act=(e.button===1||e.button===2)?"pan":(e.shiftKey||e.altKey||e.ctrlKey||e.metaKey)?(dragMode==="pan"?"rotate":"pan"):dragMode;
      try{canvas.setPointerCapture(e.pointerId)}catch(_){ }if(ptrs.size===2)pinchStart();if(e.pointerType!=="mouse"||e.button!==0)e.preventDefault()});
    canvas.addEventListener("pointermove",e=>{const p=ptrs.get(e.pointerId);if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;moved+=Math.abs(dx)+Math.abs(dy);
      if(ptrs.size>=2){const q=[...ptrs.values()];const d=Math.hypot(q[0].x-q[1].x,q[0].y-q[1].y)||1;camT.dist=clampDist(dist0*pinch0/d);cam.dist=camT.dist;
        const m2={x:(q[0].x+q[1].x)/2,y:(q[0].y+q[1].y)/2};if(mid)pan(m2.x-mid.x,m2.y-mid.y);mid=m2;syncNav(false);kick();return}
      if(act==="pan"){vAz=vEl=0;pan(dx,dy);return}
      const k=Math.PI/Math.max(260,canvas.clientWidth);           // a full stage-width drag ≈ 180°
      const dAz=-dx*k*1.15,dEl=dy*k*.9;
      camT.az+=dAz;cam.az=camT.az;camT.el=clampEl(camT.el+dEl);cam.el=camT.el;
      const now=performance.now(),dt=Math.max(.008,(now-lastMove)/1000);lastMove=now;
      vAz=Math.max(-7,Math.min(7,dAz/dt));vEl=Math.max(-5,Math.min(5,dEl/dt));kick()});
    const end=e=>{if(!ptrs.has(e.pointerId))return;ptrs.delete(e.pointerId);
      if(ptrs.size===1){vAz=vEl=0;mid=null;act=dragMode;return}
      if(e.type==="pointerup"&&moved<5&&e.button!==2)pick(e);
      if(act==="pan"||performance.now()-lastMove>90||reduce.matches)vAz=vEl=0;
      if(camT.dist>=baseDist()*.98&&mid!==null){camT.px=0;camT.ty=baseTy()}mid=null;kick()};
    canvas.addEventListener("pointerup",end);canvas.addEventListener("pointercancel",end);canvas.addEventListener("lostpointercapture",end);
    canvas.addEventListener("wheel",e=>{e.preventDefault();
      if(e.shiftKey&&!e.ctrlKey){pan(-e.deltaX||0,-(e.deltaY||0));return}
      zoomTo(camT.dist*Math.exp(e.deltaY*(e.ctrlKey?.01:.0012)))},{passive:false});
    function resetView(){camT.az=VIEWS.front;camT.el=framing==="abdomen"?.04:.06;vAz=vEl=0;setFramingT(framing);syncNav(true)}
    canvas.addEventListener("dblclick",resetView);
    canvas.addEventListener("keydown",e=>{const k=e.key;let h=true;const P=40;
      if(e.shiftKey&&k==="ArrowLeft")pan(P,0);else if(e.shiftKey&&k==="ArrowRight")pan(-P,0);else if(e.shiftKey&&k==="ArrowUp")pan(0,P);else if(e.shiftKey&&k==="ArrowDown")pan(0,-P);
      else if(k==="ArrowLeft")camT.az+=.25;else if(k==="ArrowRight")camT.az-=.25;else if(k==="ArrowUp")camT.el=clampEl(camT.el+.2);else if(k==="ArrowDown")camT.el=clampEl(camT.el-.2);
      else if(k==="+"||k==="=")zoomTo(camT.dist*.85);else if(k==="-")zoomTo(camT.dist/.85);else if(k==="0"||k==="Home")resetView();else h=false;
      if(h){e.preventDefault();kick()}});
    // V26: zoom / move / reset buttons (index.html #pft3d-nav)
    const nb=(id,f)=>{const b=$n(id);if(b)b.addEventListener("click",f)};
    nb("pft3d-zoomin",()=>zoomTo(camT.dist*.8));nb("pft3d-zoomout",()=>zoomTo(camT.dist/.8));
    nb("pft3d-move",()=>{autoNav=false;dragMode=dragMode==="pan"?"rotate":"pan";syncNav(false)});
    nb("pft3d-reset",()=>{resetView();const fb=document.querySelector('[data-pft3d-view="front"]');if(fb)fb.click()});
    const ray=new T.Raycaster(),ndc=new T.Vector2();
    function pick(e){
      if(!ready)return;const r=canvas.getBoundingClientRect();ndc.set(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);ray.setFromCamera(ndc,camera);
      const hits=ray.intersectObjects(meshes.filter(m=>m.visible&&m.userData.role!=="fat"),false);
      let name=null;for(const h of hits){const p=h.point;const role=h.object.userData.role;
        if((role==="skin"||role==="muscle"||role==="bone")&&mode!=="external"&&inWindow(p))continue;name=LABEL[role];
          if(role==="muscle"){const ca=h.object.geometry.attributes.color;let id=0;if(ca&&h.face)id=Math.round(ca.getX(h.face.a)*64);const mn=id>0&&MUSCLE_NAMES[id-1];muscleU.uSel.value=mn?id:0;if(mn)name="Muscle · "+mn;kick()}else if(muscleU.uSel.value){muscleU.uSel.value=0;kick()}
          break}
      opts.onPick&&opts.onPick(name);
    }
    function inWindow(p){const ax=Math.pow(Math.abs((p.x+.005)/.13),2.6),ay=Math.pow(Math.abs((p.y-1.05)/.2),2.6);return ax+ay<.95&&p.z>.025}

    // ---------- v7.6.67 anatomy pass (original procedural geometry; reference: standard anatomy texts, no traced images) ----------
    function v67Anatomy(root){
      root.updateMatrixWorld(true);const get=r=>byRole[r]||[];const W=new T.Vector3();
      const worldPts=m=>{const p=m.geometry.attributes.position,a=new Float32Array(p.count*3);for(let i=0;i<p.count;i++){W.fromBufferAttribute(p,i).applyMatrix4(m.matrixWorld);a[i*3]=W.x;a[i*3+1]=W.y;a[i*3+2]=W.z}return a};
      // 1) Liver: keep a clearance from the ribs (no intersecting) by tucking contact vertices toward the liver's centre; then solid, opaque, drawn before shells.
      const L=get("liver")[0],Bn=get("bone");
      if(L&&Bn.length){
        // 1a) Liver (v7.6.67b): original procedural outline replacing the boxy source mesh: large right lobe under the right ribs, left lobe
        //     tapering across the epigastrium, dome under the diaphragm, inferior border slanting up from the right costal margin,
        //     gallbladder fossa and ligamentum teres notch on the inferior surface. Built in world space, then converted to the liver's local space.
        const g=L.geometry=(()=>{const NA=84,NBr=56,pos=[],idx=[],ss=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)},X0=-.093,X1=.078;
          for(let i=0;i<=NA;i++){const a=i/NA*Math.PI,u=(1-Math.cos(a))/2,x=X0+(X1-X0)*u,sa=Math.pow(Math.sin(a),.42+.5*u*u);
            const yb=1.116+.078*Math.pow(u,1.3),yt=1.250-.040*Math.pow(Math.max(0,u-.22),2)-.005*Math.exp(-Math.pow((u-.6)/.09,2)),cyy=(yt+yb)/2,hy=(yt-yb)/2;
            const zb=-.040+.072*ss(.35,1,u),zf=.077+.016*ss(.4,.85,u),czz=(zf+zb)/2,hz=(zf-zb)/2;
            for(let j=0;j<=NBr;j++){const bb=j/NBr*Math.PI*2,sb=Math.sin(bb),cb=Math.cos(bb),e=.72,ps=Math.sign(sb)*Math.pow(Math.abs(sb),e),pc=Math.sign(cb)*Math.pow(Math.abs(cb),e);
              let y=cyy+hy*ps*sa,z=czz+hz*pc*sa;const lo=Math.max(0,-sb),an=Math.max(0,cb);
              y+=.011*Math.exp(-Math.pow((u-.30)/.05,2))*lo*Math.sqrt(an)*sa+.006*Math.exp(-Math.pow((u-.52)/.018,2))*lo*an*sa; // GB fossa, teres notch
              z-=.010*Math.pow(lo,2)*an*ss(.0,.5,u)*sa; // visceral surface faces down and back: thinner anterior-inferior edge
              const up=Math.max(0,sb),bk=Math.max(0,-cb);
              const th6=Math.min(1,hz/.05);z-=.009*up*up*an*sa*th6;y-=.003*up*up*an*(1-u)*sa*th6; // anterior-superior surface curves back under the costal cartilages (no rib dent)
              const fg=Math.exp(-Math.pow((u-.53+.02*up)/.011,2))*an*(.4+.6*up);y-=.0025*fg*up*th6;z-=.0030*fg*th6; // falciform ligament groove: right/left lobe demarcation
              y-=.010*Math.exp(-Math.pow((u-.44)/.045,2))*bk*lo*sa; // caudate lobe: posterior-inferior bulge beside the IVC
              {const wb=ss(.55,.40,u)*ss(.2,.6,up)*ss(.2,.6,bk);z=z+(Math.max(z,czz-hz*.82*sa)-z)*wb} // bare area hint: flattened posterior-superior contact with the diaphragm
              pos.push(x,y,z)}}
          for(let i=0;i<NA;i++)for(let j=0;j<NBr;j++){const A=i*(NBr+1)+j,B=A+NBr+1;idx.push(A,B,A+1,B,B+1,A+1)}
          const ng=new T.BufferGeometry();ng.setAttribute("position",new T.Float32BufferAttribute(pos,3));ng.setIndex(idx);
          if(L.geometry.attributes.color)ng.setAttribute("color",new T.Float32BufferAttribute(new Float32Array(pos.length).fill(1),3));
          if(L.geometry.attributes.uv)ng.setAttribute("uv",new T.Float32BufferAttribute(new Float32Array(pos.length/3*2),2));return ng})();
        L.updateMatrixWorld(true);const lp=g.attributes.position.array.slice();g.attributes.position.array.set(lp.map(()=>0));
        let mn=[9,9,9],mx=[-9,-9,-9],cx=0,cy=0,cz=0,n=lp.length/3;
        for(let i=0;i<n;i++){for(let k=0;k<3;k++){mn[k]=Math.min(mn[k],lp[i*3+k]);mx[k]=Math.max(mx[k],lp[i*3+k])}cx+=lp[i*3]/n;cy+=lp[i*3+1]/n;cz+=lp[i*3+2]/n}
        const cell=.01,grid=new Map(),key=(x,y,z)=>Math.floor(x/cell)+","+Math.floor(y/cell)+","+Math.floor(z/cell);
        for(const b of Bn){const bp=worldPts(b);for(let i=0;i<bp.length;i+=3){const x=bp[i],y=bp[i+1],z=bp[i+2];if(x<mn[0]-.02||x>mx[0]+.02||y<mn[1]-.02||y>mx[1]+.02||z<mn[2]-.02||z>mx[2]+.02)continue;const k=key(x,y,z);let a=grid.get(k);if(!a)grid.set(k,a=[]);a.push(x,y,z)}}
        const CLR=.0075,near=(x,y,z)=>{let best=1e9;const ix=Math.floor(x/cell),iy=Math.floor(y/cell),iz=Math.floor(z/cell);for(let a=-1;a<=1;a++)for(let b2=-1;b2<=1;b2++)for(let c=-1;c<=1;c++){const arr=grid.get((ix+a)+","+(iy+b2)+","+(iz+c));if(!arr)continue;for(let j=0;j<arr.length;j+=3){const dx=x-arr[j],dy=y-arr[j+1],dz=z-arr[j+2],d=dx*dx+dy*dy+dz*dz;if(d<best)best=d}}return Math.sqrt(best)};
        L.userData.lp0=lp.slice();const rc=new Float32Array(85*3);for(let r=0;r<85;r++){for(let j=0;j<57;j++)for(let k=0;k<3;k++)rc[r*3+k]+=lp[(r*57+j)*3+k]/57}
        let moved=0;for(let it=0;it<4;it++){for(let i=0;i<n;i++){const x=lp[i*3],y=lp[i*3+1],z=lp[i*3+2],d=near(x,y,z);if(d<CLR){const ri=Math.floor(i/57),rcx=rc[ri*3],rcy=rc[ri*3+1],rcz=rc[ri*3+2],vx=(rcx-x)*.25,vy=(rcy-y)*.6,vz=rcz-z,l=Math.hypot(vx,vy,vz)||1,s=(CLR-d)+.0012;lp[i*3]+=vx/l*s;lp[i*3+1]+=vy/l*s;lp[i*3+2]+=vz/l*s;moved++}}}
        // smooth the rib tuck so the surface stays a smooth organ (no dents/spikes): average displacements over mesh neighbours, then a light re-tuck
        {const o=L.userData.lp0,ix=g.index.array,nb=Array.from({length:n},()=>new Set());for(let i=0;i<ix.length;i+=3){const a=ix[i],b=ix[i+1],c=ix[i+2];nb[a].add(b).add(c);nb[b].add(a).add(c);nb[c].add(a).add(b)}
          let d=new Float32Array(n*3);for(let i=0;i<n*3;i++)d[i]=lp[i]-o[i];
          for(let it=0;it<10;it++){const e=new Float32Array(n*3);for(let i=0;i<n;i++){let c=1,x=d[i*3],y=d[i*3+1],z=d[i*3+2];for(const j of nb[i]){x+=d[j*3];y+=d[j*3+1];z+=d[j*3+2];c++}e[i*3]=x/c;e[i*3+1]=y/c;e[i*3+2]=z/c;
            const m0=Math.hypot(d[i*3],d[i*3+1],d[i*3+2]),m1=Math.hypot(e[i*3],e[i*3+1],e[i*3+2]);if(m1<m0*.85&&m0>0){const k=m0*.85/m1;e[i*3]*=k;e[i*3+1]*=k;e[i*3+2]*=k}}d=e}
          for(let i=0;i<n*3;i++){const ri=Math.floor(i/171),w=ri>72?Math.max(0,(84-ri)/12):1;lp[i]=o[i]+d[i]*w}for(let r=0;r<85;r++)for(let k=0;k<3;k++){const A=(r*57)*3+k,B=(r*57+56)*3+k,mv=(lp[A]+lp[B])/2;lp[A]=lp[B]=mv}}
        const pa=g.attributes.position;
        if(pa.isInterleavedBufferAttribute||pa.normalized||!(pa.array instanceof Float32Array)){g.setAttribute("position",new T.Float32BufferAttribute(new Float32Array(pa.count*3),3))}
        const P=g.attributes.position;for(let i=0;i<n;i++){W.set(lp[i*3],lp[i*3+1],lp[i*3+2]);L.worldToLocal(W);P.setXYZ(i,W.x,W.y,W.z)}P.needsUpdate=true;
        // winding check: a closed organ must have positive signed volume, else its outside faces are culled and the inside wall shows (the "hollow" look)
        {const ix=g.index,cnt=ix?ix.count:P.count;let vol=0;const a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3();for(let i=0;i<cnt;i+=3){const i0=ix?ix.getX(i):i,i1=ix?ix.getX(i+1):i+1,i2=ix?ix.getX(i+2):i+2;a.fromBufferAttribute(P,i0);b.fromBufferAttribute(P,i1);c.fromBufferAttribute(P,i2);vol+=a.dot(b.cross(c))}
          L.userData.vol0=vol;if(vol<0&&ix){const arr=Array.from(ix.array);for(let i=0;i<arr.length;i+=3){const s=arr[i+1];arr[i+1]=arr[i+2];arr[i+2]=s}g.setIndex(arr)}}
        if(g.attributes.normal)g.deleteAttribute("normal");g.computeVertexNormals();g.computeBoundingSphere();
        Object.assign(M.liver,{transparent:false,opacity:1,depthWrite:true,depthTest:true,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-2,side:T.FrontSide});M.liver.needsUpdate=true;L.renderOrder=1;L.userData.v67={moved};}
      // 1b) Same winding check for the other closed organs (flip inside-out meshes; normals negated, smoothing kept)
      const flips=[];for(const r of ["stomach","spleen","kidney","gall","heart","bladder","colon","intestine"])for(const m of get(r)){const g=m.geometry,P=g.attributes.position,ix=g.index;if(!ix||m.morphTargetInfluences)continue;let vol=0;const a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3();
        for(let i=0;i<ix.count;i+=3){a.fromBufferAttribute(P,ix.getX(i));b.fromBufferAttribute(P,ix.getX(i+1));c.fromBufferAttribute(P,ix.getX(i+2));vol+=a.dot(b.cross(c))}
        if(vol<0){const ng=g.clone(),arr=Array.from(ng.index.array);for(let i=0;i<arr.length;i+=3){const s=arr[i+1];arr[i+1]=arr[i+2];arr[i+2]=s}ng.setIndex(arr);if(ng.attributes.normal)ng.deleteAttribute("normal");ng.computeVertexNormals();m.geometry=ng;flips.push(r)}}
      root.userData.v67flips=flips;

      // 2) Pancreas: rebuilt as an elongated, flattened, lobulated gland lying obliquely at about L1-L2: head inside the duodenal C-loop
      //    (right of the superior mesenteric vessels), neck in front of the portal/SMV confluence, body across the aorta behind the stomach,
      //    tail rising to the splenic hilum. 3) Duodenum: C-loop (D1-D4) around the head, added because the source model has none.
      const pm=get("pancreas")[0],sp=get("spleen")[0];
      const hil=sp?(()=>{const a=worldPts(sp);let x=0,y=0,z=0,c=0;for(let i=0;i<a.length;i+=3)if(a[i]<.062){x+=a[i];y+=a[i+1];z+=a[i+2];c++}return c?[x/c-.006,y/c-.004,z/c+.004]:[.054,1.165,-.03]})():[.054,1.165,-.03];
      const crv=(pts)=>{const P=pts.map(p=>new T.Vector3(...p)),S=[];for(let i=0;i<P.length-1;i++){const p0=P[Math.max(0,i-1)],p1=P[i],p2=P[i+1],p3=P[Math.min(P.length-1,i+2)];for(let k=0;k<20;k++){const s=k/20,s2=s*s,s3=s2*s;S.push(new T.Vector3(
          .5*(2*p1.x+(-p0.x+p2.x)*s+(2*p0.x-5*p1.x+4*p2.x-p3.x)*s2+(-p0.x+3*p1.x-3*p2.x+p3.x)*s3),.5*(2*p1.y+(-p0.y+p2.y)*s+(2*p0.y-5*p1.y+4*p2.y-p3.y)*s2+(-p0.y+3*p1.y-3*p2.y+p3.y)*s3),.5*(2*p1.z+(-p0.z+p2.z)*s+(2*p0.z-5*p1.z+4*p2.z-p3.z)*s2+(-p0.z+3*p1.z-3*p2.z+p3.z)*s3)))}}S.push(P[P.length-1].clone());
        const Lc=[0];for(let i=1;i<S.length;i++)Lc.push(Lc[i-1]+S[i].distanceTo(S[i-1]));const tot=Lc[Lc.length-1];
        const at=u=>{const d=u*tot;let i=1;while(i<S.length-1&&Lc[i]<d)i++;const f=(d-Lc[i-1])/Math.max(1e-9,Lc[i]-Lc[i-1]);return S[i-1].clone().lerp(S[i],f)};
        return {getPointAt:at,getTangentAt:u=>at(Math.min(1,u+.004)).sub(at(Math.max(0,u-.004))).normalize()}};
      const tube=(pts,prof,seg,rad)=>{const cur=crv(pts);const pos=[],idx=[];
        for(let i=0;i<=seg;i++){const u=i/seg,c=cur.getPointAt(u),[a,b,lob]=prof(u);const tg=cur.getTangentAt(u);let N=new T.Vector3(0,0,1).cross(tg);if(N.lengthSq()<1e-6)N.set(1,0,0);N.normalize();const Bv=tg.clone().cross(N).normalize();
          for(let j=0;j<=rad;j++){const th=j/rad*Math.PI*2,lb=1+lob*(Math.sin(th*5+u*40)*.5+Math.sin(u*90+th*3)*.5);const cap=Math.pow(Math.sin(Math.min(1,Math.min(u,1-u)*14)*Math.PI/2),.5);
            const q=c.clone().addScaledVector(N,Math.cos(th)*a*lb*cap).addScaledVector(Bv,Math.sin(th)*b*lb*cap);pos.push(q.x,q.y,q.z)}}
        for(let i=0;i<seg;i++)for(let j=0;j<rad;j++){const A=i*(rad+1)+j,B=A+rad+1;idx.push(A,B,A+1,B,B+1,A+1)}
        const g=new T.BufferGeometry();g.setAttribute("position",new T.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g};
      if(pm){const ty=Math.min(hil[1],1.140),pts=[[-.034,1.049,.026],[-.042,1.060,.030],[-.042,1.074,.034],[-.032,1.088,.039],[-.012,1.097,.043],[.012,1.104,.040],[.032,1.111,.026],[.046,1.120+(ty-1.13)*.4,.008],[hil[0]-.004,ty,hil[2]+.004]];
        const prof=u=>{const h=Math.max(0,1-Math.abs(u-.13)/.17),tl=Math.max(0,(u-.66)/.34);return [.0105+.0085*h-.0040*tl,.0058+.0050*h-.0018*tl,.07]};  // vertical half-height a, AP half-thickness b
        const toL=(g)=>{const a=g.attributes.position;for(let i=0;i<a.count;i++){W.fromBufferAttribute(a,i);pm.worldToLocal(W);a.setXYZ(i,W.x,W.y,W.z)}g.computeVertexNormals()};const g=tube(pts,prof,96,24);toL(g);
        const col=new Float32Array(g.attributes.position.count*3).fill(1);g.setAttribute("color",new T.Float32BufferAttribute(col,3));
        pm.geometry=g;pm.morphTargetInfluences=undefined;pm.morphTargetDictionary=undefined;pm.userData.v67=true;
        // duodenum: pylorus -> D1 (back and right) -> D2 descending (in front of the right kidney hilum) -> D3 across the aorta/IVC -> D4 up to the flexure
        const dpts=[[-.020,1.111,.058],[-.040,1.114,.047],[-.058,1.106,.036],[-.068,1.088,.031],[-.067,1.064,.031],[-.058,1.043,.034],[-.036,1.033,.038],[-.010,1.034,.040],[.010,1.041,.038],[.022,1.056,.034],[.025,1.072,.030]];
        const dg=tube(dpts,u=>{const k=1+.42*Math.exp(-Math.pow((u-.10)/.055,2));return [.0105*k,.0095*k,.0]},110,20);toL(dg);dg.setAttribute("color",new T.Float32BufferAttribute(new Float32Array(dg.attributes.position.count*3).fill(1),3));
        const dm=new T.Mesh(dg,M.duodenum);dm.userData.role="intestine";dm.name="Duodenum";dm.frustumCulled=false;pm.add(dm); // child of the pancreas: follows its offset and any bias
        meshes.push(dm);(byRole.intestine=byRole.intestine||[]).push(dm);root.userData.panPm=pm;root.userData.panPts=pts;}
      // ---------- v7.6.68: lungs, colon, small bowel, liver details, portal/splenic vessels (all original procedural geometry) ----------
      try{v68Anatomy()}catch(e){console.warn("anatomy pass v68",e)}
      function v68Anatomy(){
      const ss=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
      const spl=(pts,per)=>{const S=[],d=pts[0].length;for(let i=0;i<pts.length-1;i++){const p0=pts[Math.max(0,i-1)],p1=pts[i],p2=pts[i+1],p3=pts[Math.min(pts.length-1,i+2)];
        for(let k=0;k<per;k++){const s=k/per,s2=s*s,s3=s2*s,q=[];for(let c=0;c<d;c++)q.push(.5*(2*p1[c]+(-p0[c]+p2[c])*s+(2*p0[c]-5*p1[c]+4*p2[c]-p3[c])*s2+(-p0[c]+3*p1[c]-3*p2[c]+p3[c])*s3));S.push(q)}}S.push(pts[pts.length-1].slice());return S};
      // tube along a 3D path with extra per-point channels (radius etc.), parallel-transport frames
      const tube2=(pts,rf,rad,per)=>{const S=spl(pts,per||12),V=S.map(q=>new T.Vector3(q[0],q[1],q[2])),Lc=[0];for(let i=1;i<V.length;i++)Lc.push(Lc[i-1]+V[i].distanceTo(V[i-1]));const tot=Lc[Lc.length-1];
        const pos=[],idx=[];let N=null;
        for(let i=0;i<V.length;i++){const tg=V[Math.min(V.length-1,i+1)].clone().sub(V[Math.max(0,i-1)]).normalize();
          if(!N){N=new T.Vector3(0,1,0);if(Math.abs(N.dot(tg))>.9)N.set(1,0,0)}N.sub(tg.clone().multiplyScalar(N.dot(tg))).normalize();const Bv=tg.clone().cross(N).normalize(),c=V[i];
          for(let j=0;j<=rad;j++){const th=j/rad*Math.PI*2,[a,b]=rf(Lc[i]/tot,th,Lc[i],S[i],tot);const ct=Math.cos(th),st=Math.sin(th);pos.push(c.x+N.x*ct*a+Bv.x*st*b,c.y+N.y*ct*a+Bv.y*st*b,c.z+N.z*ct*a+Bv.z*st*b)}}
        for(let i=0;i<V.length-1;i++)for(let j=0;j<rad;j++){const A=i*(rad+1)+j,B=A+rad+1;idx.push(A,B,A+1,B,B+1,A+1)}
        const g=new T.BufferGeometry();g.setAttribute("position",new T.Float32BufferAttribute(pos,3));g.setIndex(idx);return g};
      const capR=(s,tot,l0,l1)=>Math.sqrt(Math.max(0,Math.sin(Math.min(1,s/l0)*Math.PI/2)))*Math.sqrt(Math.max(0,Math.sin(Math.min(1,(tot-s)/l1)*Math.PI/2)));
      const fixVol=g=>{const P=g.attributes.position,ix=g.index;let vol=0;const a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3();for(let i=0;i<ix.count;i+=3){a.fromBufferAttribute(P,ix.getX(i));b.fromBufferAttribute(P,ix.getX(i+1));c.fromBufferAttribute(P,ix.getX(i+2));vol+=a.dot(b.cross(c))}
        if(vol<0){const arr=Array.from(ix.array);for(let i=0;i<arr.length;i+=3){const t=arr[i+1];arr[i+1]=arr[i+2];arr[i+2]=t}g.setIndex(arr)}g.computeVertexNormals();g.computeBoundingSphere();return g};
      const addW=(g,mat,role,name,parent)=>{const m=new T.Mesh(g,mat);parent.add(m);m.updateMatrixWorld(true);const P=g.attributes.position;for(let i=0;i<P.count;i++){W.fromBufferAttribute(P,i);m.worldToLocal(W);P.setXYZ(i,W.x,W.y,W.z)}
        if(!g.attributes.color)g.setAttribute("color",new T.Float32BufferAttribute(new Float32Array(P.count*3).fill(1),3));fixVol(g);m.userData.role=role;m.name=name;m.frustumCulled=false;m.userData.v68=true;meshes.push(m);(byRole[role]=byRole[role]||[]).push(m);return m};
      const drop=m=>{m.parent&&m.parent.remove(m);const i=meshes.indexOf(m);if(i>=0)meshes.splice(i,1);const r=byRole[m.userData.role];if(r){const j=r.indexOf(m);if(j>=0)r.splice(j,1)}};
      const host=(get("stomach")[0]||get("liver")[0]).parent;
      // ===== Lungs: fill the bony thorax (radial clearance table from the ribs), apex just above the clavicle, base on the diaphragm dome,
      //       mediastinum/heart impression with a cardiac notch on the left, oblique fissures (both) and a horizontal fissure (right).
      const oldL=get("lung").slice();
      if(oldL.length){const bp=[];for(const b of Bn){const a=worldPts(b);for(let i=0;i<a.length;i+=3){const x=a[i],y=a[i+1],z=a[i+2];if(y>1.09&&y<1.47&&Math.abs(x)<.18&&z>-.13&&z<.15)bp.push(x,y,z)}}
        const Y0=1.09,DY=.006,NYb=64,NAb=32,ax=(s,y)=>[s*(.050-.012*ss(1.33,1.42,y)),.004-.008*ss(1.30,1.42,y)];
        const tab={};for(const s of [-1,1]){const t=Array.from({length:NYb},()=>new Float32Array(NAb).fill(9));for(let i=0;i<bp.length;i+=3){const y=bp[i+1],yb=Math.floor((y-Y0)/DY);if(yb<0||yb>=NYb)continue;const [cx,cz]=ax(s,y),dx=bp[i]-cx,dz=bp[i+2]-cz,r=Math.hypot(dx,dz);if(r<.014)continue;
            const ab=Math.floor((Math.atan2(dz,dx)+Math.PI)/(2*Math.PI)*NAb)%NAb;if(r<t[yb][ab])t[yb][ab]=r}
          for(let it=0;it<NAb;it++)for(const row of t)for(let ab=0;ab<NAb;ab++)if(row[ab]>=9){const l=row[(ab+NAb-1)%NAb],r=row[(ab+1)%NAb];const c=[l,r].filter(v=>v<9);if(c.length)row[ab]=Math.min(...c)+.004}
          const u=t.map((row,yb)=>row.map((_,ab)=>{let m=9;for(let d=-4;d<=4;d++){const rr=t[yb+d];if(!rr)continue;for(let e=-1;e<=1;e++)m=Math.min(m,rr[(ab+e+NAb)%NAb])}return m}));tab[s]=u}
        const rib=(s,y,th)=>{const yb=Math.max(0,Math.min(NYb-1,Math.floor((y-Y0)/DY))),a=((th+Math.PI)/(2*Math.PI)*NAb+NAb*4)%NAb,a0=Math.floor(a)%NAb,a1=(a0+1)%NAb,f=a-Math.floor(a);return tab[s][yb][a0]*(1-f)+tab[s][yb][a1]*f};
        // diaphragm height map (top surface), dilated so the lateral/posterior recesses are covered
        const HC=.008,HX0=-.18,HZ0=-.14,HNX=46,HNZ=38,H=new Float32Array(HNX*HNZ).fill(-9);const dm0=get("diaphragm")[0];
        if(dm0){const a=worldPts(dm0);for(let i=0;i<a.length;i+=3){const ix=Math.floor((a[i]-HX0)/HC),iz=Math.floor((a[i+2]-HZ0)/HC);if(ix>=0&&ix<HNX&&iz>=0&&iz<HNZ)H[iz*HNX+ix]=Math.max(H[iz*HNX+ix],a[i+1])}
          for(let it=0;it<8;it++){const H2=H.slice();for(let z=0;z<HNZ;z++)for(let x=0;x<HNX;x++){if(H[z*HNX+x]>-9)continue;let s=0,c=0;for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,zz=z+dz;if(xx>=0&&xx<HNX&&zz>=0&&zz<HNZ&&H[zz*HNX+xx]>-9){s+=H[zz*HNX+xx];c++}}if(c)H2[z*HNX+x]=s/c-.004}H.set(H2)}}
        for(let it=0;it<3;it++){const H2=H.slice();for(let z=1;z<HNZ-1;z++)for(let x=1;x<HNX-1;x++){let a=0,c=0;for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){const h=H[(z+dz)*HNX+x+dx];if(h>-9){a+=h;c++}}if(c)H2[z*HNX+x]=a/c}H.set(H2)}
        const hAt=(x,z)=>{const ix=Math.max(0,Math.min(HNX-1,Math.floor((x-HX0)/HC))),iz=Math.max(0,Math.min(HNZ-1,Math.floor((z-HZ0)/HC)));return H[iz*HNX+ix]};
        let hc=null;const hm=get("heart")[0];if(hm){const b=new T.Box3().setFromObject(hm);hc={c:[(b.min.x+b.max.x)/2,b.min.y+(b.max.y-b.min.y)*.36,(b.min.z+b.max.z)/2],r:[(b.max.x-b.min.x)*.5,(b.max.y-b.min.y)*.40,(b.max.z-b.min.z)*.5]}}
        const YA=1.416,YB=1.135,NI=60,NJ=48,pos=[],col=[],idx=[];
        for(const s of [-1,1]){const base=pos.length/3,R=[];
          for(let i=0;i<=NI;i++){const v=i/NI,y=YB+(YA-YB)*Math.sin(v*Math.PI/2),row=[];
            for(let j=0;j<=NJ;j++){const th=j/NJ*Math.PI*2;let r=Math.min(.15,.062*Math.pow(Math.max(0,YA-y)/.08,.62))*Math.sqrt(Math.min(1,v/.035));r=Math.min(r,rib(s,y,th)-.006);row.push(Math.max(0,r))}R.push(row)}
          for(let it=0;it<3;it++)for(let i=1;i<NI;i++)for(let j=0;j<=NJ;j++){const jm=(j+NJ-1)%NJ,jp=(j+1)%NJ,av=(R[i][j]*2+R[i][jm]+R[i][jp]+R[i-1][j]+R[i+1][j])/6,y=YB+(YA-YB)*Math.sin(i/NI*Math.PI/2);R[i][j]=Math.min(av,rib(s,y,j/NJ*Math.PI*2)-.006)}
          for(let i=0;i<=NI;i++){const v=i/NI,yy=YB+(YA-YB)*Math.sin(v*Math.PI/2);for(let j=0;j<=NJ;j++){const th=j/NJ*Math.PI*2,[cx,cz]=ax(s,yy);let x=cx+Math.cos(th)*R[i][j],z=cz+Math.sin(th)*R[i][j],y=yy;
            if(s*x<.010)x=s*.010;  // mediastinum: lungs do not cross the midline
            if(hc){const dy=(y-hc.c[1])/hc.r[1],dz=(z-hc.c[2])/hc.r[2],q=1.12-dy*dy-dz*dz;if(q>0){const xe=hc.c[0]+s*hc.r[0]*Math.sqrt(q);if(s*x<s*xe)x=xe}}  // cardiac impression
            if(s>0){const nb=Math.exp(-Math.pow((y-1.29)/.032,2))*ss(-.005,.04,z);x=Math.max(x,.012+.050*nb)}  // cardiac notch (left upper lobe, anterior border)
            {const hb=hAt(x,z),bs=Math.max(YB,Math.min(1.24,hb>-9?hb+.004:1.175));y=bs+(yy-YB)*(YA-bs)/(YA-YB)}
            // fissures: oblique (both lungs), horizontal (right only, anterior to the oblique)
            const fo=y-((s<0?1.37:1.385)-1.30*(z+.05)),fh=s<0&&fo>0?y-1.300:9;const gr=Math.max(Math.exp(-Math.pow(fo/.0028,2)),Math.exp(-Math.pow(fh/.0028,2)));
            const dx=x-cx,dz2=z-cz,dl=Math.hypot(dx,dz2)||1;x-=dx/dl*.0035*gr;z-=dz2/dl*.0035*gr;
            pos.push(x,y,z);const sh=1-.55*gr;col.push(sh,sh,sh)}}
          for(let i=0;i<NI;i++)for(let j=0;j<NJ;j++){const A=base+i*(NJ+1)+j,B=A+NJ+1;idx.push(A,B,A+1,B,B+1,A+1)}
          const top=base+NI*(NJ+1);let tx=0,ty=0,tz=0;for(let j=0;j<=NJ;j++){tx+=pos[(top+j)*3];ty+=pos[(top+j)*3+1];tz+=pos[(top+j)*3+2]}for(let j=0;j<=NJ;j++){pos[(top+j)*3]=tx/(NJ+1);pos[(top+j)*3+1]=ty/(NJ+1)+.002;pos[(top+j)*3+2]=tz/(NJ+1)}}
        const g=new T.BufferGeometry();g.setAttribute("position",new T.Float32BufferAttribute(pos,3));g.setAttribute("color",new T.Float32BufferAttribute(col,3));g.setIndex(idx);
        const par=oldL[0].parent;oldL.forEach(drop);M.lung.vertexColors=true;M.lung.needsUpdate=true;const lm=addW(g,M.lung,"lung","Lungs",par);lm.renderOrder=2}
      // ===== Colon: caecum + appendix, ascending, hepatic flexure, sagging transverse, high splenic flexure, descending, S-shaped sigmoid, rectum.
      //       Haustra (sacculations) and three taeniae coli; smooth sigmoid/rectum.  [x,y,z,radius,haustra]
      const oldC=get("colon").slice();
      if(oldC.length){const cp=[[-.083,.900,.050,.012,0],[-.086,.912,.049,.019,.2],[-.090,.940,.045,.018,.7],[-.092,.975,.042,.016,1],[-.093,1.020,.040,.015,1],[-.091,1.062,.040,.015,1],[-.087,1.092,.044,.015,1],[-.078,1.104,.052,.015,1],
          [-.060,1.098,.066,.014,1],[-.034,1.082,.080,.014,1],[-.005,1.070,.086,.014,1],[.025,1.074,.084,.014,1],[.054,1.096,.070,.014,1],[.076,1.128,.046,.013,1],[.088,1.146,.026,.013,1],[.098,1.128,.012,.013,1],
          [.100,1.075,.012,.012,1],[.098,1.015,.016,.012,1],[.094,.960,.024,.012,.8],[.080,.920,.040,.0115,.3],[.052,.902,.062,.0115,.15],[.022,.912,.069,.0115,.1],[-.008,.906,.060,.0115,.1],[-.020,.887,.042,.012,.05],[-.008,.866,.018,.013,0],[.001,.845,-.008,.015,0],[.001,.818,-.026,.016,0],[.000,.796,-.030,.010,0]];
        const g=tube2(cp,(u,th,s,q,tot)=>{const h=q[4];let r=q[3]*capR(s,tot,.010,.006);const hs=Math.pow(Math.abs(Math.sin(Math.PI*s/.0165)),.55),ta=Math.max(0,Math.cos(3*th))**8;r*=1+h*(.16*hs-.06)-h*.10*ta;return [r,r]},20,14);
        const par=oldC[0].parent;oldC.forEach(drop);addW(g,M.colon,"colon","Colon",par);
        const ap=tube2([[-.079,.906,.040,.0042],[-.074,.893,.035,.0038],[-.068,.881,.032,.0035],[-.060,.874,.035,.0033],[-.053,.873,.041,.003]],(u,th,s,q,tot)=>{const r=q[3]*capR(s,tot,.002,.004);return [r,r]},10,10);
        addW(ap,M.colon,"colon","Appendix",par)}
      // ===== Small bowel: jejunum loops mostly upper left (wider), ileum lower right (narrower), ending at the ileocaecal junction.
      const oldI=get("intestine").filter(m=>m.name!=="Duodenum");
      if(oldI.length){const sb=[[.025,1.070,.030,.0095],[.036,1.064,.040,.0095]];let k=0;const hsh=n=>{const x=Math.sin(n*127.1)*43758.5;return x-Math.floor(x)};
        const row=(y,x0,x1,r,z0)=>{const n=9;for(let i=1;i<=n;i++){const t=i/n,j=k*13+i;sb.push([x0+(x1-x0)*t+(hsh(j)-.5)*.010,y+.007*Math.sin(t*Math.PI*3+k)+(hsh(j+5)-.5)*.006,z0+.020*Math.sin(t*Math.PI*2.2+k*1.9)+(hsh(j+9)-.5)*.010,r])}k++};
        // jejunum: upper left, thicker, more loops; layered front/back
        [[1.056,.012,.080,.052],[1.044,.080,.004,.034],[1.032,.006,.082,.060],[1.020,.082,.000,.040],[1.008,.002,.080,.064],[.996,.080,-.006,.036],[.986,-.004,.060,.058]].forEach(([y,a,b,z])=>row(y,a,b,.0095,z));
        // ileum: lower right, narrower, down into the pelvis rim
        [[.974,.050,-.064,.040],[.962,-.066,.034,.062],[.950,.030,-.066,.036],[.938,-.066,.026,.060],[.926,.020,-.064,.038],[.914,-.062,.014,.058],[.904,.008,-.058,.044]].forEach(([y,a,b,z])=>row(y,a,b,.0080,z));
        sb.push([-.060,.915,.048,.0078],[-.066,.925,.048,.0076]);
        const g=tube2(sb,(u,th,s,q,tot)=>{const r=q[3]*capR(s,tot,.004,.004);return [r,r*.94]},9,9);
        const par=oldI[0].parent;oldI.forEach(drop);addW(g,M.intestine,"intestine","Small intestine",par)}
      // ===== Hepatic veins (right, middle, left) draining into the IVC just below the diaphragm
      if(L){const hv=[[[-.078,1.185,.002],[-.056,1.215,-.004],[-.034,1.236,-.009]],[[-.040,1.160,.032],[-.034,1.205,.010],[-.029,1.240,-.006]],[[.030,1.200,.026],[.004,1.226,.008],[-.022,1.242,-.006]]];
        hv.forEach((p,i)=>{const g=tube2(p.map(q=>q.concat([.0045])),(u,th,s,q,tot)=>{const r=.0022+.0026*u;return [r,r]},8,10);addW(g,M.vein,"vein","Hepatic vein "+["R","M","L"][i],host)})}
      // ===== Portal system and splenic vessels, attached to the pancreas so they move with it
      const pm2=root.userData.panPm,pp=root.userData.panPts;
      if(pm2&&pp){const art=M.artPS||(M.artPS=organ(0xa3201a,.32,{emissive:new T.Color(0x2a0402),emissiveIntensity:.4}));const P=new T.Vector3();
        const toPm=m=>{pm2.add(m);m.updateMatrixWorld(true);m.position.set(0,0,0);m.quaternion.identity();m.scale.set(1,1,1)};
        const mk=(pts,r0,r1,mat,name)=>{const g=tube2(pts,(u,th,s,q,tot)=>{const r=(r0+(r1-r0)*u)*capR(s,tot,.002,.002);return [r,r]},8,10);const m=new T.Mesh(g,mat);toPm(m);pm2.updateMatrixWorld(true);
          const A=g.attributes.position;for(let i=0;i<A.count;i++){P.fromBufferAttribute(A,i);pm2.worldToLocal(P);A.setXYZ(i,P.x,P.y,P.z)}g.setAttribute("color",new T.Float32BufferAttribute(new Float32Array(A.count*3).fill(1),3));fixVol(g);
          m.userData.role="vein";m.name=name;m.frustumCulled=false;m.userData.v68=true;meshes.push(m);(byRole.vein=byRole.vein||[]).push(m);return m};
        mk([[-.002,1.000,.052],[-.004,1.035,.048],[-.008,1.068,.036],[-.011,1.090,.029]],.0045,.0055,M.vein,"Superior mesenteric vein");
        mk([[-.011,1.090,.029],[-.020,1.108,.026],[-.032,1.124,.029],[-.042,1.136,.034]],.0062,.0058,M.vein,"Portal vein");
        const neck=3;const sv=[[-.011,1.090,.029]];for(let i=neck+1;i<pp.length;i++)sv.push([pp[i][0],pp[i][1]-.003,pp[i][2]-.010]);mk(sv,.0042,.0036,M.vein,"Splenic vein");
        const sa=[[.006,1.128,.016],[.012,1.126,.030]];for(let i=neck+2;i<pp.length;i++){const t=i-neck;sa.push([pp[i][0],pp[i][1]+.012+.004*Math.sin(t*2.1),pp[i][2]-.004+.004*Math.cos(t*1.7)])}mk(sa,.003,.0026,art,"Splenic artery");
        mk([[.006,1.128,.016],[-.006,1.131,.024],[-.020,1.132,.028],[-.036,1.140,.036]],.0028,.0024,art,"Common hepatic artery")}
      }
    }

    // ---------- v69: realistic reference organ shapes (HRA 3D Reference Object Library, CC BY 4.0) ----------
    // Each reference organ is re-fitted into the box of the organ it replaces, so placement, cut-away windows, fat and
    // teaching offsets stay as before; meshes with morph targets are never replaced. Falls back to the procedural organs if absent.
    function v69HRA(root){const H=window.PFT_HRA;if(!H||!H.organs)return 0;let n=0;
      const dec=s=>{const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u.buffer};
      const W=new T.Vector3(),C=new T.Vector3();root.updateMatrixWorld(true);
      const box=ms=>{const b=new T.Box3();ms.forEach(m=>{m.updateMatrixWorld(true);b.union(new T.Box3().setFromBufferAttribute(m.geometry.attributes.position).applyMatrix4(m.matrixWorld))});return b};
      const swap=(m,key,mode)=>{const o=H.organs[key];if(!o||!m||!m.geometry)return;const ma=m.geometry.morphAttributes;if(ma&&Object.keys(ma).length)return;
        const b=box([m]);let qp,ix,ao;
         if(o.v){const D=T.MeshoptDecoder,v=new Uint16Array(o.n*4),i32=new Uint32Array(o.t*3);D.decodeVertexBuffer(new Uint8Array(v.buffer),o.n,8,new Uint8Array(dec(o.v)));D.decodeIndexBuffer(new Uint8Array(i32.buffer),o.t*3,4,new Uint8Array(dec(o.ix))); /* v74: meshopt-compressed (xyz + cavity shade packed in 4 x uint16) */
           qp=new Uint16Array(o.n*3);ao=new Uint8Array(o.n);for(let q=0;q<o.n;q++){qp[q*3]=v[q*4];qp[q*3+1]=v[q*4+1];qp[q*3+2]=v[q*4+2];ao[q]=v[q*4+3]}ix=o.n<65536?new Uint16Array(i32):i32}
         else{qp=new Uint16Array(dec(o.p));ix=o.n<65536?new Uint16Array(dec(o.i)):new Uint32Array(dec(o.i));ao=new Uint8Array(dec(o.ao))}
        const sz=[0,1,2].map(a=>o.max[a]-o.min[a]),tz=[0,1,2].map(a=>b.max.getComponent(a)-b.min.getComponent(a));let sc=[0,1,2].map(a=>tz[a]/sz[a]),off=[0,1,2].map(a=>b.min.getComponent(a));
        if(mode==="uni"){const u=Math.sqrt(sc[0]*sc[2]);sc=[u,u,u];off=[b.min.x+(tz[0]-sz[0]*u)/2,b.max.y-sz[1]*u,b.min.z+(tz[2]-sz[2]*u)/2]}
        if(mode==="soft"){const g=Math.cbrt(sc[0]*sc[1]*sc[2]);sc=sc.map(v=>Math.sqrt(v*g));off=[0,1,2].map(a=>b.min.getComponent(a)+(tz[a]-sz[a]*sc[a])/2)}
        const pos=new Float32Array(o.n*3),occ=new Float32Array(o.n),col=new Float32Array(o.n*3);
        for(let v=0;v<o.n;v++){for(let a=0;a<3;a++)W.setComponent(a,off[a]+(qp[v*3+a]/65535)*sz[a]*sc[a]);m.worldToLocal(W);pos[v*3]=W.x;pos[v*3+1]=W.y;pos[v*3+2]=W.z;const c=ao[v]/255;occ[v]=1-c;col[v*3]=col[v*3+1]=col[v*3+2]=key==="lungs"?.55+.45*c:1}
        const g=new T.BufferGeometry();g.setAttribute("position",new T.Float32BufferAttribute(pos,3));g.setAttribute("aOcc",new T.Float32BufferAttribute(occ,1));g.setAttribute("color",new T.Float32BufferAttribute(col,3));
        if(m.geometry.attributes.uv)g.setAttribute("uv",new T.Float32BufferAttribute(new Float32Array(o.n*2),2));
        g.setIndex(new T.BufferAttribute(ix,1));{let vol=0;for(let i=0;i<ix.length;i+=3){const a=ix[i]*3,b2=ix[i+1]*3,c=ix[i+2]*3;vol+=pos[a]*(pos[b2+1]*pos[c+2]-pos[b2+2]*pos[c+1])-pos[a+1]*(pos[b2]*pos[c+2]-pos[b2+2]*pos[c])+pos[a+2]*(pos[b2]*pos[c+1]-pos[b2+1]*pos[c])}if(vol<0)for(let i=0;i<ix.length;i+=3){const t=ix[i+1];ix[i+1]=ix[i+2];ix[i+2]=t}}g.computeVertexNormals();g.computeBoundingBox();g.computeBoundingSphere();m.geometry.dispose&&m.geometry.dispose();m.geometry=g;m.userData.hra=key;n++}; // v70: winding fixed by signed volume, so single-sided (DoubleSide cost ~25% frame time)
      const by=r=>meshes.filter(m=>m.userData.role===r&&m.isMesh);const nm=x=>meshes.find(m=>m.name===x);
      swap(by("liver").sort((a,b)=>b.geometry.attributes.position.count-a.geometry.attributes.position.count)[0],"liver");
      swap(nm("Lungs"),"lungs");swap(nm("Colon"),"colon");swap(nm("Small intestine"),"smallint","soft");
      const ap=nm("Appendix");if(ap)ap.visible=false,ap.scale.set(1e-4,1e-4,1e-4); // the reference colon carries its own caecum + appendix
      by("pancreas").forEach(m=>swap(m,"pancreas"));by("spleen").forEach(m=>swap(m,"spleen"));by("gall").forEach(m=>swap(m,"gall"));
      by("kidney").forEach(m=>{const b=box([m]);swap(m,(b.min.x+b.max.x)/2>0?"kidneyL":"kidneyR","uni")});
      by("heart").forEach(m=>swap(m,"heart","soft"));
      return n}
    // v70: original procedural stomach (swept tube): fundus, body, greater/lesser curvature, antrum and a narrow pylorus that
    // ends at the start of the duodenum. Carries (along, curvature side, ring angle) for the curvature vessel arcades.
    // v73: (a) left lobe of the liver drapes a little further over the stomach (smooth weight, no seam);
    //      (b) diaphragm lifted onto the liver's upper surface so it no longer slices through it (removes the dark streak).
    function v73LiverDiaph(){const big=r=>meshes.filter(m=>m.userData.role===r&&m.isMesh&&m.visible!==false).sort((a,b)=>b.geometry.attributes.position.count-a.geometry.attributes.position.count)[0];
      const lv=big("liver");if(!lv)return;lv.updateMatrixWorld(true);const P=lv.geometry.attributes.position,q=new T.Vector3(),ss=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t)};
      let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(let i=0;i<P.count;i++){q.fromBufferAttribute(P,i);lv.localToWorld(q);x0=Math.min(x0,q.x);x1=Math.max(x1,q.x);y0=Math.min(y0,q.y);y1=Math.max(y1,q.y)}
      const xs=x0+(x1-x0)*.55;for(let i=0;i<P.count;i++){q.fromBufferAttribute(P,i);lv.localToWorld(q);const w=ss(xs,x1,q.x);if(w<=0)continue;const lo=1-ss(y0,y1,q.y)*.6;
        q.x+=.014*w;q.y-=.018*w*lo;q.z+=.024*w*lo;lv.worldToLocal(q);P.setXYZ(i,q.x,q.y,q.z)}
      P.needsUpdate=true;lv.geometry.computeVertexNormals();lv.geometry.computeBoundingSphere();
      meshes.filter(m=>m.userData.role==="diaphragm"&&m.isMesh).forEach(m=>{if(!m.geometry.attributes.aDf)m.geometry.setAttribute("aDf",new T.BufferAttribute(new Float32Array(m.geometry.attributes.position.count).fill(1),1))});const dm=big("diaphragm");if(!dm)return;dm.updateMatrixWorld(true);const C=.006,NX=Math.ceil((x1-x0)/C)+1;let z0=1e9,z1=-1e9;
      for(let i=0;i<P.count;i++){q.fromBufferAttribute(P,i);lv.localToWorld(q);z0=Math.min(z0,q.z);z1=Math.max(z1,q.z)}const NZ=Math.ceil((z1-z0)/C)+1,H=new Float32Array(NX*NZ).fill(-9);
      for(let i=0;i<P.count;i++){q.fromBufferAttribute(P,i);lv.localToWorld(q);const a=Math.round((q.x-x0)/C),b=Math.round((q.z-z0)/C);for(let da=-1;da<=1;da++)for(let db=-1;db<=1;db++){const k=(b+db)*NX+a+da;if(a+da>=0&&a+da<NX&&b+db>=0&&b+db<NZ&&H[k]<q.y)H[k]=q.y}}
      const D=dm.geometry.attributes.position,f=new Float32Array(D.count).fill(1);dm.geometry.setAttribute("aDf",new T.BufferAttribute(f,1));for(let i=0;i<D.count;i++){q.fromBufferAttribute(D,i);dm.localToWorld(q);const a=Math.round((q.x-x0)/C),b=Math.round((q.z-z0)/C);if(a<0||a>=NX||b<0||b>=NZ)continue;const h=H[b*NX+a];
        f[i]=h>-9?ss(.0,.025,q.y-h):1}
      }
    function v70Stomach(){const sm=meshes.filter(m=>m.userData.role==="stomach"&&m.isMesh).sort((a,b)=>b.geometry.attributes.position.count-a.geometry.attributes.position.count)[0];
      if(!sm||sm.morphTargetInfluences)return 0;const V=(x,y,z)=>new T.Vector3(x,y,z);const b=new T.Box3().setFromObject(sm);if(b.isEmpty())return 0;
      const du=meshes.find(m=>m.name==="Duodenum");let P=V(.024,1.112,.052);if(du){du.updateMatrixWorld(true);const A=du.geometry.attributes.position,w=V(0,0,0);let bx=-9;for(let i=0;i<A.count;i++){w.fromBufferAttribute(A,i).applyMatrix4(du.matrixWorld);if(w.y>bx){bx=w.y;P=w.clone()}}}
      const nx=t=>b.min.x+t*(b.max.x-b.min.x),ny=t=>b.min.y+t*(b.max.y-b.min.y),nz=t=>b.min.z+t*(b.max.z-b.min.z);
      const K=[[V(nx(.80),ny(.98),nz(.37)),.044],[V(nx(.82),ny(.90),nz(.42)),.046],[V(nx(.80),ny(.70),nz(.50)),.043],[V(nx(.74),ny(.46),nz(.58)),.040],
        [V(nx(.60),ny(.25),nz(.65)),.035],[V(nx(.42),ny(.18),nz(.68)),.030],[V((nx(.42)+P.x)/2+.004,(ny(.18)+P.y)/2,(nz(.68)+P.z)/2),.026],[P.clone().add(V(.007,0,0)),.009],[P.clone(),.012]]; // v71: fuller fundus, antral bulge, tight pylorus
      const cr=(a,b2,c,d,t)=>{const t2=t*t,t3=t2*t;return .5*((2*b2)+(-a+c)*t+(2*a-5*b2+4*c-d)*t2+(-a+3*b2-3*c+d)*t3)};
      // v72: denser sweep, rounded fundus dome (no pinched cap), smooth body masks, pylorus continued inside the duodenal bulb, Taubin smoothing
      {const d0=K[K.length-1][0].clone().sub(K[K.length-2][0]).normalize();K.push([K[K.length-1][0].clone().add(d0.multiplyScalar(.009)).add(V(-.004,-.002,0)),.012])}
      const NS=128,NR=48,pts=[],rad=[];for(let i=0;i<=NS;i++){const u=i/NS*(K.length-1),k=Math.min(K.length-2,Math.floor(u)),t=u-k,g=j=>K[Math.max(0,Math.min(K.length-1,j))];
        pts.push(V(cr(g(k-1)[0].x,g(k)[0].x,g(k+1)[0].x,g(k+2)[0].x,t),cr(g(k-1)[0].y,g(k)[0].y,g(k+1)[0].y,g(k+2)[0].y,t),cr(g(k-1)[0].z,g(k)[0].z,g(k+1)[0].z,g(k+2)[0].z,t)));
        rad.push((g(k)[1]+(g(k+1)[1]-g(k)[1])*(t*t*(3-2*t)))*.88)}
      // fundus dome: extend the axis backwards and close with a hemispherical radius profile
      {const tg0=pts[1].clone().sub(pts[0]).normalize(),r0=rad[0],ND=14;for(let k=1;k<=ND;k++){const th=k/ND*Math.PI/2;pts.unshift(pts[0].clone().sub(tg0.clone().multiplyScalar(r0*(Math.sin(th)-Math.sin((k-1)/ND*Math.PI/2)))));rad.unshift(r0*Math.cos(th)+1e-4)}}
      {const n=pts.length,tg1=pts[n-1].clone().sub(pts[n-2]).normalize(),r1=rad[n-1],ND=8;for(let k=1;k<=ND;k++){const th=k/ND*Math.PI/2;pts.push(pts[pts.length-1].clone().add(tg1.clone().multiplyScalar(r1*(Math.sin(th)-Math.sin((k-1)/ND*Math.PI/2)))));rad.push(r1*Math.cos(th)+1e-4)}}
      const NT=pts.length-1,sm2=x=>x*x*(3-2*x),band=(x,a0,a1,a2,a3)=>sm2(Math.min(1,Math.max(0,(x-a0)/(a1-a0))))*(1-sm2(Math.min(1,Math.max(0,(x-a2)/(a3-a2)))));
      const pos=[],st=[],ix=[],Z=V(0,0,1),L=q=>{sm.updateMatrixWorld(true);return sm.worldToLocal(q)};let prevOut=null;
      for(let i=0;i<=NT;i++){const tg=pts[Math.min(NT,i+1)].clone().sub(pts[Math.max(0,i-1)]).normalize();let out=V(-tg.y,tg.x,0);if(out.lengthSq()<1e-6)out=prevOut.clone();out.normalize();if(prevOut&&out.dot(prevOut)<0)out.negate();prevOut=out.clone();
        const w=tg.clone().cross(out).normalize();if(w.z<0)w.negate();const sx=i/NT,body=band(sx,.10,.25,.78,.92);
        for(let j=0;j<NR;j++){const a=j/NR*Math.PI*2,c=Math.cos(a),sn=Math.sin(a);
          const bulge=1+body*(.13*Math.max(0,c)**1.5-.06*Math.max(0,-c)**1.5)+.035*Math.cos(2*a)*body+.02*Math.cos(3*a+.8)*body;
          const q=pts[i].clone().add(out.clone().multiplyScalar(c*rad[i]*bulge)).add(w.clone().multiplyScalar(sn*rad[i]*.84));pos.push(q.x,q.y,q.z);st.push(sx,c,sn)}}
      for(let i=0;i<NT;i++)for(let j=0;j<NR;j++){const a=i*NR+j,b2=i*NR+(j+1)%NR,c=a+NR,d=b2+NR;ix.push(a,c,b2,b2,c,d)}
      {const tip=pts[0].clone().sub(pts[1].clone().sub(pts[0]).normalize().multiplyScalar(1e-4));const k=pos.length/3;pos.push(tip.x,tip.y,tip.z);st.push(0,0,0);for(let j=0;j<NR;j++)ix.push(k,(j+1)%NR,j);
        const e=pts[NT],k2=pos.length/3;pos.push(e.x,e.y,e.z);st.push(1,0,0);for(let j=0;j<NR;j++){const a=NT*NR+j,b2=NT*NR+(j+1)%NR;ix.push(k2,a,b2)}}
      // Taubin smoothing on the grid (removes creases without shrinking)
      {const n=pos.length/3,nb=Array.from({length:n},()=>new Set());for(let i=0;i<ix.length;i+=3){const A=ix[i],B=ix[i+1],C=ix[i+2];nb[A].add(B).add(C);nb[B].add(A).add(C);nb[C].add(A).add(B)}
        const step=f=>{const o=pos.slice();for(let v=0;v<n;v++){let x=0,y=0,z=0;for(const u of nb[v]){x+=pos[u*3];y+=pos[u*3+1];z+=pos[u*3+2]}const m=nb[v].size;o[v*3]+=f*(x/m-pos[v*3]);o[v*3+1]+=f*(y/m-pos[v*3+1]);o[v*3+2]+=f*(z/m-pos[v*3+2])}for(let q=0;q<o.length;q++)pos[q]=o[q]};
        for(let it=0;it<14;it++){step(.5);step(-.53)}}
      for(let v=0;v<pos.length/3;v++){const q=L(V(pos[v*3],pos[v*3+1],pos[v*3+2]));pos[v*3]=q.x;pos[v*3+1]=q.y;pos[v*3+2]=q.z}
      const g=new T.BufferGeometry();g.setAttribute("position",new T.Float32BufferAttribute(pos,3));g.setAttribute("aSt",new T.Float32BufferAttribute(st,3));g.setAttribute("aOcc",new T.Float32BufferAttribute(new Float32Array(pos.length/3),1));
      if(sm.geometry.attributes.uv)g.setAttribute("uv",new T.Float32BufferAttribute(new Float32Array(pos.length/3*2),2));g.setIndex(ix);
      {let vol=0;const I=g.index.array,p=pos;for(let i=0;i<I.length;i+=3){const a=I[i]*3,b2=I[i+1]*3,c=I[i+2]*3;vol+=p[a]*(p[b2+1]*p[c+2]-p[b2+2]*p[c+1])-p[a+1]*(p[b2]*p[c+2]-p[b2+2]*p[c])+p[a+2]*(p[b2]*p[c+1]-p[b2+1]*p[c])}if(vol<0)for(let i=0;i<I.length;i+=3){const t=I[i+1];I[i+1]=I[i+2];I[i+2]=t}}
      g.computeVertexNormals();g.computeBoundingBox();g.computeBoundingSphere();sm.geometry.dispose&&sm.geometry.dispose();sm.geometry=g;sm.userData.v70=1;
      meshes.filter(m=>m.userData.role==="stomach"&&m!==sm).forEach(m=>m.visible=false);
      // esophagus stub: from the cardia (lesser-curvature side, just below the fundus) up through the diaphragm hiatus, slightly right and posterior
      {const ic=14+Math.round(NS*.17),tg=pts[ic+1].clone().sub(pts[ic-1]).normalize(),out=V(-tg.y,tg.x,0).normalize();const ca=pts[ic].clone().add(out.clone().multiplyScalar(-rad[ic]*.25));
        const E=[ca,ca.clone().add(V(-.006,.022,-.006)),ca.clone().add(V(-.010,.048,-.014)),ca.clone().add(V(-.012,.075,-.020))],er=[.026,.012,.0085,.008]; // flared base sunk into the cardia (smooth junction)
        const ep=[],ei=[],NE=40,NRE=28;for(let i=0;i<=NE;i++){const u=i/NE*(E.length-1),k=Math.min(E.length-2,Math.floor(u)),t=u-k;const c=E[k].clone().lerp(E[k+1],t),r=er[k]+(er[k+1]-er[k])*(t*t*(3-2*t));const d=E[k+1].clone().sub(E[k]).normalize();
          const a1=V(1,0,0).sub(d.clone().multiplyScalar(d.x)).normalize(),a2=d.clone().cross(a1);for(let j=0;j<NRE;j++){const a=j/NRE*Math.PI*2;const q=c.clone().add(a1.clone().multiplyScalar(Math.cos(a)*r)).add(a2.clone().multiplyScalar(Math.sin(a)*r*.8));L(q);ep.push(q.x,q.y,q.z)}}
        for(let i=0;i<NE;i++)for(let j=0;j<NRE;j++){const a=i*NRE+j,b2=i*NRE+(j+1)%NRE;ei.push(a,b2,a+NRE,b2,b2+NRE,a+NRE)}
        const eg=new T.BufferGeometry();eg.setAttribute("position",new T.Float32BufferAttribute(ep,3));eg.setAttribute("aOcc",new T.Float32BufferAttribute(new Float32Array(ep.length/3),1));eg.setIndex(ei);eg.computeVertexNormals();
        M.esoph=M.esoph||paint(organ(0xc0716a,.4,{side:T.DoubleSide,clearcoat:.3,clearcoatRoughness:.3}),"eso",{grain:.8});const em=new T.Mesh(eg,M.esoph);em.name="Esophagus (stub)";em.userData.role="stomach";em.renderOrder=sm.renderOrder;sm.add(em);meshes.push(em)}
      return 1}
    // ---------- load ----------
    const loader=new T.GLTFLoader();loader.setMeshoptDecoder(T.MeshoptDecoder);
    let loadSource="none";
    function onGLTF(gltf){
      const root=gltf.scene;
      root.traverse(o=>{
        if(!o.isMesh)return;
        const mname=(o.material&&o.material.name||"").replace(/\.\d+$/,"");const role=ROLE[mname]||"intestine";
        o.userData.role=role;o.material=M[role]||M.intestine;o.castShadow=role==="skin"||role==="muscle"||role==="bone";o.receiveShadow=role!=="omentum"&&role!=="mesentery";
        o.frustumCulled=false;meshes.push(o);(byRole[role]=byRole[role]||[]).push(o);
        if(role==="skin"){
          const f=new T.Mesh(o.geometry,M.fat);f.userData.role="fat";f.morphTargetDictionary=o.morphTargetDictionary;f.morphTargetInfluences=o.morphTargetInfluences.slice();
          f.renderOrder=3;f.frustumCulled=false;o.parent.add(f);f.position.copy(o.position);f.quaternion.copy(o.quaternion);f.scale.copy(o.scale);f.updateMatrix();
          meshes.push(f);(byRole.fat=byRole.fat||[]).push(f);
        }
        if(role==="omentum"||role==="mesentery"||role==="lung"||role==="diaphragm")o.renderOrder=2;
      });
      try{v67Anatomy(root)}catch(e){console.warn("anatomy pass",e)}try{root.userData.hra=v69HRA(root)}catch(e){console.warn("anatomy pass v69",e)}try{v70Stomach()}catch(e){console.warn("anatomy pass v70",e)}try{v73LiverDiaph()}catch(e){console.warn("anatomy pass v73",e)}rootRef=root;scene.add(root);ready=true;if(/pftdebug/.test(location.hash))window.__pft3d={scene,meshes,T,renderer,camera};applyMode();applyState();resize();kick();
      opts.onReady&&opts.onReady();syncNav(false);
    }
    // file:// pages cannot fetch the .glb (browsers block local XHR/fetch), so the same model also ships as a
    // classic script (assets/models/pft-anatomy.glb.js) that defines a base64 string; it is used on file:// or if the fetch fails.
    function loadEmbedded(){
      return new Promise((res,rej)=>{if(window.PFT_ANATOMY_GLB_B64)return res();const el=document.createElement("script");
        el.src=models.anatomyEmbedded||(url+".js");el.async=true;el.onload=()=>window.PFT_ANATOMY_GLB_B64?res():rej(new Error("Embedded 3D model is empty"));
        el.onerror=()=>rej(new Error("Could not load "+el.src));document.head.appendChild(el)})
      .then(()=>{const b=atob(window.PFT_ANATOMY_GLB_B64),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u.buffer});
    }
    const fail=err=>{opts.onError&&opts.onError(err)};
    const parse=buf=>{try{loader.parse(buf,"",g=>{loadSource="embedded";onGLTF(g)},fail)}catch(e){fail(e)}};
    const hraP=new Promise(res=>{if(window.PFT_HRA||!url)return res();const el=document.createElement("script");el.src=(models.hraOrgans||url.replace(/[^\/]*$/,"hra-organs.js"))+"?v=7674";el.async=true;el.onload=el.onerror=()=>res();document.head.appendChild(el)});
    if(location.protocol==="file:"||!url)Promise.all([loadEmbedded(),hraP]).then(([b])=>parse(b),fail);
    else loader.load(url,g=>{loadSource="glb";hraP.then(()=>onGLTF(g))},undefined,err=>{Promise.all([loadEmbedded(),hraP]).then(([b])=>parse(b),()=>fail(err))});

    const api={
      framing:"full",
      setLayer(layer,opacity){mode=layer==="internal"?"internal":layer==="external"?"external":"composition";if(typeof opacity==="number"&&isFinite(opacity))fatU.uFatOp.value=opacity;applyMode();kick()},
      setView(v){if(v in VIEWS){camT.az=VIEWS[v];camT.el=framing==="abdomen"?.04:.06;vAz=vEl=0;kick()}},
      setFraming(f){setFramingT(f==="abdomen"?"abdomen":"full");api.framing=framing},
      rotateBy(d){camT.az+=d;cam.az+=d;kick()},
      resetView(){resetView()},setDragMode(m){autoNav=false;dragMode=m==="pan"?"pan":"rotate";syncNav(false)},
      update(s){
        if(s&&typeof s.slider==="number"){const f=frameState(s.profile,s.slider);tgt.subq=f[0];tgt.mass=f[1];tgt.belly=f[2];tgt.visc=f[3];tgt.liver=f[4];tgt.pancreas=f[5];tgt.hyper=f[6]||0;}
        else{const p=s&&s.pftFat||{};const b=BASE[s&&s.profile]||BASE.moderate;
          tgt.subq=+p.subcutaneous||0;tgt.mass=b.mass;tgt.belly=Math.min(1.2,b.belly+(+p.visceralTissue||0));tgt.visc=Math.min(1,b.visc+(+p.visceralTissue||0));
          tgt.liver=+p.liver||0;tgt.pancreas=+p.pancreas||0;tgt.hyper=0;}
        // glycogen: strong while it fills (prelude), then a quieter "stocked" tint
        const gm=+(s&&s.glycogenMuscle)||0,gl=+(s&&s.glycogenLiver)||0,ph=!!(s&&s.glycogenPhase);
        tgt.gly=gm*(ph?1:.45);tgt.glyL=gl*(ph?1:.45);kick()},
      inspect(){return {ready,mode,framing,view:cam.az,el:cam.el,dist:cam.dist,px:cam.px,ty:cam.ty,drag:dragMode,source:loadSource,vessels:vesselsOn,muscles:musclesOn,vesselVisible:meshes.some(m=>m.userData.role==="vessel"&&m.visible),state:{...st},target:{...tgt},meshes:meshes.map(m=>m.userData.role)}},
      organs(){return Object.keys(byRole).filter(r=>!/skin|fat|muscle|bone/.test(r)).map(r=>LABEL[r])},
      sample(){return null},
      dispose(){ro&&ro.disconnect();renderer.dispose()}
    };
    resize();kick();
    return api;
  }
  function stub(){return {framing:"full",setLayer(){},setView(){},setFraming(){},rotateBy(){},update(){},inspect(){return {ready:false}},organs(){return []},sample(){return null}}}
  window.Anatomy3D={create,version:"v22"};
})();
