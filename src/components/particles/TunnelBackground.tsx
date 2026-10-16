// @ts-nocheck
"use client";

// Portiert 1:1 aus der abgenommenen Hintergrund-Vorschau (Partikel-Tunnel zum Schwarzen Loch).
import { useEffect, useRef } from "react";
import * as THREE from "three";

function initTunnel(canvas: HTMLCanvasElement): () => void {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = matchMedia('(pointer: coarse)').matches;
  var renderer;
  try { renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true, powerPreference:'high-performance'}); }
  catch(e){ return function(){}; }
  renderer.setClearColor(0x030206, 1);
  var camera = new THREE.PerspectiveCamera(58, 1, 0.1, 800);
  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030206, 0.0062);
  var ptr = {x:0, y:0, tx:0, ty:0};
  var L = 335;
  function resize(){
    var w = innerWidth, h = innerHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, coarse ? 2 : 2.5));
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  function onMove(e){ ptr.tx = (e.clientX / innerWidth) * 2 - 1; ptr.ty = -((e.clientY / innerHeight) * 2 - 1); }
  addEventListener('resize', resize); addEventListener('pointermove', onMove); resize();

  function am(m){ m.transparent = true; m.depthWrite = false; m.blending = THREE.AdditiveBlending; return m; }
  function tex(fn){ var c = document.createElement('canvas'); c.width = c.height = 128; var x = c.getContext('2d'); fn(x); return new THREE.CanvasTexture(c); }
  var GLOW = tex(function(x){ var g = x.createRadialGradient(64,64,0,64,64,64); g.addColorStop(0,'rgba(255,255,255,.9)'); g.addColorStop(.35,'rgba(255,255,255,.22)'); g.addColorStop(1,'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0,0,128,128); });
  function gauss(){ return (Math.random()+Math.random()+Math.random()-1.5)/1.5; }

  /* Partikel-Shader: weicher heisser Kern + farbiger Hof, Groesse je Partikel, Flackern, Tiefennebel, Doppler-Aufhellung an der Scheibe */
  var pmats = [];
  var VS = 'attribute vec3 aCol; attribute float aSize; attribute float aPh; uniform float uTime, uScale, uBase, uFog, uDop, uRise, uComp, uHole, uRiseK, uThin; uniform vec3 uAxis, uCenter; varying vec3 vCol; varying float vA, vPh, vDof;' +
    'void main(){ vPh = aPh; vec4 wp = modelMatrix * vec4(position,1.0); if (uDop < 0.5){ if (uRiseK > 0.5){ float rr = uRise * (0.5 + 0.5 * aPh); wp.y = cameraPosition.y + mod(wp.y - cameraPosition.y + rr + 70.0, 140.0) - 70.0; } vec2 q = wp.xy - cameraPosition.xy; float ang = uComp * 5.0 / (1.0 + length(q) * 0.06); float cs = cos(ang), sn = sin(ang); q = vec2(q.x * cs - q.y * sn, q.x * sn + q.y * cs); wp.xy = cameraPosition.xy + q * (1.0 - uComp * 0.88); } vec4 mv = viewMatrix * wp; float d = max(0.5, -mv.z); if (uDop < 0.5 && uHole > 0.0){ float cl = max(length(mv.xy), 1e-4); if (cl < uHole * d) mv.xy = mv.xy / cl * uHole * d; }' +
    'float tw = 0.62 + 0.38 * sin(uTime * (0.8 + aPh * 3.5) + aPh * 40.0) * sin(uTime * 0.37 + aPh * 11.0); vDof = 0.0; float dop = 1.0;' +
    'if (uDop > 0.5){ vec3 rv = wp.xyz - uCenter; vec3 vel = normalize(cross(uAxis, rv) + vec3(1e-5)); vec3 tc = normalize(cameraPosition - wp.xyz); dop = pow(max(1.0 + 0.9 * dot(vel, tc), 0.15), 2.0); }' +
    'float sp = aPh > 0.5 ? pow(max(0.0, sin(uTime * (0.7 + aPh * 2.2) + aPh * 91.0)), 48.0) : 0.0; float bl = 1.0 / (1.0 + pow(length(wp.xyz - vec3(0.0, 0.0, -362.0)) / 110.0, 2.0)); vec3 lit = aCol * (0.6 + 0.9 * bl) * mix(vec3(0.86, 0.92, 1.05), vec3(1.12, 0.92, 0.8), bl); vCol = mix(lit * tw * dop, vec3(1.0, 0.95, 0.88) * 1.6, sp * 0.55) * (1.0 + sp * 2.6); vA = exp(-pow(uFog * d, 2.0)); float raw = uBase * aSize * uScale / max(d, 40.0); gl_PointSize = clamp(raw * 1.5, 3.0, 60.0); vA *= clamp(raw * 0.5, 0.2, 1.0) * step(uThin * 0.88, fract(aPh * 97.0)); gl_Position = projectionMatrix * mv; }';
  var FS = 'varying vec3 vCol; varying float vA, vPh, vDof; uniform float uAlpha; void main(){ vec2 p = gl_PointCoord - 0.5; float r = length(p) * 2.0; if (r > 1.0) discard;' +
    'float disk = 1.0 - smoothstep(0.16, 0.3, r); float core = exp(-r * r * 26.0); float halo = exp(-r * r * 5.0) * 0.22; float m = clamp(max(vCol.r, max(vCol.g, vCol.b)), 0.0, 1.0);' +
    'float fall = 1.0 - smoothstep(0.8, 1.0, r);' +
    'vec3 c = vCol * (halo + disk * 0.6 + core * 0.5) + vec3(1.0, 0.96, 0.92) * core * 0.7 * m; float a = clamp((halo + disk * 0.85 + core * 0.3) * fall * vA * uAlpha, 0.0, 1.0); gl_FragColor = vec4(c, a); }';
  function PM(o){
    var m = new THREE.ShaderMaterial({
      uniforms:{uTime:{value:0}, uScale:{value:500}, uBase:{value:o.size}, uFog:{value:o.fog === undefined ? .0062 : o.fog}, uDop:{value:o.dop ? 1 : 0}, uRise:{value:0}, uComp:{value:0}, uHole:{value:0}, uThin:{value:0}, uRiseK:{value:o.rise === false ? 0 : 1}, uAlpha:{value:o.alpha === undefined ? 1 : o.alpha}, uAxis:{value:new THREE.Vector3(0,1,0)}, uCenter:{value:new THREE.Vector3()}},
      vertexShader:VS, fragmentShader:FS
    });
    am(m); pmats.push(m); return m;
  }
  function pgeo(pos, col, n, sizeFn){
    var g = new THREE.BufferGeometry(), sz = new Float32Array(n), ph = new Float32Array(n);
    for (var i=0;i<n;i++){ sz[i] = sizeFn ? sizeFn() : .3 + Math.pow(Math.random(),5)*1.9; ph[i] = Math.random(); }
    g.setAttribute('position', new THREE.BufferAttribute(pos,3)); g.setAttribute('aCol', new THREE.BufferAttribute(col,3));
    g.setAttribute('aSize', new THREE.BufferAttribute(sz,1)); g.setAttribute('aPh', new THREE.BufferAttribute(ph,1));
    return g;
  }
  var PAL = [{a:'#ff3a3a', b:'#ff9c86'}];
  var cA = new THREE.Color(), cB = new THREE.Color(), painters = [], tmp = new THREE.Color();
  /* Sterne */
  var NS = coarse ? 1400 : 2600, sPos = new Float32Array(NS*3), sCol = new Float32Array(NS*3), sK = new Float32Array(NS), sB = new Float32Array(NS);
  for (var i=0;i<NS;i++){
    var z = 30 - Math.random()*450, a = Math.random()*6.2832, r = 7 + Math.pow(Math.random(),.7)*95;
    sPos[i*3]=Math.cos(a)*r; sPos[i*3+1]=Math.sin(a)*r*.7; sPos[i*3+2]=z; sK[i]=Math.random(); sB[i]=.45+Math.random()*.55;
  }
  var sky = new THREE.Group(); scene.add(sky);
  var sUV = new Float32Array(NS*2); for (var si=0;si<NS;si++){ sUV[si*2] = Math.random()*2 - 1; sUV[si*2+1] = Math.random()*2 - 1; sPos[si*3+2] = -300; }
  var lastSR = -1; function starUpd(){ var R = 300*Math.tan(camera.fov*Math.PI/360)*Math.sqrt(1 + camera.aspect*camera.aspect)*1.05; if (Math.abs(R - lastSR) < .01) return; lastSR = R; for (var i=0;i<NS;i++){ sPos[i*3] = sUV[i*2]*R; sPos[i*3+1] = sUV[i*2+1]*R; } sGeo.attributes.position.needsUpdate = true; }
  var sGeo = pgeo(sPos, sCol, NS);
  var stars = new THREE.Points(sGeo, PM({size:1.5, rise:false, alpha:1, fog:0})); stars.frustumCulled = false; sky.add(stars);
  painters.push(function(){
    for (var i=0;i<NS;i++){
      var k = sK[i]; if (k < .06) tmp.copy(cB); else if (k < .16) tmp.setRGB(1,1,1).lerp(cA,.45); else if (k < .55) tmp.setRGB(.82,.9,1); else if (k < .85) tmp.setRGB(1,.97,.92); else tmp.setRGB(1,.86,.72);
      tmp.multiplyScalar(sB[i]); sCol[i*3]=tmp.r; sCol[i*3+1]=tmp.g; sCol[i*3+2]=tmp.b;
    }
    sGeo.attributes.aCol.needsUpdate = true;
  });
  /* Bewegliche Partikel in den Bildschirm-Ecken */
  var NC = coarse ? 6000 : 16000, cN = new Float32Array(NC*2), cPh = new Float32Array(NC), cSp = new Float32Array(NC), cK = new Float32Array(NC), cB2 = new Float32Array(NC), cW = new Float32Array(NC), cPos = new Float32Array(NC*3), cCol = new Float32Array(NC*3);
  for (var ci=0;ci<NC;ci++){
    var rin = .72, rout = 2.7; cN[ci*2] = Math.sqrt(rin*rin + Math.random()*(rout*rout - rin*rin)); cN[ci*2+1] = Math.random()*6.2832;
    cPh[ci] = Math.random()*6.2832; cSp[ci] = .4 + Math.random()*1.1; cK[ci] = Math.random(); cB2[ci] = .5 + Math.random()*.5; cW[ci] = (Math.random()<.5 ? -1 : 1)*(.03 + Math.random()*.06);
  }
  var cGeo = pgeo(cPos, cCol, NC);
  var cPts = new THREE.Points(cGeo, PM({size:.55, rise:false, alpha:.95, fog:0})); cPts.frustumCulled = false; sky.add(cPts);
  painters.push(function(){
    for (var i=0;i<NC;i++){ var k = cK[i]; if (k > .93) tmp.setRGB(1,.93,.86); else tmp.copy(cA).lerp(cB, k/.93*.8); tmp.multiplyScalar(cB2[i]); cCol[i*3]=tmp.r; cCol[i*3+1]=tmp.g; cCol[i*3+2]=tmp.b; }
    cGeo.attributes.aCol.needsUpdate = true;
  });
  function cornerUpd(t){
    var hh = 120*Math.tan(camera.fov*Math.PI/360)*1.05, hw = hh*camera.aspect;
    for (var i=0;i<NC;i++){
      var sp = cSp[i], ph = cPh[i], r = cN[i*2]*hh, a = cN[i*2+1] + t*cW[i];
      cPos[i*3] = Math.cos(a)*r + hh*(.05*Math.sin(t*.55*sp + ph) + .02*Math.sin(t*1.3*sp + ph*2)); cPos[i*3+1] = Math.sin(a)*r + hh*(.05*Math.cos(t*.47*sp + ph*1.3) + .02*Math.cos(t*1.1*sp + ph)); cPos[i*3+2] = -120 + 4*Math.sin(t*.6*sp + ph);
    }
    cGeo.attributes.position.needsUpdate = true;
  }
  /* Lebendige Partikelwirbel entlang des Weges (verdichten sich an neun Stationen) */
  var gateZ = []; for (var q=0;q<11;q++) gateZ.push(-30 - q*31);
  var swirls = [];
  function swirl(N, size, alpha, gateFrac, sizeFn){
    var z0 = new Float32Array(N), r0 = new Float32Array(N), th = new Float32Array(N), w = new Float32Array(N), ph = new Float32Array(N), kk = new Float32Array(N), bb = new Float32Array(N);
    var pos = new Float32Array(N*3), col = new Float32Array(N*3);
    for (var i=0;i<N;i++){
      if (Math.random() < .1){ z0[i] = -358 + gauss()*3; r0[i] = 14 + Math.random()*46; }
      else if (Math.random() < gateFrac){ z0[i] = gateZ[(Math.random()*gateZ.length)|0] + gauss()*2.4; r0[i] = 17 + gauss()*4.5; }
      else { z0[i] = 30 - Math.random()*400; r0[i] = 3 + Math.random()*41; }
      th[i] = Math.random()*6.2832; w[i] = (Math.random()<.5 ? -1 : 1)*(.25 + Math.random()*.7); ph[i] = Math.random()*6.2832; kk[i] = Math.random(); bb[i] = .5 + Math.random()*.5;
    }
    var geo = pgeo(pos, col, N, sizeFn);
    var pts = new THREE.Points(geo, PM({size:size, alpha:alpha, rise:false})); pts.frustumCulled = false; scene.add(pts);
    painters.push(function(){
      for (var i=0;i<N;i++){
        var k = kk[i]; if (k > .93) tmp.setRGB(1,.92,.85); else if (k < .1) tmp.setRGB(.8,.88,1); else tmp.copy(cA).lerp(cB, k/.93*.8);
        tmp.multiplyScalar(bb[i]); col[i*3]=tmp.r; col[i*3+1]=tmp.g; col[i*3+2]=tmp.b;
      }
      geo.attributes.aCol.needsUpdate = true;
    });
    swirls.push(function(t){
      for (var i=0;i<N;i++){
        var a = th[i] + w[i]*t, rr = r0[i] + .9*Math.sin(t*1.6 + ph[i]) + 1.2*Math.sin(t*2.4 - z0[i]*.12);
        pos[i*3] = Math.cos(a)*rr; pos[i*3+1] = Math.sin(a)*rr*.85; pos[i*3+2] = z0[i] + 1.3*Math.sin(t*2.1 + ph[i]*2);
      }
      geo.attributes.position.needsUpdate = true;
    });
  }
  swirl(coarse ? 20000 : 60000, .36, 1, .75);
  swirl(coarse ? 500 : 1200, 1.1, .6, .6, function(){ return .7 + Math.random()*.6; });

  function setPal(i){ cA.set(PAL[i].a); cB.set(PAL[i].b); painters.forEach(function(fn){ fn(); }); }
  setPal(0);
  var BH_VS = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
  var BH_FS = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uIncl;   // Blickwinkel über der Scheibe (Radiant)
  uniform float uYaw;    // leichte seitliche Drehung (Parallaxe)

  const float R_IN = 3.0;    // innerste stabile Umlaufbahn (3 Schwarzschild-Radien)
  const float R_OUT = 11.0;  // Außenrand der Scheibe
  const float CAM_DIST = 26.0;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return v;
  }

  // Scheibenstruktur an Radius r und (mitgedrehtem) Winkel a:
  // x = großflächige Gas-Wolken, y = feine, entlang der Umlaufbahn
  // gestreckte Filamente. Über cos/sin nahtlos (keine Kante bei ±π).
  vec2 diskTex(float r, float a, float seed) {
    vec2 q = vec2(cos(a), sin(a));
    float clumps = fbm(q * 3.2 + vec2(r * 1.1 + seed, -r * 0.5));
    float fil = fbm(vec2(r * 8.0 + seed, 0.0) + q * 4.5);
    return vec2(clumps, fil);
  }

  // Farbe + Deckkraft der Scheibe an einem Treffpunkt
  vec4 diskSample(vec3 hit, vec3 rayDir) {
    float r = length(hit.xz);
    if (r < R_IN || r > R_OUT) return vec4(0.0);
    float t = (r - R_IN) / (R_OUT - R_IN);

    // Kepler-Rotation: innen schneller als außen (deutlich sichtbar).
    // Damit sich die Struktur durch die ungleiche Drehung nicht über die
    // Zeit zu feinen Ringen "aufwickelt", laufen zwei Muster-Schichten mit
    // versetzter Zeit und werden weich überblendet (Flow-Map-Technik).
    float ang = atan(hit.z, hit.x);
    float omega = 2.0 / pow(r, 1.5); // innen ~1 Umdrehung / 8 s
    const float PERIOD = 16.0;
    float ph0 = fract(uTime / PERIOD);
    float ph1 = fract(uTime / PERIOD + 0.5);
    float w0 = 1.0 - abs(2.0 * ph0 - 1.0);
    float w1 = 1.0 - w0;
    vec2 layer0 = diskTex(r, ang + omega * ph0 * PERIOD, 0.0);
    vec2 layer1 = diskTex(r, ang + omega * ph1 * PERIOD, 17.3);
    vec2 tex = layer0 * w0 + layer1 * w1;
    float n = tex.x;
    float streaks = 0.55 + 0.45 * tex.y;

    // Temperaturverlauf: innen hell-rosé, dann Akzentrot (#ff5a4d), außen tiefrot
    vec3 hot = vec3(1.0, 0.8, 0.7);
    vec3 warm = vec3(1.0, 0.36, 0.26);
    vec3 cool = vec3(0.55, 0.06, 0.05);
    vec3 col = mix(hot, warm, smoothstep(0.0, 0.35, t));
    col = mix(col, cool, smoothstep(0.35, 1.0, t));
    float intensity = (3.2 * pow(1.0 - t, 1.8) + 0.2) * (0.55 + 0.8 * n) * streaks;

    // Doppler-Aufhellung der auf uns zukommenden Seite (mild)
    vec3 orbitDir = normalize(vec3(-sin(ang), 0.0, cos(ang)));
    float beta = sqrt(0.5 / r) * 0.75;
    float g = 1.0 / (1.0 + beta * dot(orbitDir, rayDir));
    intensity *= pow(g, 2.2);

    float edge = smoothstep(R_IN, R_IN + 0.5, r) * (1.0 - smoothstep(R_OUT - 3.5, R_OUT, r));
    // Dichtes Gas ist undurchsichtig: innen voll deckend, erst der äußere
    // Rand wird dünner und franst wolkig aus
    float thin = smoothstep(0.55, 1.0, t);
    float alpha = clamp(edge * mix(1.0, 0.35 + 0.65 * n, thin), 0.0, 1.0);
    return vec4(col * intensity, alpha);
  }

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;

    // virtuelle Kamera, leicht über der Scheibenebene
    vec3 camPos = vec3(sin(uYaw) * cos(uIncl), sin(uIncl), -cos(uYaw) * cos(uIncl)) * CAM_DIST;
    vec3 fwd = normalize(-camPos);
    vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), fwd));
    vec3 up = cross(fwd, right);
    vec3 dir = normalize(fwd + (p.x * right + p.y * up) * 0.56);

    vec3 pos = camPos;
    vec3 vel = dir;
    float h2 = dot(cross(pos, vel), cross(pos, vel));

    vec3 color = vec3(0.0);
    float alpha = 0.0;
    float minR = 1e9;
    bool captured = false;

    for (int i = 0; i < 140; i++) {
      float r2 = dot(pos, pos);
      float r = sqrt(r2);
      minR = min(minR, r);
      if (r < 1.0) { captured = true; break; }
      if (r > CAM_DIST + 6.0 && dot(pos, vel) > 0.0) break;

      // Schrittweite: nah am Loch fein, weit weg grob
      float dt = clamp(0.06 * r, 0.03, 1.2);
      vec3 acc = -1.5 * h2 * pos / (r2 * r2 * r);
      vec3 nextVel = vel + acc * dt;
      vec3 nextPos = pos + nextVel * dt;

      // Durchgang durch die Scheibenebene (y = 0)?
      if (pos.y * nextPos.y < 0.0) {
        float k = pos.y / (pos.y - nextPos.y);
        vec3 hit = mix(pos, nextPos, k);
        vec4 d = diskSample(hit, normalize(nextVel));
        color += (1.0 - alpha) * d.rgb * d.a;
        alpha += (1.0 - alpha) * d.a;
        if (alpha > 0.98) break;
      }
      pos = nextPos;
      vel = nextVel;
    }

    // Photonenring / Glühen am Rand des Schattens
    // (nur für Strahlen, die knapp am Loch vorbeigehen — der Schatten selbst bleibt schwarz)
    float glow = captured ? 0.0 : exp(-max(minR - 1.5, 0.0) * 3.0) * 0.9;
    color += (1.0 - alpha) * vec3(1.0, 0.58, 0.48) * glow;
    // schwacher roter Lichthof um das ganze Loch (wie Streulicht der Scheibe)
    float halo = captured ? 0.0 : exp(-max(minR - 2.0, 0.0) * 0.45) * 0.12;
    color += (1.0 - alpha) * vec3(1.0, 0.3, 0.22) * halo;
    glow += halo;
    float outAlpha = alpha + (1.0 - alpha) * clamp(glow, 0.0, 1.0);
    if (captured) outAlpha = 1.0; // Schatten: deckend schwarz

    // weicher Rand der Fläche, damit kein Quadrat sichtbar ist
    float fade = 1.0 - smoothstep(0.78, 1.0, max(abs(p.x), abs(p.y)));
    color *= fade;
    outAlpha *= fade;

    // filmische Tonwertkurve
    color = vec3(1.0) - exp(-color * 1.25);
    gl_FragColor = vec4(color, outAlpha); // vormultipliert
  }
