/* eslint-disable */
// @ts-nocheck
"use client";

// Eingangs-Animation der Geschichte-Seite: Legionär -> Partikel -> Weltkarte -> Titel (in der Sprache des Besuchers).
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useLanguage } from "@/contexts/LanguageContext";

function initIntro(cv: HTMLCanvasElement, LAND: number[][], lang0: string, onDone: () => void, title0: string): () => void {
  var coarse = matchMedia('(pointer: coarse)').matches;
  var renderer;
  try { renderer = new THREE.WebGLRenderer({canvas:cv, antialias:false}); } catch (e) { onDone(); return function(){}; }
  renderer.setClearColor(0x030206, 1);
  var scene = new THREE.Scene(), cam = new THREE.Camera(), N = coarse ? 6000 : 12000, W = 1, H = 1;

  function drawHelmet(){
    var c = document.createElement('canvas'); c.width = 600; c.height = 800; var x = c.getContext('2d'); x.lineJoin = 'round'; x.lineCap = 'round';
    function lg(x0,y0,x1,y1,s){ var g = x.createLinearGradient(x0,y0,x1,y1); for (var i=0;i<s.length;i+=2) g.addColorStop(s[i], s[i+1]); return g; }
    /* Pilum */
    x.strokeStyle = '#a06a30'; x.lineWidth = 7; x.beginPath(); x.moveTo(486,170); x.lineTo(486,775); x.stroke();
    x.strokeStyle = '#c9ced4'; x.lineWidth = 3.5; x.beginPath(); x.moveTo(486,170); x.lineTo(486,70); x.stroke();
    x.fillStyle = '#e6eaee'; x.beginPath(); x.moveTo(486,28); x.lineTo(480,74); x.lineTo(492,74); x.closePath(); x.fill();
    /* Beine */
    x.fillStyle = lg(0,520,0,730,[0,'#e3ae88',1,'#a56f4a']); x.fillRect(318,505,44,225); x.fillRect(372,505,44,225);
    x.fillStyle = lg(0,610,0,710,[0,'#f2cf72',1,'#8a5f14']); x.fillRect(316,612,48,92); x.fillRect(370,612,48,92);
    x.fillStyle = '#a8732f'; x.beginPath(); x.moveTo(306,728); x.lineTo(366,728); x.lineTo(366,766); x.lineTo(290,766); x.lineTo(296,742); x.closePath(); x.fill();
    x.beginPath(); x.moveTo(368,728); x.lineTo(428,728); x.lineTo(450,762); x.lineTo(368,766); x.closePath(); x.fill();
    x.strokeStyle = '#f0d09a'; x.lineWidth = 3; for (var s=0;s<3;s++){ x.beginPath(); x.moveTo(312+s*16,730); x.lineTo(306+s*16,764); x.stroke(); x.beginPath(); x.moveTo(376+s*16,730); x.lineTo(382+s*16,764); x.stroke(); }
    /* Lederstreifen-Rock (rot) */
    x.fillStyle = lg(0,440,0,525,[0,'#e8362f',1,'#8e0f14']); x.beginPath(); x.moveTo(308,436); x.lineTo(424,436); x.lineTo(436,524); x.lineTo(296,524); x.closePath(); x.fill();
    x.strokeStyle = '#ffc9a8'; x.lineWidth = 2; for (var k=0;k<8;k++){ x.beginPath(); x.moveTo(318+k*15,440); x.lineTo(310+k*17,522); x.stroke(); }
    x.fillStyle = '#f2cf72'; for (var k2=0;k2<8;k2++){ x.beginPath(); x.arc(318+k2*15 - k2*.5,452,3.4,0,6.2832); x.fill(); }
    /* Rechter Arm mit Pilum */
    x.strokeStyle = lg(0,0,1,1,[0,'#e3ae88',1,'#a56f4a']); x.strokeStyle = '#d29a74'; x.lineWidth = 30; x.beginPath(); x.moveTo(420,258); x.quadraticCurveTo(472,262,486,336); x.stroke();
    x.fillStyle = '#dca37d'; x.beginPath(); x.arc(486,338,17,0,6.2832); x.fill();
    /* Brustpanzer (Segmentata) */
    for (var b=0;b<9;b++){
      var y0 = 232 + b*24, wd = 112 - Math.abs(b-3)*1.5;
      x.fillStyle = lg(0,y0,0,y0+24,[0,'#e9eef3',.55,'#aab3bd',1,'#5d6670']);
      x.beginPath(); x.moveTo(360-wd/2, y0 + 3); x.quadraticCurveTo(360, y0 - 7, 360+wd/2, y0 + 3); x.lineTo(360+wd/2 + 3, y0 + 26); x.quadraticCurveTo(360, y0 + 18, 360-wd/2 - 3, y0 + 26); x.closePath(); x.fill();
      x.strokeStyle = 'rgba(255,255,255,.75)'; x.lineWidth = 2; x.beginPath(); x.moveTo(360-wd/2 + 4, y0 + 6); x.quadraticCurveTo(360, y0 - 3, 360+wd/2 - 4, y0 + 6); x.stroke();
    }
    x.fillStyle = '#f2cf72'; for (var r=0;r<9;r++){ x.beginPath(); x.arc(360,248 + r*24,3,0,6.2832); x.fill(); }
    /* Schulterstuecke */
    [[-1,0],[1,0]].forEach(function(sg){ for (var q=0;q<3;q++){ x.fillStyle = lg(0,206+q*13,0,226+q*13,[0,'#f0f4f8',1,'#7b848e']); x.beginPath(); x.ellipse(360 + sg[0]*(66 - q*4), 222 + q*14, 30 - q*2, 11, sg[0]*.35, Math.PI, 2*Math.PI); x.closePath(); x.fill(); } });
    /* Hals + rotes Halstuch */
    x.fillStyle = '#d6a07a'; x.fillRect(342,190,36,34);
    x.fillStyle = lg(0,206,0,230,[0,'#ff5a4a',1,'#a01218']); x.beginPath(); x.moveTo(334,214); x.quadraticCurveTo(360,236,386,214); x.lineTo(380,228); x.quadraticCurveTo(360,244,340,228); x.closePath(); x.fill();
    /* Kopf */
    var gh = x.createRadialGradient(350,150,6,360,165,40); gh.addColorStop(0,'#f3c6a2'); gh.addColorStop(1,'#a56f4a');
    x.fillStyle = gh; x.beginPath(); x.ellipse(360,166,29,37,0,0,6.2832); x.fill();
    x.fillStyle = '#5a2c18'; x.fillRect(344,164,10,3); x.fillRect(366,164,10,3);
    x.strokeStyle = '#ffd6b4'; x.lineWidth = 2; x.beginPath(); x.moveTo(360,166); x.lineTo(357,182); x.lineTo(363,183); x.stroke();
    x.strokeStyle = '#8a4a34'; x.lineWidth = 2.4; x.beginPath(); x.moveTo(351,194); x.quadraticCurveTo(360,198,369,194); x.stroke();
    /* Wangenklappen */
    var gc = lg(0,150,0,208,[0,'#f2cf72',1,'#8a5f14']);
    x.fillStyle = gc; x.beginPath(); x.moveTo(330,146); x.lineTo(340,146); x.lineTo(346,186); x.lineTo(340,206); x.lineTo(327,198); x.closePath(); x.fill();
    x.beginPath(); x.moveTo(390,146); x.lineTo(380,146); x.lineTo(374,186); x.lineTo(380,206); x.lineTo(393,198); x.closePath(); x.fill();
    /* Helm: Kalotte, Stirnband, Nackenschutz */
    var gd = x.createRadialGradient(345,108,6,360,128,56); gd.addColorStop(0,'#fff6c8'); gd.addColorStop(.45,'#e6b84e'); gd.addColorStop(1,'#7a520f');
    x.fillStyle = gd; x.beginPath(); x.moveTo(326,152); x.bezierCurveTo(322,100,340,84,360,84); x.bezierCurveTo(380,84,398,100,394,152); x.closePath(); x.fill();
    x.fillStyle = lg(0,140,0,152,[0,'#fff0b8',1,'#b8862e']); x.fillRect(325,141,70,12);
    x.strokeStyle = '#fffbe8'; x.lineWidth = 2; x.beginPath(); x.moveTo(340,100); x.quadraticCurveTo(345,90,358,88); x.stroke();
    x.fillStyle = '#c9962f'; x.beginPath(); x.moveTo(396,150); x.lineTo(404,170); x.lineTo(392,176); x.closePath(); x.fill();
    x.fillStyle = '#f2cf72'; x.fillRect(348,76,24,10);
    /* Haarbusch */
    for (var i=0;i<70;i++){ var f = i/69, a = Math.PI*(1.04 + f*.92), bell = Math.sin(f*Math.PI), len = 14 + bell*30 + (Math.random()-.5)*5;
      x.strokeStyle = 'rgb(' + (170 + bell*70|0) + ',' + (22 + bell*34|0) + ',' + (24 + bell*20|0) + ')'; x.lineWidth = 3;
      x.beginPath(); x.moveTo(360 + Math.cos(a)*30, 108 + Math.sin(a)*24); x.lineTo(360 + Math.cos(a)*(34 + len)*1.15, 108 + Math.sin(a)*(26 + len)); x.stroke(); }
    /* Scutum */
    var gs = lg(150,0,330,0,[0,'#ff4a3c',.5,'#c9201e',1,'#7a0c12']);
    x.fillStyle = gs; x.beginPath(); x.moveTo(146,298); x.bezierCurveTo(200,284,276,284,330,298); x.lineTo(336,640); x.bezierCurveTo(280,658,196,658,140,640); x.closePath(); x.fill();
    x.strokeStyle = '#f2cf72'; x.lineWidth = 8; x.stroke();
    x.lineWidth = 5; x.beginPath(); x.moveTo(238,290); x.lineTo(238,656); x.stroke();
    x.fillStyle = '#f2cf72'; x.beginPath(); x.arc(238,470,26,0,6.2832); x.fill(); x.fillStyle = '#a8741f'; x.beginPath(); x.arc(238,470,13,0,6.2832); x.fill();
    x.strokeStyle = '#ffe08a'; x.lineWidth = 4;
    [-1,1].forEach(function(sg){ for (var w=0;w<4;w++){ x.beginPath(); x.moveTo(238 + sg*30, 470 - 4 + w*5); x.quadraticCurveTo(238 + sg*(58 + w*8), 452 - w*14, 238 + sg*(84 + w*6), 430 - w*22); x.stroke(); } });
    x.beginPath(); x.moveTo(238,404); x.lineTo(222,380); x.lineTo(240,382); x.lineTo(226,350); x.stroke();
    /* Licht und Schatten */
    x.globalCompositeOperation = 'source-atop';
    var gl = x.createLinearGradient(130,80,520,780); gl.addColorStop(0,'rgba(255,255,255,.22)'); gl.addColorStop(.55,'rgba(0,0,0,0)'); gl.addColorStop(1,'rgba(0,0,0,.45)');
    x.fillStyle = gl; x.fillRect(0,0,600,800); x.globalCompositeOperation = 'source-over';
    return c;
  }
  function ne(lon, lat){
    var l = lon*Math.PI/180, p = lat*Math.PI/180, p2 = p*p, p4 = p2*p2, p6 = p4*p2, p8 = p4*p4, p10 = p8*p2, p12 = p6*p6;
    return [l*(0.8707 - 0.131979*p2 - 0.013791*p4 + 0.003971*p10 - 0.001529*p12), p*(1.007226 + 0.015085*p2 - 0.044475*p6 + 0.028874*p8 - 0.005916*p10)];
  }
  function drawMap(){
    var w = 1800, h = 784, c = document.createElement('canvas'); c.width = w; c.height = h; var x = c.getContext('2d');
    x.fillStyle = '#fff'; x.beginPath();
    LAND.forEach(function(d){
      var px = 0, py = 0;
      for (var i=0; i+1<d.length; i+=2){
        px += d[i]; py += d[i+1];
        var q = ne(px/100, py/100), X = (q[0] + 2.735)/5.47*w, Y = (1.372 - q[1])/2.384*h;
        if (i === 0) x.moveTo(X,Y); else x.lineTo(X,Y);
      }
      x.closePath();
    });
    x.fill('evenodd'); return c;
  }
  function sample(c, n, edgeFrac){
    var w = c.width, h = c.height, d = c.getContext('2d').getImageData(0,0,w,h).data, fill = [], edge = [];
    for (var y=1; y<h-1; y++) for (var x=1; x<w-1; x++){
      var i = y*w + x; if (d[i*4+3] < 140) continue;
      if (d[(i-1)*4+3] < 80 || d[(i+1)*4+3] < 80 || d[(i-w)*4+3] < 80 || d[(i+w)*4+3] < 80) edge.push(i); else fill.push(i);
    }
    var X = new Float32Array(n), Y = new Float32Array(n), C = new Float32Array(n*3);
    for (var k=0; k<n; k++){
      var list = (Math.random() < edgeFrac && edge.length) ? edge : fill, i2 = list[(Math.random()*list.length)|0], px = i2 % w, py = (i2/w)|0;
      X[k] = (px + Math.random())/w; Y[k] = (py + Math.random())/h; C[k*3] = Math.min(1, d[i2*4]/255*.9 + .16); C[k*3+1] = Math.min(1, d[i2*4+1]/255*.9 + .16); C[k*3+2] = Math.min(1, d[i2*4+2]/255*.9 + .16);
    }
    return {X:X, Y:Y, C:C};
  }
  var hs = sample(drawHelmet(), N, .3), ms = sample(drawMap(), N, .35);

  var aS = new Float32Array(N*2), aH = new Float32Array(N*2), aM = new Float32Array(N*2), aD = new Float32Array(N*2), aR = new Float32Array(N*4), aCH = new Float32Array(N*3), aCM = new Float32Array(N*3), pos = new Float32Array(N*3);
  for (var i=0; i<N; i++){
    aS[i*2] = Math.random()*1.5 - .25; aS[i*2+1] = Math.random()*1.5 - .25;
    aH[i*2] = hs.X[i]; aH[i*2+1] = hs.Y[i]; aM[i*2] = ms.X[i]; aM[i*2+1] = ms.Y[i];
    var an = Math.random()*6.2832, di = 40 + Math.random()*200; aD[i*2] = Math.cos(an)*di; aD[i*2+1] = Math.sin(an)*di - 30;
    aR[i*4] = Math.random(); aR[i*4+1] = Math.random(); aR[i*4+2] = Math.random(); aR[i*4+3] = Math.random()*2 - 1;
    aCH[i*3] = hs.C[i*3]; aCH[i*3+1] = hs.C[i*3+1]; aCH[i*3+2] = hs.C[i*3+2];
    var m = Math.random(), br = .7 + Math.random()*.5; aCM[i*3] = br; aCM[i*3+1] = (.2 + m*.45)*br; aCM[i*3+2] = (.18 + m*.38)*br;
  }
  var geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
  geo.setAttribute('aS', new THREE.BufferAttribute(aS,2)); geo.setAttribute('aH', new THREE.BufferAttribute(aH,2)); geo.setAttribute('aM', new THREE.BufferAttribute(aM,2));
  geo.setAttribute('aD', new THREE.BufferAttribute(aD,2)); geo.setAttribute('aR', new THREE.BufferAttribute(aR,4));
  geo.setAttribute('aCH', new THREE.BufferAttribute(aCH,3)); geo.setAttribute('aCM', new THREE.BufferAttribute(aCM,3));
  var mat = new THREE.ShaderMaterial({
    transparent:true, depthTest:false, depthWrite:false, blending:THREE.AdditiveBlending,
    uniforms:{uT:{value:0}, uRes:{value:new THREE.Vector2(1,1)}, uHB:{value:new THREE.Vector4()}, uMB:{value:new THREE.Vector4()}, uPx:{value:1}, uOut:{value:0}},
    vertexShader:
      'attribute vec2 aS, aH, aM, aD; attribute vec4 aR; attribute vec3 aCH, aCM; uniform float uT, uPx, uOut; uniform vec2 uRes; uniform vec4 uHB, uMB; varying vec3 vC; varying float vA;' +
      'float sm(float x){ x = clamp(x,0.,1.); return x*x*(3.-2.*x); } float eo(float x){ x = clamp(x,0.,1.); return 1. - pow(1.-x,3.); }' +
      'void main(){ vec2 hp = uHB.xy + aH*uHB.zw; vec2 mp = uMB.xy + aM*uMB.zw; vec2 sp = aS*uRes; vec2 dp = hp + aD;' +
      'float e0 = eo((uT - aR.x*.5)/.75); float e1 = sm((uT - 1.7 - aR.y*.3)/.6); float e2 = sm((uT - 2.2 - aM.x*.5 - aR.z*.15)/1.1);' +
      'vec2 p = mix(sp, hp, e0); p = mix(p, dp, e1); vec2 dir = mp - p; vec2 perp = normalize(vec2(-dir.y, dir.x) + vec2(1e-4)); p = mix(p, mp, e2) + perp*sin(3.14159*e2)*aR.w*80.;' +
      'float tw = .78 + .22*sin(uT*3. + aR.x*40.); vC = mix(aCH, aCM, e2)*tw; vA = e0*(1.-sm(uOut)); gl_PointSize = (1.5 + aR.y*1.7)*uPx;' +
      'p += vec2(cos(aR.x*6.2832), sin(aR.x*6.2832))*(60. + aR.y*380.)*uOut*uOut; gl_Position = vec4(p.x/uRes.x*2. - 1., 1. - p.y/uRes.y*2., 0., 1.); }',
    fragmentShader:
      'varying vec3 vC; varying float vA; void main(){ vec2 q = gl_PointCoord - .5; float r = length(q)*2.; if (r > 1.) discard; float a = exp(-r*r*3.2)*vA; gl_FragColor = vec4(vC*a*1.15, a); }'
  });
  var pts = new THREE.Points(geo, mat); pts.frustumCulled = false; scene.add(pts);

  /* Titel unter der Karte: ebenfalls aus Partikeln, in der Sprache des Besuchers */
  var TITLE = title0;
  var NT = coarse ? 2200 : 4200, tAspect = 4, taT = new Float32Array(NT*2), taF = new Float32Array(NT*2), taR = new Float32Array(NT*4), tpos = new Float32Array(NT*3);
  for (var q=0; q<NT; q++){ var src = (Math.random()*N)|0; taF[q*2] = ms.X[src]; taF[q*2+1] = ms.Y[src]; taR[q*4] = Math.random(); taR[q*4+1] = Math.random(); taR[q*4+2] = Math.random(); taR[q*4+3] = Math.random()*2 - 1; }
  var tGeo = new THREE.BufferGeometry();
  tGeo.setAttribute('position', new THREE.BufferAttribute(tpos,3)); tGeo.setAttribute('aF', new THREE.BufferAttribute(taF,2)); tGeo.setAttribute('aT', new THREE.BufferAttribute(taT,2)); tGeo.setAttribute('aR', new THREE.BufferAttribute(taR,4));
  var tmat = new THREE.ShaderMaterial({
    transparent:true, depthTest:false, depthWrite:false, blending:THREE.AdditiveBlending,
    uniforms:{uT:{value:0}, uRes:{value:new THREE.Vector2(1,1)}, uTB:{value:new THREE.Vector4()}, uMB:{value:new THREE.Vector4()}, uPx:{value:1}, uOut:{value:0}},
    vertexShader:
      'attribute vec2 aF, aT; attribute vec4 aR; uniform float uT, uPx, uOut; uniform vec2 uRes; uniform vec4 uTB, uMB; varying float vA;' +
      'float sm(float x){ x = clamp(x,0.,1.); return x*x*(3.-2.*x); }' +
      'void main(){ vec2 mp = uMB.xy + aF*uMB.zw; vec2 tp = uTB.xy + aT*uTB.zw; float e3 = sm((uT - 2.3 - aR.x*.4)/.8); vec2 dir = tp - mp; vec2 perp = normalize(vec2(-dir.y, dir.x) + vec2(1e-4));' +
      'vec2 p = mix(mp, tp, e3) + perp*sin(3.14159*e3)*aR.w*40.; vA = sm((uT - 2.2)/.3)*(.75 + .25*sin(uT*3. + aR.y*40.))*(1.-sm(uOut)); gl_PointSize = (1.6 + aR.z*1.6)*uPx;' +
      'p += vec2(cos(aR.x*6.2832), sin(aR.x*6.2832))*(60. + aR.y*380.)*uOut*uOut; gl_Position = vec4(p.x/uRes.x*2. - 1., 1. - p.y/uRes.y*2., 0., 1.); }',
    fragmentShader:
      'varying float vA; void main(){ vec2 q = gl_PointCoord - .5; float r = length(q)*2.; if (r > 1.) discard; float a = exp(-r*r*3.2)*vA; gl_FragColor = vec4(vec3(1.,.82,.74)*a*1.1, a); }'
  });
  var tpts = new THREE.Points(tGeo, tmat); tpts.frustumCulled = false; scene.add(tpts);
  var curLang = lang0;
  var TF = '600 150px "Chakra Petch","Noto Sans","Segoe UI",sans-serif';
  function setTitle(code){
    var s = TITLE, c = document.createElement('canvas'), x = c.getContext('2d');
    x.font = TF; x.direction = code === 'ar' ? 'rtl' : 'ltr';
    var tw = Math.ceil(x.measureText(s).width) + 40; c.width = tw; c.height = 210;
    x.font = TF; x.direction = code === 'ar' ? 'rtl' : 'ltr'; x.textBaseline = 'middle'; x.textAlign = 'center'; x.fillStyle = '#fff'; x.fillText(s, tw/2, 108);
    var ts = sample(c, NT, .45);
    for (var q2=0; q2<NT; q2++){ taT[q2*2] = ts.X[q2]; taT[q2*2+1] = ts.Y[q2]; }
    tGeo.attributes.aT.needsUpdate = true; tAspect = tw/210; resize();
  }


  function resize(){
    var dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
    renderer.setPixelRatio(dpr); renderer.setSize(W, H, false);
    var bh2 = Math.min(H*.8, W*.92*4/3, 760), bw2 = bh2*.75, mw = Math.min(W*.94, 1300), mh = mw*784/1800; if (mh > H*.6){ mh = H*.6; mw = mh*1800/784; }
    var th = Math.min(H*.075, 60), twd = th*tAspect; if (twd > W*.9){ twd = W*.9; th = twd/tAspect; }
    var top = (H - (mh + 20 + th))/2, px = dpr * (coarse ? .9 : 1);
    mat.uniforms.uRes.value.set(W,H); mat.uniforms.uPx.value = px; mat.uniforms.uHB.value.set((W-bw2)/2, (H-bh2)/2, bw2, bh2); mat.uniforms.uMB.value.set((W-mw)/2, top, mw, mh);
    tmat.uniforms.uRes.value.set(W,H); tmat.uniforms.uPx.value = px; tmat.uniforms.uMB.value.set((W-mw)/2, top, mw, mh); tmat.uniforms.uTB.value.set((W-twd)/2, top + mh + 20, twd, th);
  }
  addEventListener('resize', resize); resize();
  var loadF = (document.fonts && document.fonts.load) ? document.fonts.load('600 150px "Chakra Petch"').catch(function(){}) : Promise.resolve();
  loadF.then(function(){ setTitle(curLang); }); setTitle(curLang);

  var t0 = performance.now(), alive = true, raf = 0, done = false;
  function loop(now){
    if (!alive) return;
    var t = (now - t0)/1000*1.7;
    mat.uniforms.uT.value = t; tmat.uniforms.uT.value = t; var o = Math.min(1, Math.max(0, (t - 5.0)/0.9)); mat.uniforms.uOut.value = o; tmat.uniforms.uOut.value = o; renderer.render(scene, cam);
    if (t > 5.1 && !done){ done = true; onDone(); }
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);
  return function(){
    alive = false; cancelAnimationFrame(raf); removeEventListener('resize', resize);
    geo.dispose(); tGeo.dispose(); mat.dispose(); tmat.dispose(); renderer.dispose();
  };

}

