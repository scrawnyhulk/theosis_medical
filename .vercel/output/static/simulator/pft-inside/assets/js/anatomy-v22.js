/* Personal Fat Threshold V22 · lazy 3D anatomy runtime.
   Geometry: Theosis Medical procedural anatomy on a MakeHuman CC0 base, see CREDITS.md.
   Shape changes (fat pads, abdominal projection, omental fat, organ tint) are illustrative, not measurements. */
(function(){
  "use strict";
  const T=window.AnatomyThree;
  if(!T)return;
  const ROLE={Skin:"skin",Muscles:"muscle",Bones:"bone",Heart:"heart",Liver:"liver",Gallbladder:"gall",Stomach:"stomach",Pancreas:"pancreas",
    Duodenum:"intestine",Jejunum:"intestine",Ascending_colon:"colon",Transverse_colon:"colon",Descending_colon:"colon",Sigmoid_colon:"colon",
    Greater_omentum:"omentum",Spleen:"spleen","Kidney.l":"kidney","Kidney.r":"kidney",Urinary_bladder:"bladder"};
  const LABEL={skin:"Skin",fat:"Subcutaneous fat (under the skin)",muscle:"Skeletal muscle",bone:"Skeleton",heart:"Heart",liver:"Liver",gall:"Gallbladder",
    stomach:"Stomach",pancreas:"Pancreas",intestine:"Small intestine",colon:"Large intestine (colon)",omentum:"Greater omentum · visceral fat",
    spleen:"Spleen",kidney:"Kidney",bladder:"Urinary bladder"};
  // Threshold profiles change the starting body; slider fat is added on top.
  const BASE={lower:{mass:0,belly:0,visc:0},moderate:{mass:0,belly:0,visc:0},larger:{mass:.45,belly:0,visc:0},extreme:{mass:1,belly:.3,visc:.45}};
  const VIEWS={front:0,three:-.62,side:-Math.PI/2,back:Math.PI};
  const reduce=window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):{matches:false};

  const GLSL_COMMON=`
  varying vec3 vPos;
  uniform float uCut; uniform float uHalf; uniform float uTime;
  float pftHash(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
  float pftNoise(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);
    return mix(mix(mix(pftHash(i),pftHash(i+vec3(1,0,0)),f.x),mix(pftHash(i+vec3(0,1,0)),pftHash(i+vec3(1,1,0)),f.x),f.y),
               mix(mix(pftHash(i+vec3(0,0,1)),pftHash(i+vec3(1,0,1)),f.x),mix(pftHash(i+vec3(0,1,1)),pftHash(i+vec3(1,1,1)),f.x),f.y),f.z);}
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
      sh.vertexShader="varying vec3 vPos;\n"+(o.vdecl||"")+sh.vertexShader.replace("#include <project_vertex>","#include <project_vertex>\nvPos=(modelMatrix*vec4(transformed,1.0)).xyz;\n"+(o.vmain||""));
      let f=sh.fragmentShader.replace("#include <common>","#include <common>\n"+GLSL_COMMON+(o.fdecl||""));
      f=f.replace("void main() {",GLSL_BUMP+"\nvoid main() {");
      f=f.replace("#include <clipping_planes_fragment>","#include <clipping_planes_fragment>\n"+(o.discard||""));
      if(o.color)f=f.replace("#include <color_fragment>","#include <color_fragment>\n"+o.color);
      if(o.normal)f=f.replace("#include <normal_fragment_maps>","#include <normal_fragment_maps>\n"+o.normal);
      if(o.light)f=f.replace("#include <lights_fragment_end>","#include <lights_fragment_end>\n"+o.light);
      sh.fragmentShader=f;
    };
    mat.customProgramCacheKey=()=>"pft22-"+key;
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
    const st={subq:0,mass:0,belly:0,visc:0,liver:0,pancreas:0};
    const tgt={...st};
    const fatU={...shared,uSubq:U(0),uMass:U(0),uBelly:U(0),uFatOp:U(.86)};
    const M={};
    M.skin=patch(new T.MeshPhysicalMaterial({color:0xb08672,roughness:.5,metalness:0,sheen:.45,sheenColor:new T.Color(0xe8a088),sheenRoughness:.55,clearcoat:.06,clearcoatRoughness:.6,side:T.DoubleSide}),"skin",{
      uniforms:shared,
      discard:"if(uCut>.5&&pftAbd(vPos,.025)>.5)discard;",
      color:"if(!gl_FrontFacing){diffuseColor.rgb=vec3(.20,.035,.03);}",
      normal:"if(gl_FrontFacing){normal=pftBump(normal,pftNoise(vPos*260.)*.5+pftNoise(vPos*55.),.0009);}",
      light:`#if NUM_DIR_LIGHTS>0
        for(int i=0;i<NUM_DIR_LIGHTS;i++){float nl=dot(normal,directionalLights[i].direction);float w=max(0.,(nl+.6)/1.6)-max(0.,nl);
        reflectedLight.directDiffuse+=diffuseColor.rgb*vec3(1.,.38,.26)*w*directionalLights[i].color*.55;}
      #endif`});
    M.fat=patch(new T.MeshPhysicalMaterial({color:0xf0c35a,roughness:.55,sheen:.15,sheenColor:new T.Color(0xffe2a0),clearcoat:.15,transparent:true,depthWrite:false,side:T.FrontSide}),"fat",{
      uniforms:fatU,
      vdecl:"#ifndef USE_COLOR\nattribute vec4 color;\n#endif\nvarying vec3 vW;\n",vmain:"vW=color.rgb;",
      fdecl:"varying vec3 vW;uniform float uSubq,uMass,uBelly,uFatOp;\n",
      discard:"if(uHalf>.5&&vPos.x<0.0)discard;",
      color:`float th=vW.r*uSubq+vW.g*uMass*.8+vW.r*uBelly*.2;float lob=pftNoise(vPos*38.);
        diffuseColor.rgb=mix(vec3(.95,.64,.12),vec3(1.,.83,.30),lob*.7+.15);
        diffuseColor.a=min(.96,.42+.24*smoothstep(.0,.3,vW.r+vW.g*.6)+.5*smoothstep(.05,.8,th))*uFatOp;if(diffuseColor.a<.01)discard;`,
      normal:"normal=pftBump(normal,pftNoise(vPos*38.)+.35*pftNoise(vPos*110.),.0016);"});
    M.muscle=patch(new T.MeshStandardMaterial({color:0x7d1d17,roughness:.55,metalness:0}),"muscle",{
      uniforms:shared,discard:"if(uCut>.5&&pftAbd(vPos,.03)>.5)discard;",
      color:`float fib=sin(vPos.x*1400.+pftNoise(vPos*vec3(60.,8.,60.))*9.)*.5+.5;float fib2=sin(vPos.z*1400.+pftNoise(vPos*vec3(60.,8.,60.)+7.)*9.)*.5+.5;
        float s=fib*fib2;diffuseColor.rgb*=mix(.62,1.12,s);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.55,.33,.28),pftNoise(vPos*16.)*.18);`,
      normal:`normal=pftBump(normal,fib*fib2,.0006);`});
    M.bone=patch(new T.MeshStandardMaterial({color:0xcfc4ae,roughness:.62}),"bone",{uniforms:shared,discard:"if(uCut>.5&&pftAbd(vPos,.03)>.5)discard;"});
    const organ=(c,r,extra)=>new T.MeshPhysicalMaterial(Object.assign({color:c,roughness:r,clearcoat:.35,clearcoatRoughness:.35,sheen:.25,sheenColor:new T.Color(0xffc0b0)},extra||{}));
    const liverU={...shared,uLiver:U(0)},pancU={...shared,uPanc:U(0)},omU={...shared,uVisc:U(0)};
    M.liver=patch(organ(0x5a1510,.32),"liver",{uniforms:liverU,fdecl:"uniform float uLiver;\n",
      color:"float n=pftNoise(vPos*70.);diffuseColor.rgb=mix(vec3(.30,.065,.045),vec3(.72,.52,.30),uLiver*.85);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.86,.70,.40),n*uLiver*.45);"});
    M.pancreas=patch(organ(0xd29a62,.42),"pancreas",{uniforms:pancU,fdecl:"uniform float uPanc;\n",
      color:"float lo=pftNoise(vPos*240.);float dep=smoothstep(.0,.06,pftNoise(vPos*55.)-(.68-uPanc*.3))*min(1.,uPanc*3.);diffuseColor.rgb=mix(mix(vec3(.74,.44,.26),vec3(.88,.60,.36),lo),vec3(.99,.86,.42),dep);",
      normal:"normal=pftBump(normal,pftNoise(vPos*240.)+dep*2.,.0009);"});
    M.omentum=patch(organ(0xf0c35a,.45,{transparent:true,depthWrite:false,side:T.DoubleSide}),"omentum",{uniforms:omU,fdecl:"uniform float uVisc;\n",
      color:"float lb=pftNoise(vPos*40.);diffuseColor.rgb=mix(vec3(.97,.78,.34),vec3(.86,.60,.20),lb);diffuseColor.a=.16+.74*min(1.,uVisc*1.6);",
      normal:"normal=pftBump(normal,pftNoise(vPos*40.)+.3*pftNoise(vPos*120.),.002);"});
    M.heart=organ(0x8f1a14,.3,{emissive:new T.Color(0x5a0804),emissiveIntensity:.6});
    M.gall=organ(0x3d6a1e,.25);M.stomach=organ(0xb06a62,.36);M.intestine=organ(0xb48c88,.38);M.colon=organ(0x9e746c,.4);
    M.spleen=organ(0x6b1a24,.35);M.kidney=organ(0x7a2a22,.35);M.bladder=organ(0xc9a08a,.4);

    // ---------- labels ----------
    const host=canvas.parentElement;
    const mkLabel=(text,cls)=>{const d=document.createElement("div");d.className="pft3d-flabel "+(cls||"");d.setAttribute("aria-hidden","true");d.innerHTML="<i></i><span></span>";d.querySelector("span").textContent=text;host.appendChild(d);return d};
    const labels=[
      {el:mkLabel("Skin/subcutaneous fat removed","l-left"),anchor:new T.Vector3(-.11,1.33,.105),modes:["composition"],side:-1},
      {el:mkLabel("Visceral fat","l-right"),anchor:new T.Vector3(.05,.98,.11),modes:["composition","internal"],side:1,dyn:true},
      {el:mkLabel("Cross-section showing visceral organs","l-left"),anchor:new T.Vector3(-.04,1.235,.115),modes:["internal"],side:-1}];

    // ---------- camera state (eased) ----------
    const cam={az:VIEWS.three,el:.06,dist:3.85,ty:.9},camT={...cam};
    let framing="full",mode="composition",dirty=true,ready=false,lastT=performance.now(),raf=0,meshes=[],byRole={};
    function setFramingT(f){framing=f;if(f==="abdomen"){camT.dist=1.75;camT.ty=1.06;camT.el=.04}else{camT.dist=3.85;camT.ty=.9;camT.el=.06}kick()}

    function resize(){const w=canvas.clientWidth||1,h=canvas.clientHeight||1;if(canvas.width!==Math.round(w*renderer.getPixelRatio())||canvas.height!==Math.round(h*renderer.getPixelRatio())){renderer.setSize(w,h,false);camera.aspect=w/h;
      // keep the whole body in portrait/narrow stages
      camera.fov=w/h<.62?34:28;camera.updateProjectionMatrix();dirty=true}}
    const ro=window.ResizeObserver?new ResizeObserver(()=>{resize();kick()}):null;if(ro)ro.observe(canvas);

    function applyMode(){
      const show={external:["skin"],composition:["fat","muscle","bone","heart","liver","gall","stomach","pancreas","intestine","colon","omentum","spleen","kidney","bladder"],
        internal:["skin","muscle","bone","heart","liver","gall","stomach","pancreas","intestine","colon","omentum","spleen","kidney","bladder"]}[mode];
      meshes.forEach(m=>{m.visible=show.indexOf(m.userData.role)>=0});
      shared.uCut.value=mode==="external"?0:1;shared.uHalf.value=mode==="composition"?1:0;
      if(byRole.skin)byRole.skin.forEach(m=>{m.castShadow=mode==="external";});
      // Teaching offset (as in the 2D renders): bring the pancreas and gallbladder forward in the cut-away views so they are not hidden behind stomach/liver.
      const off={pancreas:[0,.012,.065],gall:[0,0,.028]};
      for(const r in off)(byRole[r]||[]).forEach(m=>{if(!m.userData.p0)m.userData.p0=m.position.clone();m.position.copy(m.userData.p0);if(mode!=="external")m.position.add(new T.Vector3(...off[r]))});
      dirty=true;
    }
    function stepState(dt){
      const k=reduce.matches?1:1-Math.exp(-dt*4.5);let moving=false;
      for(const n in st){const d=tgt[n]-st[n];if(Math.abs(d)>1e-4){st[n]+=d*k;moving=true}else st[n]=tgt[n]}
      const ck=reduce.matches?1:1-Math.exp(-dt*5.5);
      let dAz=camT.az-cam.az;dAz=Math.atan2(Math.sin(dAz),Math.cos(dAz));
      if(Math.abs(dAz)>1e-4||Math.abs(camT.dist-cam.dist)>1e-4||Math.abs(camT.ty-cam.ty)>1e-4||Math.abs(camT.el-cam.el)>1e-4){
        cam.az+=dAz*ck;cam.dist+=(camT.dist-cam.dist)*ck;cam.ty+=(camT.ty-cam.ty)*ck;cam.el+=(camT.el-cam.el)*ck;moving=true}
      return moving;
    }
    function applyState(){
      meshes.forEach(m=>{const d=m.morphTargetDictionary,inf=m.morphTargetInfluences;if(!d)return;
        if("subq" in d)inf[d.subq]=st.subq;if("mass" in d)inf[d.mass]=st.mass;if("belly" in d)inf[d.belly]=st.belly;if("visc" in d)inf[d.visc]=st.visc;});
      fatU.uSubq.value=st.subq;fatU.uMass.value=st.mass;fatU.uBelly.value=st.belly;
      liverU.uLiver.value=st.liver;pancU.uPanc.value=st.pancreas;omU.uVisc.value=st.visc;
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
      raf=0;const dt=Math.min(.1,(now-lastT)/1000);lastT=now;
      resize();
      const moving=stepState(dt);
      if(moving||dirty){
        applyState();
        const r=cam.dist,ce=Math.cos(cam.el);
        camera.position.set(Math.sin(cam.az)*ce*r,cam.ty+Math.sin(cam.el)*r,Math.cos(cam.az)*ce*r);camera.lookAt(0,cam.ty,0);
        renderer.render(scene,camera);placeLabels();dirty=false;
      }
      if(moving)kick();
    }
    function kick(){dirty=true;if(!raf)raf=requestAnimationFrame(frame)}

    // ---------- input ----------
    let drag=null,moved=0;
    canvas.addEventListener("pointerdown",e=>{drag={x:e.clientX,y:e.clientY};moved=0;canvas.setPointerCapture&&canvas.setPointerCapture(e.pointerId)});
    canvas.addEventListener("pointermove",e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag={x:e.clientX,y:e.clientY};moved+=Math.abs(dx)+Math.abs(dy);
      camT.az-=dx*.008;cam.az=camT.az;camT.el=Math.max(-.5,Math.min(.6,camT.el+dy*.004));cam.el=camT.el;kick()});
    const end=e=>{if(drag&&moved<5)pick(e);drag=null};
    canvas.addEventListener("pointerup",end);canvas.addEventListener("pointercancel",()=>{drag=null});
    canvas.addEventListener("wheel",e=>{e.preventDefault();camT.dist=Math.max(1.1,Math.min(7,camT.dist*Math.exp(e.deltaY*.0012)));kick()},{passive:false});
    canvas.addEventListener("keydown",e=>{const k=e.key;if(k==="ArrowLeft"){camT.az+=.25;kick();e.preventDefault()}else if(k==="ArrowRight"){camT.az-=.25;kick();e.preventDefault()}
      else if(k==="+"||k==="="){camT.dist=Math.max(1.1,camT.dist*.85);kick()}else if(k==="-"){camT.dist=Math.min(7,camT.dist/.85);kick()}});
    const ray=new T.Raycaster(),ndc=new T.Vector2();
    function pick(e){
      if(!ready)return;const r=canvas.getBoundingClientRect();ndc.set(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);ray.setFromCamera(ndc,camera);
      const hits=ray.intersectObjects(meshes.filter(m=>m.visible&&m.userData.role!=="fat"),false);
      let name=null;for(const h of hits){const p=h.point;const role=h.object.userData.role;
        if((role==="skin"||role==="muscle"||role==="bone")&&mode!=="external"&&inWindow(p))continue;name=LABEL[role];break}
      opts.onPick&&opts.onPick(name);
    }
    function inWindow(p){const ax=Math.pow(Math.abs((p.x+.005)/.13),2.6),ay=Math.pow(Math.abs((p.y-1.05)/.2),2.6);return ax+ay<.95&&p.z>.025}

    // ---------- load ----------
    const loader=new T.GLTFLoader();loader.setMeshoptDecoder(T.MeshoptDecoder);
    loader.load(url,gltf=>{
      const root=gltf.scene;
      root.traverse(o=>{
        if(!o.isMesh)return;
        const mname=(o.material&&o.material.name||"").replace(/\.\d+$/,"");const role=ROLE[mname]||"intestine";
        o.userData.role=role;o.material=M[role]||M.intestine;o.castShadow=role==="skin"||role==="muscle"||role==="bone";o.receiveShadow=role!=="omentum";
        o.frustumCulled=false;meshes.push(o);(byRole[role]=byRole[role]||[]).push(o);
        if(role==="skin"){
          const f=new T.Mesh(o.geometry,M.fat);f.userData.role="fat";f.morphTargetDictionary=o.morphTargetDictionary;f.morphTargetInfluences=o.morphTargetInfluences.slice();
          f.renderOrder=3;f.frustumCulled=false;o.parent.add(f);f.position.copy(o.position);f.quaternion.copy(o.quaternion);f.scale.copy(o.scale);f.updateMatrix();
          meshes.push(f);(byRole.fat=byRole.fat||[]).push(f);
        }
        if(role==="omentum")o.renderOrder=2;
      });
      scene.add(root);ready=true;if(/pftdebug/.test(location.hash))window.__pft3d={scene,meshes,T};applyMode();applyState();resize();kick();
      opts.onReady&&opts.onReady();
    },undefined,err=>{opts.onError&&opts.onError(err)});

    const api={
      framing:"full",
      setLayer(layer,opacity){mode=layer==="internal"?"internal":layer==="external"?"external":"composition";if(typeof opacity==="number"&&isFinite(opacity))fatU.uFatOp.value=opacity;applyMode();kick()},
      setView(v){if(v in VIEWS){camT.az=VIEWS[v];kick()}},
      setFraming(f){setFramingT(f==="abdomen"?"abdomen":"full");api.framing=framing},
      rotateBy(d){camT.az+=d;cam.az+=d;kick()},
      update(s){
        const p=s&&s.pftFat||{};const b=BASE[s&&s.profile]||BASE.moderate;
        tgt.subq=+p.subcutaneous||0;tgt.mass=b.mass;tgt.belly=Math.min(1.2,b.belly+(+p.visceralTissue||0));tgt.visc=Math.min(1,b.visc+(+p.visceralTissue||0));
        tgt.liver=+p.liver||0;tgt.pancreas=+p.pancreas||0;kick()},
      inspect(){return {ready,mode,framing,view:cam.az,state:{...st},target:{...tgt},meshes:meshes.map(m=>m.userData.role)}},
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