`;
  var bhMat = new THREE.ShaderMaterial({vertexShader:BH_VS, fragmentShader:BH_FS, uniforms:{uTime:{value:0}, uIncl:{value:.12}, uYaw:{value:0}}, transparent:true, premultipliedAlpha:true, depthWrite:false, depthTest:false});
  var bhMesh = new THREE.Mesh(new THREE.PlaneGeometry(1,1), bhMat); bhMesh.renderOrder = 10; bhMesh.frustumCulled = false; bhMesh.position.set(0,0,-362);
  scene.add(camera); scene.add(bhMesh); 
  function bhUpd(t){ starUpd(); cornerUpd(t); sky.position.copy(camera.position); sky.quaternion.copy(camera.quaternion); bhMesh.quaternion.copy(camera.quaternion); bhMesh.scale.setScalar(46 + 50*Math.pow(Math.min(1,Math.max(0,ps)),1.2)); bhMat.uniforms.uTime.value = t*2.2; bhMat.uniforms.uIncl.value = .12 + ptr.y*.1; bhMat.uniforms.uYaw.value = ptr.x*.2; }
  var ps = 0, last = performance.now(), time = 0, raf = 0, alive = true;
  function loop(now){
    if (!alive) return;
    var dt = Math.min(.05, (now - last)/1000); last = now; if (reduce) dt *= .3; time += dt;
    var y = window.scrollY || document.documentElement.scrollTop || 0, max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    var p = Math.min(1, Math.max(0, y/max));
    var d = Math.min(p, .89) - ps; ps += d*Math.min(1, dt*4);
    ptr.x += (ptr.tx - ptr.x)*Math.min(1, dt*3); ptr.y += (ptr.ty - ptr.y)*Math.min(1, dt*3);
    var cz = -Math.pow(Math.max(0,ps),1.35)*L, w = ps*6.2832;
    var wb = Math.pow(1 - Math.min(1, ps), 1.5); camera.position.set((Math.sin(w*1.5)*2.4 + ptr.x*2.2)*wb, (Math.cos(w*1.2)*1.3 + ptr.y*1.4)*wb, cz);
    camera.lookAt(camera.position.x*.35, camera.position.y*.35, cz - 30);
    camera.rotation.z += Math.sin(w*1.5)*.04 + ps*.75 + Math.pow(Math.max(0,ps),3)*.5;
    var kick = Math.min(1, Math.abs(d)*55), fov = 58 + kick*22;
    if (Math.abs(camera.fov - fov) > .05){ camera.fov += (fov - camera.fov)*Math.min(1, dt*8); camera.updateProjectionMatrix(); }
    bhUpd(time);
    for (var s2=0;s2<swirls.length;s2++) swirls[s2](time*.42);
    var sc = renderer.domElement.height*.5;
    for (var m=0;m<pmats.length;m++){ pmats[m].uniforms.uThin.value = Math.max(Math.min(1,Math.max(0,(ps-.7)/.2)), .4*Math.min(1,Math.max(0,ps/.7))); pmats[m].uniforms.uRise.value = ps*260; pmats[m].uniforms.uTime.value = time; pmats[m].uniforms.uScale.value = sc; }
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);
  return function(){
    alive = false; cancelAnimationFrame(raf);
    removeEventListener('resize', resize); removeEventListener('pointermove', onMove);
    scene.traverse(function(o){ if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
    renderer.dispose();
  };

}

/**
 * TunnelBackground: Reise durch einen rotierenden Partikel-Tunnel bis zum
 * Schwarzen Loch der Seite. Der Scroll-Fortschritt steuert die Kamera.
 */
export default function TunnelBackground() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    return initTunnel(ref.current);
  }, []);
  return <canvas ref={ref} aria-hidden="true" className="block h-full w-full" />;
}