export default function ImperienIntro() {
  const { lang, t } = useLanguage();
  const langRef = useRef(lang);
  langRef.current = lang;
  const titleRef = useRef(t("empiresIntroTitle"));
  titleRef.current = t("empiresIntroTitle");
  const ref = useRef<HTMLCanvasElement>(null);
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  function finish() {
    setFade(true);
    setTimeout(() => setShow(false), 950);
  }

  useEffect(() => {
    // Nur beim ersten Besuch der Webseite (Nutzerwunsch 17.10.2026); mit
    // ?intro=1 in der Adresse lässt sie sich erneut ansehen.
    let seen = false;
    try { seen = localStorage.getItem("cn_intro_seen") === "1"; } catch { /* ignorieren */ }
    const force = /[?&]intro=1(&|$)/.test(location.search);
    if ((seen && !force) || matchMedia("(prefers-reduced-motion: reduce)").matches) { setShow(false); return; }
    try { localStorage.setItem("cn_intro_seen", "1"); } catch { /* ignorieren */ }
    let stop = () => {}, dead = false;
    fetch("/data/land-10m.json").then((r) => r.json()).then((land) => {
      if (dead || !ref.current) return;
      stop = initIntro(ref.current, land, langRef.current, finish, titleRef.current);
    }).catch(() => setShow(false));
    return () => { dead = true; stop(); };
  }, []);

  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-[100000] bg-[#030206]"
      style={{ opacity: fade ? 0 : 1, transition: "opacity .9s", pointerEvents: fade ? "none" : "auto" }}
      onClick={finish}
    >
      <canvas ref={ref} aria-hidden="true" className="block h-full w-full" />
    </div>
  );
}
