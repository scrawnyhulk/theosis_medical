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
    Greater_omentum:"omentum",Mesenteric_arteries:"mesa",Mesenteric_veins:"mesv",Epiploic_appendages:"epiploic",Mesentery:"mesentery",Spleen:"spleen",Arteries:"vessel","Kidney.l":"kidney","Kidney.r":"kidney",Urinary_bladder:"bladder",Nails:"nail"};
  const MUSCLE_NAMES=["Deltoid (anterior part)", "Deltoid (middle part)", "Deltoid (posterior part)", "Biceps brachii", "Brachialis", "Triceps brachii (long head)", "Triceps brachii (lateral head)", "Brachioradialis", "Forearm flexors", "Forearm extensors", "Extensor carpi radialis", "Rectus femoris", "Vastus lateralis", "Vastus medialis", "Sartorius", "Adductor group", "Tensor fasciae latae", "Biceps femoris", "Semitendinosus", "Gastrocnemius (medial head)", "Gastrocnemius (lateral head)", "Soleus", "Tibialis anterior", "Fibularis (peroneus) longus", "Soleus (medial)", "Pectoralis major", "Pectoralis major (abdominal part)", "Rectus abdominis", "Rectus abdominis", "Rectus abdominis", "Rectus abdominis", "External oblique", "External oblique", "Serratus anterior", "Serratus anterior", "Latissimus dorsi", "Trapezius (upper)", "Trapezius (middle)", "Trapezius (lower)", "Infraspinatus", "Teres major", "Erector spinae", "Gluteus maximus", "Gluteus medius", "Sternocleidomastoid", "Infrahyoid (strap) muscles", "Trapezius (upper, nuchal part)", "Suprahyoid muscles (mylohyoid / digastric)"]; // V35: id 47 retired (was neck_back); id 48 = submental group. V32e: index = muscles.py MUS order (id-1)
  const LABEL={skin:"Skin",fat:"Subcutaneous fat (under the skin)",muscle:"Skeletal muscle",bone:"Skeleton",heart:"Heart",liver:"Liver",gall:"Gallbladder",
    stomach:"Stomach",pancreas:"Pancreas",intestine:"Small intestine",colon:"Large intestine (colon)",omentum:"Greater omentum · visceral fat",mesentery:"Mesentery · visceral fat",mesa:"Superior mesenteric artery · jejunal/ileal arcades and vasa recta",mesv:"Superior mesenteric vein",epiploic:"Epiploic appendages · fat tags on the colon",
    spleen:"Spleen",kidney:"Kidney",bladder:"Urinary bladder",vessel:"Arteries (arterial tree)",nail:"Nails (finger- and toenails)"};
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
  // V33: Netter-style living tissue: light scattered under the surface (wrap diffuse tinted toward blood red),
  // a soft terminator glow and a thin moist fresnel sheen; tint = scatter colour, k = strength.
  const SSS=a=>`#if NUM_DIR_LIGHTS>0
      for(int i=0;i<NUM_DIR_LIGHTS;i++){float nl=dot(normal,directionalLights[i].direction);float w=max(0.,(nl+.5)/1.5)-max(0.,nl);
      reflectedLight.directDiffuse+=diffuseColor.rgb*vec3(${a[0]})*w*directionalLights[i].color*${a[1]};}
      #endif
      {float fr=pow(1.-clamp(dot(normal,normalize(vViewPosition)),0.,1.),3.);reflectedLight.indirectSpecular+=vec3(.95,.92,.9)*fr*${a[2]||".06"};}`;
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
      const SER=/^(liver|gall|stomach|intestine|colon|spleen|kidney|bladder|pancreas|heart|vessel)$/.test(key)?"{float fr=1.-max(dot(normal,normalize(vViewPosition)),0.);reflectedLight.indirectSpecular+=vec3(1.,.93,.9)*fr*fr*fr*.10;} // V34 serosal sheen (cheap fresnel)\n":"";
      const L=(o.light||"")+(o.sss?SSS(o.sss):"")+SER;
      if(L)f=f.replace("#include <lights_fragment_end>","#include <lights_fragment_end>\n"+L);
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
    const st={subq:0,mass:0,belly:0,visc:0,liver:0,pancreas:0,hyper:0,gly:0,glyL:0,imcl:0};
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
    M.fat=patch(new T.MeshStandardMaterial({color:0xf0c35a,roughness:.5,metalness:0,transparent:true,depthWrite:false,side:T.FrontSide}),"fat",{
      uniforms:fatU,
      vdecl:"#ifndef USE_COLOR\nattribute vec4 color;\n#endif\nvarying vec4 vW;\n",vmain:"vW=color;",
      fdecl:"varying vec4 vW;uniform float uSubq,uMass,uBelly,uHyper,uFatOp;\n",
      discard:"if(uHalf>.5&&vPos.x<0.0)discard;",
      color:`float th=vW.r*uSubq+vW.a*uHyper*.9+vW.g*uMass*.8+vW.r*uBelly*.2;float lob=pftNoise(vPos*38.);float fn=pftNoise(vPos*95.);float fl=smoothstep(.015,.10,abs(fn-.5));float fd=smoothstep(.2,.8,fn); // cheap ridge-noise lobules (Worley was too slow on weak GPUs)
        diffuseColor.rgb=mix(vec3(.93,.60,.13),vec3(1.,.84,.34),lob*.45+fd*.4)*mix(.80,1.,fl);diffuseColor.rgb=mix(vec3(.78,.46,.30),diffuseColor.rgb,.35+.65*fl); // V33: adipose lobules with pink fibrous septa
        diffuseColor.a=min(.96,.42+.24*smoothstep(.0,.3,vW.r+vW.g*.6)+.5*smoothstep(.05,.8,th))*uFatOp;if(diffuseColor.a<.01)discard;`,
      normal:"normal=pftBump(normal,.6*fd+.5*lob+.2*fn,.0016);" /* V34: reuse colour-pass noise */});
    const muscleU={uSel:U(0),...shared,uGly:U(0),uImcl:U(0)};
    M.muscle=patch(new T.MeshStandardMaterial({color:0x7d1d17,roughness:.55,metalness:0}),"muscle",{
      uniforms:muscleU,vdecl:"attribute vec3 color;\nvarying float vMid;\n",vmain:"vMid=color.r;\n",fdecl:"uniform float uGly,uSel,uImcl;\nvarying float vMid;\n",discard:"if(uCut>.5&&pftAbd(vPos,.03)>.5)discard;",
      color:`float n0=pftNoise(vPos*vec3(60.,8.,60.));float fib=sin(vPos.x*1400.+n0*9.)*.5+.5;float fib2=sin(vPos.z*1400.+(1.-n0)*9.+vPos.y*40.)*.5+.5; // V34: one noise drives both fibre sets
        float s=fib*fib2;diffuseColor.rgb*=mix(.62,1.12,s);
        float mid=vMid*64.;float mi=floor(mid+.5);float hv=fract(sin(mi*12.9898+.7)*43758.5453);diffuseColor.rgb*=mi>.5?(.90+.16*hv):1.;
        // V33: soft intermuscular groove instead of the pale per-triangle seam (that drew zig-zag bands along the limbs)
        float seam=smoothstep(.0,2.5,fwidth(mid));diffuseColor.rgb*=1.-.22*seam;
        // fascia sheen: thin, smooth, fibre-aligned pale glints (fascia lata look) from continuous noise, no mesh edges
        float fl=smoothstep(.62,.9,n0); // V34: fascia glints reuse the fibre noisediffuseColor.rgb=mix(diffuseColor.rgb,vec3(.86,.76,.70),.12*fl);
        if(uSel>.5&&abs(mi-uSel)<.5)diffuseColor.rgb=mix(diffuseColor.rgb,vec3(1.,.72,.36),.42);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.55,.33,.28),pftNoise(vPos*16.)*.18);
        float gr=0.;if(uGly>.001){float gaa=clamp(1.-length(fwidth(vPos*700.))*.35,0.,1.);gr=smoothstep(.70,.82,pftNoise(vPos*vec3(700.,210.,700.)))*gaa*(.6+.4*pftNoise(vPos*70.));} // V33: fine, soft, fibre-aligned glycogen speckle, fades instead of aliasing when fardiffuseColor.rgb=mix(diffuseColor.rgb,vec3(.15,.62,.55),uGly*.12);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.5,1.,.9),min(.38,uGly*.45*gr)); // V32g: lighter glycogen speckle so muscle borders stay readable
        if(uImcl>.001){float im=smoothstep(.70,.80,pftNoise(vPos*vec3(520.,170.,520.)))*(.55+.45*pftNoise(vPos*40.));diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.98,.84,.42),min(.6,uImcl*.75*im));diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.85,.62,.35),uImcl*.10);} // V33: IMCL fine yellow speckle along fibres, all skeletal muscle incl. arms and legs`,
      normal:`normal=pftBump(normal,fib*fib2,.0006);`});
    M.nail=new T.MeshStandardMaterial({color:0xc99a8c,roughness:.42,metalness:0});
    M.bone=patch(new T.MeshStandardMaterial({color:0xcfc4ae,roughness:.62}),"bone",{uniforms:shared,discard:"if(uCut>.5&&pftAbd(vPos,.03)>.5)discard;"});
    // V34: organs use the standard BRDF (no clearcoat/sheen lobes: those doubled shader compile time and per-pixel cost);
    // the wet serosal sheen comes from lower roughness plus a cheap fresnel glint added in patch() (o.serosa).
    const OK_ORG={emissive:1,emissiveIntensity:1,transparent:1,opacity:1,depthWrite:1,side:1};
    const organ=(c,r,extra)=>{const e={};for(const k in (extra||{}))if(OK_ORG[k])e[k]=extra[k];return new T.MeshStandardMaterial(Object.assign({color:c,roughness:Math.max(.24,r*.82),metalness:0},e))};
    const liverU={...shared,uLiver:U(0),uGlyL:U(0)},pancU={...shared,uPanc:U(0)},omU={...shared,uVisc:U(0)};
    // V26: hepatic steatosis - the whole liver turns paler and yellower from within (diffuse, patchy/mottled
    // parenchyma with fine fat droplets), swells slightly and its edges round off; no fat "blobs" on top.
    M.liver=patch(organ(0x5a1510,.36,{clearcoat:.22,clearcoatRoughness:.4,specularIntensity:.45}),"liver",{uniforms:liverU,fdecl:"uniform float uLiver,uGlyL;\n",
      vdecl:"uniform float uLiver;\n",vpre:"transformed+=objectNormal*uLiver*.006;\n",
      color:`float n1=pftNoise(vPos*34.),n2=pftNoise(vPos*96.),n3=pftNoise(vPos*260.);
        vec2 hl=pftCell(vPos*140.);vec3 healthy=vec3(.36,.075,.05)*(.86+.28*n2)*mix(.955,1.02,smoothstep(.0,.2,hl.y-hl.x)); // V33: faint hepatic lobule pattern under the capsule
        vec3 fatty=mix(vec3(.60,.36,.13),vec3(.80,.57,.23),n2*.7+n3*.3);
        float patchy=smoothstep(.25,.75,n1*.7+n3*.3+(uLiver-.6)*1.1);
        float amt=clamp(uLiver*(.3+.7*patchy),0.,1.);
        diffuseColor.rgb=mix(healthy,fatty,amt*.92);
        vec2 dc=pftCell(vPos*300.);float drop=(1.-smoothstep(.12,.36,dc.x))*smoothstep(.35,.65,n3*.5+patchy*.5);
        diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.95,.80,.45),drop*uLiver*.45);
        vec2 gqc=pftCell(vPos*vec3(700.,700.,700.));float gq=(1.-smoothstep(.10,.34,gqc.x))*clamp(1.-length(fwidth(vPos*700.))*.35,0.,1.)*(.55+.45*pftNoise(vPos*60.)); // V33: fine soft glycogen granules (was blocky value noise)
        float gl=uGlyL*(1.-smoothstep(.04,.55,uLiver)); // V33: fatty marbling progressively replaces the glycogen teal; none left at advanced steatosis
        float mv=1.-smoothstep(.0,.09,abs(pftNoise(vPos*vec3(22.,40.,22.))-.5));diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.93,.80,.46),mv*smoothstep(.15,.7,uLiver)*.55); // pale-yellow marbling streaks
        float cvl=1.-smoothstep(.0,.018,abs(pftNoise(vPos*vec3(28.,18.,28.)+3.)-.5));diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.26,.035,.035),cvl*.22*(1.-.6*uLiver)); // V34: faint capsular vessels (layering under Glisson's capsule)
        diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.15,.62,.55),gl*.28*(1.-.8*uLiver));diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.45,1.,.87),gl*.55*gq);`,
      normal:"normal=pftBump(normal,pftNoise(vPos*96.)*.4+.06*smoothstep(.0,.2,hl.y-hl.x)+(1.-smoothstep(.1,.34,dc.x))*.5*uLiver,.0006);",
      sss:[".9,.25,.18",".35",".03"]});
    M.pancreas=patch(organ(0xd29a62,.42),"pancreas",{uniforms:pancU,fdecl:"uniform float uPanc;\n",
      color:"vec2 pc=pftCell(vPos*150.);float lb=smoothstep(.02,.17,pc.y-pc.x);float lo=pftNoise(vPos*240.);float dep=smoothstep(.0,.06,pftNoise(vPos*55.)-(.68-uPanc*.3))*min(1.,uPanc*3.);vec3 lobc=mix(vec3(.80,.57,.38),vec3(.91,.71,.49),lo*.65+(1.-smoothstep(.0,.7,pc.x))*.35);diffuseColor.rgb=mix(vec3(.55,.32,.25),lobc,lb);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.99,.86,.42),dep); /* V35: cream-tan lobules separated by darker connective-tissue clefts */",
      normal:"normal=pftBump(normal,pftNoise(vPos*240.)*.4+lb*.9+dep*2.,.0011);",sss:[".9,.45,.3",".5",".06"]});
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
        float base=.16+.70*min(1.,uVisc*1.6);base=min(base,mix(.80,.30,smoothstep(.30,.90,uVisc)));  // V32i: stays partly see-through at high visceral fat so the organs behind still read
        diffuseColor.a=base*mix(.5,1.,lob)+ves*.12;`,
      normal:"normal=pftBump(normal,dome+.25*sub,.0035);" /* V34: reuse the colour-pass cells (was a second Worley pass) */,sss:[".95,.6,.25",".45",".07"]});
    M.mesentery=M.omentum;
    // V34: mesenteric vessels run inside the fatty mesentery: drawn through it (renderOrder after the sheet) so the arcades read as in an atlas plate
    M.mesa=patch(organ(0xa3140f,.3,{emissive:new T.Color(0x3a0402),emissiveIntensity:.35}),"mesa",{uniforms:shared,color:"diffuseColor.rgb*=.88+.2*pftNoise(vPos*400.);"});
    M.mesv=patch(organ(0x3a3f7a,.32,{emissive:new T.Color(0x0a0c26),emissiveIntensity:.3}),"mesv",{uniforms:shared,color:"diffuseColor.rgb*=.88+.2*pftNoise(vPos*300.);"});
    M.epiploic=patch(organ(0xe8b64c,.45),"epiploic",{uniforms:omU,fdecl:"uniform float uVisc;\n",vdecl:"uniform float uVisc;\n",vpre:"transformed+=objectNormal*uVisc*.0025;\n",
      color:"float lb=pftNoise(vPos*220.);diffuseColor.rgb=mix(vec3(.86,.58,.20),vec3(1.,.82,.36),lb*.7);",normal:"normal=pftBump(normal,lb,.0006);"}); // V32e: the mesentery sheet shares the lobulated visceral-fat material
    // V26: mesenteric fat - lobulated yellow fat gathers along the bowel loops as visceral fat grows
    const bowelU={...shared,uVisc:omU.uVisc};
    const bowel=(c,r,k)=>patch(organ(c,r),k,{uniforms:bowelU,fdecl:"uniform float uVisc;\n",
      color:`float m=smoothstep(.42,.72,pftNoise(vPos*26.)+.15*pftNoise(vPos*80.))*min(1.,uVisc*1.5);vec2 c=m>.002?pftCell(vPos*80.):vec2(1.,1.2); // V34: skip the Worley pass where no mesenteric fat shows
        float lob=smoothstep(.03,.2,c.y-c.x);float dm=1.-smoothstep(.0,.7,c.x);vec3 fat=mix(vec3(.84,.54,.15),vec3(.98,.76,.30),dm)*mix(.72,1.,dm);
        float bv=1.-smoothstep(.0,.014,abs(pftNoise(vPos*vec3(30.,90.,30.))-.5));diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.55,.10,.10),bv*.45*(1.-m)); // V33: fine serosal vessels
        diffuseColor.rgb*=.92+.12*pftNoise(vPos*60.);
        diffuseColor.rgb=mix(diffuseColor.rgb,mix(vec3(.72,.40,.30),fat,lob),m*.9);`,sss:[".95,.35,.28",".6",".08"],
      normal:"normal=pftBump(normal,dm*m,.002);"});
    M.heart=organ(0x8f1a14,.3,{emissive:new T.Color(0x5a0804),emissiveIntensity:.6});
    const tex=(c,r,k,sc,col,extra)=>patch(organ(c,r,extra),k,{uniforms:shared,color:col||"diffuseColor.rgb*=.9+.16*pftNoise(vPos*"+sc+".);",normal:"normal=pftBump(normal,pftNoise(vPos*"+sc+".)+.3*pftNoise(vPos*"+(sc*3)+".),.0005);",sss:[".95,.3,.22",".5",".08"]});
    M.gall=tex(0x5f7550,.62,"gall",70,"diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.46,.56,.38),.30*pftNoise(vPos*40.));float cy=1.-smoothstep(.0,.02,abs(pftNoise(vPos*vec3(60.,90.,60.))-.5));diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.55,.16,.12),cy*.35);" /* V34: cystic artery branches on the wall */,{clearcoat:.12,clearcoatRoughness:.5,specularIntensity:.35,transparent:true,opacity:.9}); // V33: matte, slightly translucent green-grey wall
    M.stomach=tex(0xb06a62,.34,"stomach",50,"float sv=1.-smoothstep(.0,.012,abs(pftNoise(vPos*vec3(40.,24.,40.))-.5));diffuseColor.rgb*=.9+.16*pftNoise(vPos*50.);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.55,.1,.12),sv*.5);");M.intestine=bowel(0xb48c88,.38,"intestine");M.colon=bowel(0x9e746c,.4,"colon");
    M.vessel=patch(organ(0x8a0f0c,.3,{emissive:new T.Color(0x3a0402),emissiveIntensity:.5}),"vessel",{uniforms:shared,discard:"if(uCut>.5&&pftAbd(vPos,.03)>.5)discard;",sss:[".9,.15,.1",".6",".12"]});
    M.spleen=tex(0x6b1a24,.33,"spleen",80);M.kidney=tex(0x7a2a22,.3,"kidney",45);M.bladder=tex(0xc9a08a,.38,"bladder",40);
    M.heart=patch(organ(0x8f1a14,.28,{emissive:new T.Color(0x5a0804),emissiveIntensity:.45}),"heart",{uniforms:shared,color:"float cv=1.-smoothstep(.0,.02,abs(pftNoise(vPos*vec3(22.,14.,22.))-.5));diffuseColor.rgb*=.9+.15*pftNoise(vPos*60.);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.95,.75,.35),cv*.35);",sss:[".9,.2,.15",".5",".08"]}); // V33: epicardial fat streaks along vessel grooves

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
      const show={external:["skin","nail"],composition:["vessel","fat","nail","muscle","bone","heart","liver","gall","stomach","pancreas","intestine","colon","omentum","mesentery","mesa","mesv","epiploic","spleen","kidney","bladder"],
        internal:["vessel","skin","nail","muscle","bone","heart","liver","gall","stomach","pancreas","intestine","colon","omentum","mesentery","mesa","mesv","epiploic","spleen","kidney","bladder"]}[mode];
      meshes.forEach(m=>{m.visible=show.indexOf(m.userData.role)>=0&&(m.userData.role!=="vessel"||vesselsOn)&&(m.userData.role!=="muscle"||musclesOn)});
      if(mBtn)mBtn.hidden=mode==="external";
      if(vBtn)vBtn.hidden=mode==="external";
      shared.uCut.value=mode==="external"?0:1;shared.uHalf.value=mode==="composition"?1:0;
      if(byRole.skin)byRole.skin.forEach(m=>{m.castShadow=mode==="external";});
      // V25: shadows only on the body surface; cut-away views get shadow-free, soft frontal light
      const cut=mode!=="external";key.castShadow=!cut;head.intensity=cut?.85:.6;rimL.intensity=cut?1.6:.42;rimR.intensity=cut?1.4:.38;fill.intensity=cut?.55:.6;hemi.intensity=cut?.75:.55;key.intensity=cut?2.1:2.25;
      // Teaching offset (as in the 2D renders): bring the pancreas and gallbladder forward in the cut-away views so they are not hidden behind stomach/liver.
      const off={pancreas:[0,0,0]}; // V33: gallbladder stays seated in its fossa under the liver
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
    function applyState(){
      meshes.forEach(m=>{const d=m.morphTargetDictionary,inf=m.morphTargetInfluences;if(!d)return;
        if("subq" in d)inf[d.subq]=st.subq;if("mass" in d)inf[d.mass]=st.mass;if("belly" in d)inf[d.belly]=st.belly;if("visc" in d)inf[d.visc]=st.visc;if("hyper" in d)inf[d.hyper]=st.hyper;});
      fatU.uSubq.value=st.subq;fatU.uMass.value=st.mass;fatU.uBelly.value=st.belly;fatU.uHyper.value=st.hyper;
      liverU.uLiver.value=st.liver;liverU.uGlyL.value=glyOn?st.glyL:0;muscleU.uGly.value=glyOn?st.gly:0;muscleU.uImcl.value=st.imcl;pancU.uPanc.value=st.pancreas;omU.uVisc.value=st.visc;
      if(M.heart)M.heart.emissiveIntensity=.45;
    }
    const v3=new T.Vector3();
    function placeLabels(){
      const w=canvas.clientWidth,h=canvas.clientHeight,ox=canvas.offsetLeft,oy=canvas.offsetTop;const facing=Math.cos(cam.az);
      // V33: never let a floating 3D label cover the header text (title, profile line, selection hint)
      const nowT=performance.now();if(!(nowT-(placeLabels.t||0)<600)){placeLabels.t=nowT;let hdrB=0;const hr=host.getBoundingClientRect();[".pft3d-hud",".pft3d-selection"].forEach(q=>{const e=host.querySelector(q);if(e&&e.offsetParent&&e.textContent.trim()){const r=e.getBoundingClientRect();if(r.height)hdrB=Math.max(hdrB,r.bottom-hr.top)}});placeLabels.h=hdrB}const hdrB=placeLabels.h||0;
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
        const lt=y-(top?40:14);if(lt<hdrB+2){L.el.classList.remove("on");return}
        L.el.style.transform="translate("+x.toFixed(1)+"px,"+y.toFixed(1)+"px)";
      });
    }
    function frame(now){
      raf=0;const dt=Math.max(0,Math.min(.25,(now-lastT)/1000)); // V34: eases are time-based up to 4 fps (was 10), so slow GPUs settle in the same wall timelastT=Math.max(lastT,now); // V26: rAF time can precede lastT after a long task; never step backwards
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
      if(autoNav)dragMode=zoomed()?"pan":"rotate";
      const mv=$n("pft3d-move");if(mv){mv.setAttribute("aria-pressed",String(dragMode==="pan"));mv.classList.toggle("active",dragMode==="pan")}
      const st=$n("pft3d-status");
      if(st&&ready)st.textContent=dragMode==="pan"?(coarse?"Zoomed in · drag to move · tap ✥ to rotate":"Zoomed in · drag to move · Shift-drag to rotate · Reset view to recenter")
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
      const hits=ray.intersectObjects(meshes.filter(m=>m.visible),false);
      let name=null;for(const h of hits){const p=h.point;const role=h.object.userData.role;
        // V35: the fat layer is only drawn on the +x half in the half-and-half view; where it is opaque enough (same alpha formula as the fat shader, at the current
        // slider setting) a click names just "Subcutaneous fat" instead of the structures underneath. Transparent fat (low slider, thin/zero-weight areas) is clicked through.
        if(role==="fat"){if(p.x<0||fatAlphaAt(h)<FAT_PICK_MIN)continue;if(muscleU.uSel.value){muscleU.uSel.value=0;kick()}name="Subcutaneous fat";break}
        if((role==="skin"||role==="muscle"||role==="bone")&&mode!=="external"&&inWindow(p))continue;name=LABEL[role];
          if(role==="muscle"){const ca=h.object.geometry.attributes.color;let id=0;if(ca&&h.face)id=Math.round(ca.getX(h.face.a)*64);const mn=id>0&&MUSCLE_NAMES[id-1];muscleU.uSel.value=mn?id:0;if(mn)name="Muscle · "+mn;kick()}else if(muscleU.uSel.value){muscleU.uSel.value=0;kick()}
          break}
      opts.onPick&&opts.onPick(name);
    }
    const FAT_PICK_MIN=.5;
    const sstp=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t)};
    function fatAlphaAt(h){ // mirrors the M.fat colour shader: alpha = min(.96,.42+.24*ss(r+.6g)+.5*ss(th))*uFatOp
      const ca=h.object.geometry.attributes.color;if(!ca||!h.face)return 1;
      const ids=[h.face.a,h.face.b,h.face.c];let w=h.barycoord?[h.barycoord.x,h.barycoord.y,h.barycoord.z]:[1/3,1/3,1/3],r=0,g=0,a=0;
      for(let i=0;i<3;i++){r+=w[i]*ca.getX(ids[i]);g+=w[i]*ca.getY(ids[i]);a+=(ca.itemSize>3?ca.getW(ids[i]):0)*w[i]}
      const th=r*st.subq+a*st.hyper*.9+g*st.mass*.8+r*st.belly*.2;
      return Math.min(.96,.42+.24*sstp(0,.3,r+g*.6)+.5*sstp(.05,.8,th))*fatU.uFatOp.value}
    function inWindow(p){const ax=Math.pow(Math.abs((p.x+.005)/.13),2.6),ay=Math.pow(Math.abs((p.y-1.05)/.2),2.6);return ax+ay<.95&&p.z>.025}

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
        if(role==="omentum"||role==="mesentery")o.renderOrder=2;if(role==="mesa"||role==="mesv")o.renderOrder=3;
      });
      scene.add(root);ready=true;Object.assign(st,tgt);Object.assign(cam,camT); // V34: first frame shows the settled state (no post-load ease of 20+ frames on slow GPUs)
      if(/pftdebug/.test(location.hash))window.__pft3d={scene,meshes,T};applyMode();applyState();resize();kick();
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
    if(location.protocol==="file:"||!url)loadEmbedded().then(parse,fail);
    else loader.load(url,g=>{loadSource="glb";onGLTF(g)},ev=>{const el=host.querySelector(".pft3d-loading");if(el&&ev&&ev.total){const pc=Math.min(99,Math.round(100*ev.loaded/ev.total));el.textContent="Loading 3D anatomy… "+pc+"%";el.dataset.progress=pc}},err=>{loadEmbedded().then(parse,()=>fail(err))});

    const api={
      framing:"full",
      setLayer(layer,opacity){mode=layer==="internal"?"internal":layer==="external"?"external":"composition";if(typeof opacity==="number"&&isFinite(opacity))fatU.uFatOp.value=opacity;applyMode();kick()},
      setView(v){if(v in VIEWS){camT.az=VIEWS[v];camT.el=framing==="abdomen"?.04:.06;vAz=vEl=0;kick()}},
      setFraming(f){setFramingT(f==="abdomen"?"abdomen":"full");api.framing=framing},
      rotateBy(d){camT.az+=d;cam.az+=d;kick()},
      setCamera(c){Object.assign(camT,c);Object.assign(cam,c);autoNav=false;kick()}, // test/screenshot hook
      pickDebug(ndcx,ndcy){ndc.set(ndcx,ndcy);ray.setFromCamera(ndc,camera);const hs=ray.intersectObjects(meshes.filter(m=>m.visible),false).map(h=>({role:h.object.userData.role,a:h.object.userData.role==='fat'?fatAlphaAt(h):null,x:h.point.x}));return hs},
      debugOnly(roles){meshes.forEach(m=>{if(roles)m.visible=roles.indexOf(m.userData.role)>=0});kick()},
      resetView(){resetView()},setDragMode(m){autoNav=false;dragMode=m==="pan"?"pan":"rotate";syncNav(false)},
      update(s){
        if(s&&typeof s.slider==="number"){const f=frameState(s.profile,s.slider);tgt.subq=f[0];tgt.mass=f[1];tgt.belly=f[2];tgt.visc=f[3];tgt.liver=f[4];tgt.pancreas=f[5];tgt.hyper=f[6]||0;}
        else{const p=s&&s.pftFat||{};const b=BASE[s&&s.profile]||BASE.moderate;
          tgt.subq=+p.subcutaneous||0;tgt.mass=b.mass;tgt.belly=Math.min(1.2,b.belly+(+p.visceralTissue||0));tgt.visc=Math.min(1,b.visc+(+p.visceralTissue||0));
          tgt.liver=+p.liver||0;tgt.pancreas=+p.pancreas||0;tgt.hyper=0;}
        // glycogen: strong while it fills (prelude), then a quieter "stocked" tint
        const gm=+(s&&s.glycogenMuscle)||0,gl=+(s&&s.glycogenLiver)||0,ph=!!(s&&s.glycogenPhase);
        if(s&&typeof s.revLiverK==='number'){tgt.liver*=s.revLiverK;tgt.pancreas*=s.revPancK}
        tgt.imcl=+(s&&s.imcl)||0; // V33: intramyocellular lipid (illustrative)
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
