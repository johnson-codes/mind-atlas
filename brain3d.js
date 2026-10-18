/* Mind Atlas — procedural 3D brain (Three.js) */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";

// 2D diagram space (data.js) -> 3D: x = front(-)/back(+), y = up, z = left hemisphere (+)
const S = 280, CX = 420, CY = 260, STEP = 20;
const CORTEX = ["frontal", "prefrontal", "motor", "somato", "parietal", "temporal", "occipital", "broca", "wernicke"];
const MIDLINE = ["corpusCallosum", "cingulate", "thalamus", "hypothalamus", "pituitary", "pineal", "midbrain"];
const LATERAL_DEEP = ["amygdala", "hippocampus", "basalGanglia"];
const LATERAL_ONLY = ["motor", "somato", "broca", "wernicke"];
const OUTER = ["cerebellum", "pons", "medulla"];
const SECTION = ["cerebellum", "cingulate", "corpusCallosum", "thalamus", "pineal", "hypothalamus", "pituitary", "midbrain", "pons", "medulla"];
const DIRS = {
  home: [-0.55, 0.35, 1], cut: [0.08, 0.12, 1], xray: [0.3, 0.35, 1],
  frontal: [-0.8, 0.45, 0.6], prefrontal: [-1, 0.25, 0.35], motor: [-0.15, 0.85, 0.6], somato: [0.15, 0.85, 0.6],
  parietal: [0.5, 0.7, 0.6], temporal: [-0.15, -0.3, 1], occipital: [1, 0.25, 0.35], broca: [-0.45, -0.05, 1],
  wernicke: [0.35, -0.1, 1], cerebellum: [0.8, -0.5, 0.55], pons: [-0.2, -0.6, 1], medulla: [0.1, -0.5, 1]
};
const FLESH = "#f0b9a1", SULCUS = "#a3304a", ACCENT = "#d2445f", ACCENT_SOFT = "#f29aa9", STEM = "#e2ad98", CEREB = "#ebb6a1", WM = "#f4e6d4";
const TARGET = new THREE.Vector3(0.02, -0.2, 0);

const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const sv = (x, y) => [(x - CX) / S, (CY - y) / S];

/* ---------- Simplex noise (Gustavson) ---------- */
function makeNoise(seed) {
  let a = seed;
  const rand = () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); const t = p[i]; p[i] = p[j]; p[j] = t; }
  const perm = new Uint8Array(512), pm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) { perm[i] = p[i & 255]; pm[i] = (perm[i] % 12) * 3; }
  const G = [1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1];
  const F3 = 1 / 3, G3 = 1 / 6;
  return (x, y, z) => {
    const s = (x + y + z) * F3;
    const i = Math.floor(x + s), j = Math.floor(y + s), k = Math.floor(z + s);
    const t = (i + j + k) * G3;
    const x0 = x - i + t, y0 = y - j + t, z0 = z - k + t;
    let i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
      else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
    } else {
      if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
      else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
      else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
    }
    const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2 * G3, y2 = y0 - j2 + 2 * G3, z2 = z0 - k2 + 2 * G3;
    const x3 = x0 - 0.5, y3 = y0 - 0.5, z3 = z0 - 0.5;
    const ii = i & 255, jj = j & 255, kk = k & 255;
    let n = 0, q, g;
    q = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (q > 0) { g = pm[ii + perm[jj + perm[kk]]]; q *= q; n += q * q * (G[g] * x0 + G[g + 1] * y0 + G[g + 2] * z0); }
    q = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (q > 0) { g = pm[ii + i1 + perm[jj + j1 + perm[kk + k1]]]; q *= q; n += q * q * (G[g] * x1 + G[g + 1] * y1 + G[g + 2] * z1); }
    q = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (q > 0) { g = pm[ii + i2 + perm[jj + j2 + perm[kk + k2]]]; q *= q; n += q * q * (G[g] * x2 + G[g + 1] * y2 + G[g + 2] * z2); }
    q = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (q > 0) { g = pm[ii + 1 + perm[jj + 1 + perm[kk + 1]]]; q *= q; n += q * q * (G[g] * x3 + G[g + 1] * y3 + G[g + 2] * z3); }
    return 32 * n;
  };
}

/* ---------- 2D helpers: rasterize diagram shapes for lookups ---------- */
function raster(list, base) {
  const c = document.createElement("canvas"); c.width = 800; c.height = 640;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.fillStyle = `rgb(${base},0,0)`; ctx.fillRect(0, 0, 800, 640);
  for (const [d, v] of list) { ctx.fillStyle = `rgb(${v},0,0)`; ctx.fill(new Path2D(d)); }
  return ctx.getImageData(0, 0, 800, 640).data;
}
function makeLookup(data, fallback) {
  return (x, y) => {
    const xi = Math.round(x), yi = Math.round(y);
    for (let r = 0; r <= 4; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      if (r && Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
      const px = Math.min(799, Math.max(0, xi + dx)), py = Math.min(639, Math.max(0, yi + dy));
      const v = data[(py * 800 + px) * 4];
      if (v && v % STEP === 0) return v / STEP - 1;
    }
    return fallback;
  };
}
function cubic(p0, p1, p2, p3, n) {
  const out = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, m = 1 - t;
    out.push([0, 1].map(k => m * m * m * p0[k] + 3 * m * m * t * p1[k] + 3 * m * t * t * p2[k] + t * t * t * p3[k]));
  }
  return out;
}
function distPoly(x, y, pts) {
  let best = 1e9;
  for (let i = 0; i < pts.length - 1; i++) {
    const ax = pts[i][0], ay = pts[i][1], dx = pts[i + 1][0] - ax, dy = pts[i + 1][1] - ay;
    let t = ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy);
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    const ex = ax + t * dx - x, ey = ay + t * dy - y, d = ex * ex + ey * ey;
    if (d < best) best = d;
  }
  return Math.sqrt(best);
}
const CENTRAL = cubic([445, 62], [432, 150], [410, 225], [376, 338], 24);
const SYLVIAN = cubic([250, 376], [330, 346], [430, 322], [565, 310], 24);

function mergedSphere(ws, hs) {
  let g = new THREE.SphereGeometry(1, ws, hs);
  g.deleteAttribute("normal"); g.deleteAttribute("uv");
  return mergeVertices(g);
}
function flipWinding(g) {
  const ix = g.index.array;
  for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; }
}

/* ---------- Cerebral hemisphere ---------- */
function buildHemi(side, ws, hs, detailed, ctx) {
  const geo = mergedSphere(ws, hs);
  const pos = geo.attributes.position, n = pos.count;
  const reg = new Uint8Array(n), groove = new Float32Array(n), tt = new Float32Array(n), major = new Float32Array(n);
  const BROCA = CORTEX.indexOf("broca"), WERN = CORTEX.indexOf("wernicke");
  for (let i = 0; i < n; i++) {
    const ux = pos.getX(i), uy = -pos.getZ(i), uz = pos.getY(i);
    const m = Math.hypot(ux, uy);
    const R = ctx.radiusAt(Math.atan2(uy, ux));
    const x = ux * R, y = uy * R;
    const sinT = m > 1e-6 ? uy / m : 0;
    const hw = 0.64 * (1 - 0.22 * sstep(-0.15, -1.0, x)) * (1 - 0.25 * sstep(0.3, 1.05, x));
    const r0 = 0.1 + 0.34 * sstep(0.2, 0.75, -sinT) * (1 - sstep(0.45, 0.85, Math.abs(x)));
    const zl = uz >= 0 ? r0 + (1 - r0) * uz : r0 * (1 + uz);
    pos.setXYZ(i, x, y, side * (0.022 + hw * zl));
    tt[i] = uz;
    const sx = x * S + CX, sy = CY - y * S;
    let r = uz > -0.04 ? ctx.lat(sx, sy) : ctx.med(sx, sy);
    if (side < 0 && r === BROCA) r = CORTEX.indexOf("frontal");
    if (side < 0 && r === WERN) r = CORTEX.indexOf("temporal");
    reg[i] = r;
    if (detailed && uz > -0.1) {
      const dc = distPoly(sx, sy, CENTRAL), ds = distPoly(sx, sy, SYLVIAN);
      major[i] = Math.max(1 - sstep(1.5, 7, dc), 1 - sstep(2, 11, ds)) * sstep(-0.1, 0.2, uz);
    }
  }
  if (side < 0) flipWinding(geo);
  geo.computeVertexNormals();
  if (detailed) {
    const nr = geo.attributes.normal, nz = ctx.noise, off = side > 0 ? 0 : 31.7;
    for (let i = 0; i < n; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const qx = x * 3.7 + off, qy = y * 3.7, qz = z * 3.7;
      const wx = nz(qx * 0.55 + 3.1, qy * 0.55, qz * 0.55);
      const wy = nz(qx * 0.55, qy * 0.55 + 7.7, qz * 0.55);
      const wz = nz(qx * 0.55 - 4.2, qy * 0.55, qz * 0.55 + 1.9);
      const v = nz(qx + 0.75 * wx, qy + 0.75 * wy, qz + 0.75 * wz) + 0.12 * nz(qx * 1.8 + 9, qy * 1.8, qz * 1.8);
      let g = 1 - sstep(0.0, 0.34, Math.abs(v));
      if (tt[i] < -0.2) g *= 0.55;
      const depth = 0.034 * g + 0.06 * major[i];
      pos.setXYZ(i, x - nr.getX(i) * depth, y - nr.getY(i) * depth, z - nr.getZ(i) * depth);
      groove[i] = Math.min(1, Math.max(g, major[i]));
    }
    geo.computeVertexNormals();
    geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  }
  return { geo, reg, groove, t: tt };
}

/* ---------- Cerebellum with folia ---------- */
function buildCerebellum(nz) {
  const geo = mergedSphere(128, 96);
  const pos = geo.attributes.position, n = pos.count;
  const cx = 0.66, cy = -0.62, a = -0.12, ca = Math.cos(a), sa = Math.sin(a);
  for (let i = 0; i < n; i++) {
    const ux = pos.getX(i), uy = -pos.getZ(i), uz = pos.getY(i);
    let x = ux * 0.34, y = uy * (uy > 0 ? 0.17 : 0.22);
    const z = uz * 0.54, v = Math.exp(-((z / 0.13) ** 2));
    x -= 0.05 * v * sstep(0.1, 0.6, ux);
    x += 0.1 * v * sstep(0.1, 0.8, -ux);
    pos.setXYZ(i, cx + x * ca - y * sa, cy + x * sa + y * ca, z);
  }
  geo.computeVertexNormals();
  const nr = geo.attributes.normal, groove = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const r = (y + 0.62) + 0.55 * (x - 0.62) ** 2 + 0.35 * z * z + 0.012 * nz(x * 5, y * 5, z * 5);
    const g = sstep(0.4, 1, Math.sin(r * 105));
    pos.setXYZ(i, x - nr.getX(i) * 0.012 * g, y - nr.getY(i) * 0.012 * g, z - nr.getZ(i) * 0.012 * g);
    groove[i] = g * 0.8;
  }
  geo.computeVertexNormals();
  geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  return { geo, groove };
}

/* ---------- Tube swept along a curve (elliptical section, rounded ends) ---------- */
function sweep(pts, aFn, bFn, segs = 64, radial = 20) {
  const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)));
  const Z = new THREE.Vector3(0, 0, 1), pos = [], idx = [];
  for (let i = 0; i <= segs; i++) {
    const u = i / segs, P = curve.getPointAt(u), T = curve.getTangentAt(u);
    const N = new THREE.Vector3().crossVectors(T, Z);
    if (N.lengthSq() < 1e-6) N.set(1, 0, 0);
    N.normalize();
    const B = new THREE.Vector3().crossVectors(N, T).normalize();
    const e = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(2 * u - 1), 6)), 0.5);
    const a = aFn(u) * e, b = bFn(u) * e;
    for (let j = 0; j <= radial; j++) {
      const f = (j / radial) * Math.PI * 2, c = Math.cos(f), s = Math.sin(f);
      pos.push(P.x + N.x * a * c + B.x * b * s, P.y + N.y * a * c + B.y * b * s, P.z + N.z * a * c + B.z * b * s);
    }
  }
  for (let i = 0; i < segs; i++) for (let j = 0; j < radial; j++) {
    const a = i * (radial + 1) + j, b = a + radial + 1;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}
const ellipsoid = (rx, ry, rz) => { const g = new THREE.SphereGeometry(1, 40, 28); g.scale(rx, ry, rz); return g; };

/* ====================================================================== */
export function createBrain3D(container, opts) {
  const { regions, shapes, outline, onPick, onHover, onModeChange, onSpinChange } = opts;
  const st = { mode: "whole", sel: null, hover: null, colored: false, labels: false, spin: true };
  let dirty = true, anim = null, userMoved = false, onScreen = true;

  /* outline radius per angle + region rasters */
  const mask = raster([[outline, 255]], 0);
  const NA = 1440, RAW = new Float32Array(NA), RAD = new Float32Array(NA);
  for (let a = 0; a < NA; a++) {
    const th = (a / NA) * Math.PI * 2, dx = Math.cos(th), dy = -Math.sin(th);
    let r = 0;
    for (let s = 0; s < 520; s += 0.5) {
      const x = Math.round(CX + dx * s), y = Math.round(CY + dy * s);
      if (x < 0 || y < 0 || x >= 800 || y >= 640 || mask[(y * 800 + x) * 4] < 128) break;
      r = s;
    }
    RAW[a] = r / S;
  }
  for (let a = 0; a < NA; a++) { let s = 0; for (let k = -3; k <= 3; k++) s += RAW[(a + k + NA) % NA]; RAD[a] = s / 7; }
  const radiusAt = th => { let f = th / (Math.PI * 2); f = (f - Math.floor(f)) * NA; const i = Math.floor(f) % NA, fr = f - Math.floor(f); return RAD[i] * (1 - fr) + RAD[(i + 1) % NA] * fr; };
  const cortexList = v => shapes[v].filter(s => !s.deco && s.layer === "cortex").map(s => [s.d, (CORTEX.indexOf(s.id) + 1) * STEP]);
  const ctx = {
    radiusAt, noise: makeNoise(11),
    lat: makeLookup(raster(cortexList("lateral"), (CORTEX.indexOf("parietal") + 1) * STEP), CORTEX.indexOf("parietal")),
    med: makeLookup(raster(cortexList("medial"), (CORTEX.indexOf("frontal") + 1) * STEP), CORTEX.indexOf("frontal"))
  };

  /* renderer / scene */
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.localClippingEnabled = true;
  const canvas = renderer.domElement;
  canvas.className = "brain-canvas";
  container.appendChild(canvas);
  const labelLayer = document.createElement("div");
  labelLayer.className = "labels3d";
  container.appendChild(labelLayer);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60);
  scene.add(camera);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.add(new THREE.HemisphereLight(0xfff4ee, 0x6b4a46, 0.7));
  const key = new THREE.DirectionalLight(0xffffff, 1.7); key.position.set(-2, 3, 2); camera.add(key);
  const rim = new THREE.DirectionalLight(0xffd9d0, 0.8); rim.position.set(4, 2, -4); scene.add(rim);

  const controls = new OrbitControls(camera, canvas);
  controls.target.copy(TARGET);
  Object.assign(controls, { enableDamping: true, dampingFactor: 0.08, enablePan: false, minDistance: 2.0, maxDistance: 12, rotateSpeed: 0.8, zoomSpeed: 0.9, autoRotate: true, autoRotateSpeed: 1.0 });
  const homeDist = () => {
    const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    return Math.max(0.95 / t, 1.15 / (t * camera.aspect)) * 1.02;
  };
  const placeCamera = (dir, dist) => camera.position.copy(TARGET).addScaledVector(new THREE.Vector3(...dir).normalize(), dist);
  placeCamera(DIRS.home, homeDist());

  /* colors */
  const C = {};
  const col = hex => C[hex] || (C[hex] = new THREE.Color(hex));
  const WHITE = new THREE.Color(1, 1, 1);
  const natDeep = id => id === "corpusCallosum" ? col(WM) : ["pons", "medulla", "midbrain"].includes(id) ? col(STEM) : new THREE.Color(regions[id].color).lerp(col(FLESH), 0.4);
  function colorFor(id, natural) {
    const kids = (st.sel && regions[st.sel].children) || [];
    let c;
    if (id === st.sel) c = col(ACCENT).clone();
    else if (kids.includes(id)) c = col(ACCENT_SOFT).clone();
    else c = st.colored ? col(regions[id].color).clone() : natural.clone();
    if (id === st.hover && id !== st.sel) c.lerp(WHITE, 0.3);
    return c;
  }

  /* build meshes */
  const brain = new THREE.Group();
  scene.add(brain);
  const cutPlane = [new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)];
  const cortexMat = () => new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.58, metalness: 0, sheen: 0.5, sheenRoughness: 0.6, sheenColor: new THREE.Color("#ffd2c4"), clearcoat: 0.12, clearcoatRoughness: 0.5, envMapIntensity: 0.55 });
  const surfaces = [], deep = [];

  function makeHemi(side) {
    const vis = buildHemi(side, 320, 240, true, ctx);
    const mesh = new THREE.Mesh(vis.geo, cortexMat());
    const px = buildHemi(side, 100, 75, false, ctx);
    const proxy = new THREE.Mesh(px.geo, new THREE.MeshBasicMaterial());
    proxy.visible = false;
    const surf = { geo: vis.geo, reg: vis.reg, groove: vis.groove, ids: CORTEX, nat: col(FLESH) };
    proxy.userData.proxy = { ids: CORTEX, reg: px.reg };
    brain.add(mesh, proxy);
    surfaces.push(surf);
    return { mesh, proxy, vis, side };
  }
  const hemiL = makeHemi(1), hemiR = makeHemi(-1);

  function addDeep(id, geo, side, p = [0, 0, 0], rotZ = 0, mat) {
    const mesh = new THREE.Mesh(geo, mat || new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0, envMapIntensity: 0.6 }));
    mesh.position.set(...p);
    mesh.rotation.z = rotZ;
    const cap = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ side: THREE.BackSide, clippingPlanes: cutPlane }));
    cap.visible = false;
    cap.userData = { id, side, isCap: true };
    mesh.add(cap);
    mesh.userData = { id, side, cap, nat: natDeep(id) };
    brain.add(mesh);
    deep.push(mesh);
    return mesh;
  }
  const P = (x, y, z = 0) => [...sv(x, y), z];

  // midline structures
  addDeep("corpusCallosum", sweep([P(322, 270), P(312, 245), P(330, 212), P(380, 198), P(440, 196), P(500, 205), P(545, 225), P(562, 255)],
    u => 0.026 + 0.022 * sstep(0.75, 1, u) + 0.014 * (1 - sstep(0, 0.18, u)), () => 0.24, 96), 0);
  addDeep("cingulate", sweep([P(300, 262), P(300, 228), P(322, 196), P(380, 174), P(450, 168), P(520, 182), P(566, 212), P(586, 250), P(578, 282)], () => 0.034, () => 0.065, 96), 0);
  addDeep("hypothalamus", ellipsoid(0.07, 0.05, 0.06), 0, P(406, 316));
  addDeep("pituitary", ellipsoid(0.038, 0.034, 0.04), 0, P(390, 368));
  addDeep("pituitary", sweep([P(402, 330), P(396, 346), P(391, 360)], () => 0.013, () => 0.013, 12, 10), 0);
  addDeep("pineal", ellipsoid(0.036, 0.026, 0.026), 0, P(524, 290), -0.4);
  addDeep("midbrain", sweep([P(466, 292), P(474, 326), P(480, 356)], () => 0.1, () => 0.12, 24), 0);
  addDeep("pons", ellipsoid(0.14, 0.13, 0.15), 0, P(474, 388));
  addDeep("medulla", sweep([P(484, 405), P(490, 460), P(497, 520), P(502, 575)], u => 0.088 - 0.036 * u, u => 0.096 - 0.04 * u, 48), 0);
  const cb = buildCerebellum(ctx.noise);
  const cbMesh = addDeep("cerebellum", cb.geo, 0, [0, 0, 0], 0, new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.6, sheen: 0.4, sheenColor: new THREE.Color("#ffd2c4"), envMapIntensity: 0.55 }));
  cbMesh.userData.surface = true;
  surfaces.push({ geo: cb.geo, reg: null, groove: cb.groove, ids: ["cerebellum"], nat: col(CEREB) });

  // paired structures (left = +z, right = -z)
  for (const s of [1, -1]) {
    addDeep("thalamus", ellipsoid(0.14, 0.085, 0.09), s, P(458, 282, 0.075 * s), -0.15);
    addDeep("amygdala", ellipsoid(0.06, 0.05, 0.05), s, [-0.2, -0.36, 0.24 * s]);
    addDeep("hippocampus", sweep([[-0.15, -0.38, 0.24 * s], [0, -0.37, 0.25 * s], [0.15, -0.32, 0.24 * s], [0.3, -0.23, 0.21 * s], [0.4, -0.1, 0.17 * s], [0.43, 0, 0.13 * s]],
      u => 0.05 - 0.022 * u, u => 0.042 - 0.018 * u, 64), s);
    addDeep("basalGanglia", ellipsoid(0.17, 0.11, 0.06), s, [0, -0.02, 0.25 * s]);
    addDeep("basalGanglia", sweep([[-0.22, 0.07, 0.14 * s], [-0.06, 0.13, 0.15 * s], [0.12, 0.11, 0.17 * s], [0.26, 0, 0.2 * s], [0.33, -0.14, 0.22 * s]],
      u => 0.075 - 0.052 * u, u => 0.06 - 0.04 * u, 64), s);
  }
  brain.updateMatrixWorld(true);

  /* flat midline cross-sections shown on the cut surface (from the 2D inside view) */
  const sections = [];
  const svgLoader = new SVGLoader();
  const toWorld = new THREE.Matrix4().makeScale(1 / S, -1 / S, 1).multiply(new THREE.Matrix4().makeTranslation(-CX, -CY, 0));
  shapes.medial.filter(s => !s.deco && SECTION.includes(s.id)).forEach((s, k) => {
    const data = svgLoader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${s.d}"/></svg>`);
    const g = new THREE.ShapeGeometry(data.paths.flatMap(p => SVGLoader.createShapes(p)), 16);
    g.applyMatrix4(toWorld);
    g.translate(0, 0, 0.004 + k * 0.0008);
    const mesh = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, toneMapped: false }));
    mesh.userData = { id: s.id, nat: s.id === "cerebellum" ? col(CEREB) : s.id === "corpusCallosum" ? col(WM) : new THREE.Color(regions[s.id].color).lerp(col(FLESH), 0.25), lx: s.lx, ly: s.ly };
    mesh.visible = false;
    brain.add(mesh);
    sections.push(mesh);
  });

  /* label anchors — positioned like the labels of the 2D diagram */
  const anchors = {}, Z = new THREE.Vector3(0, 0, 1);
  const A = id => (anchors[id] = anchors[id] || {});
  {
    const { geo, reg, t } = hemiL.vis, pos = geo.attributes.position, nr = geo.attributes.normal;
    const nsum = CORTEX.map(() => new THREE.Vector3());
    for (let i = 0; i < reg.length; i++) if (t[i] > 0.35) nsum[reg[i]].x += nr.getX(i), nsum[reg[i]].y += nr.getY(i), nsum[reg[i]].z += nr.getZ(i);
    for (const sh of shapes.lateral) {
      if (sh.deco || sh.layer !== "cortex") continue;
      const [x, y] = sv(sh.lx, sh.ly);
      let best = 0, bd = 1e9;
      for (let i = 0; i < reg.length; i++) if (t[i] > 0.2) {
        const d = (pos.getX(i) - x) ** 2 + (pos.getY(i) - y) ** 2;
        if (d < bd) { bd = d; best = i; }
      }
      const n = nsum[CORTEX.indexOf(sh.id)].clone().normalize();
      A(sh.id).lat = { p: new THREE.Vector3(pos.getX(best), pos.getY(best), pos.getZ(best)).addScaledVector(n, 0.04), n };
    }
    for (const sh of shapes.medial) if (!sh.deco && sh.layer === "cortex") A(sh.id).med = { p: new THREE.Vector3(...sv(sh.lx, sh.ly), 0.01), n: Z };
  }
  for (const d of deep) {
    const { id, side } = d.userData;
    d.geometry.computeBoundingSphere();
    if (side >= 0 && !A(id).out) A(id).out = { p: d.geometry.boundingSphere.center.clone().applyMatrix4(d.matrixWorld) };
  }
  for (const sh of shapes.lateral) {
    if (sh.deco || !OUTER.includes(sh.id)) continue;
    const mesh = deep.find(d => d.userData.id === sh.id), pos = mesh.geometry.attributes.position, nr = mesh.geometry.attributes.normal;
    const [x, y] = sv(sh.lx, sh.ly), v = new THREE.Vector3();
    let best = -1, bd = 1e9;
    for (let i = 0; i < pos.count; i++) {
      if (nr.getZ(i) < 0.4) continue;
      v.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
      const d = (v.x - x) ** 2 + (v.y - y) ** 2;
      if (d < bd) { bd = d; best = i; }
    }
    if (best >= 0) A(sh.id).out = { p: new THREE.Vector3().fromBufferAttribute(pos, best).applyMatrix4(mesh.matrixWorld).add(new THREE.Vector3(0, 0, 0.03)), n: Z };
  }
  for (const m of sections) A(m.userData.id).cut = { p: new THREE.Vector3(...sv(m.userData.lx, m.userData.ly), 0.02), n: Z };
  const labelEls = {};
  for (const id of Object.keys(anchors)) {
    const el = document.createElement("div");
    el.className = "l3d";
    el.textContent = regions[id].short;
    el.style.display = "none";
    labelLayer.appendChild(el);
    labelEls[id] = el;
  }

  /* modes */
  const meshVisible = d => {
    const { id, side } = d.userData;
    if (st.mode === "whole") return OUTER.includes(id);
    if (st.mode === "cut") return OUTER.includes(id) && side <= 0;
    return true;
  };
  const setOpacity = (mat, o) => { mat.transparent = o < 1; mat.opacity = o; mat.depthWrite = o >= 1; mat.needsUpdate = true; };
  function applyMode() {
    const x = st.mode === "xray", cut = st.mode === "cut";
    hemiL.mesh.visible = !cut;
    setOpacity(hemiL.mesh.material, x ? 0.14 : 1);
    setOpacity(hemiR.mesh.material, x ? 0.14 : 1);
    for (const d of deep) {
      d.visible = meshVisible(d);
      d.material.clippingPlanes = cut ? cutPlane : null;
      d.material.needsUpdate = true;
      d.userData.cap.visible = cut && d.visible;
      if (d.userData.id === "cerebellum") setOpacity(d.material, x ? 0.3 : 1);
    }
    for (const m of sections) m.visible = cut;
    st.hover = null;
    paint();
  }
  function regionVisible(id) {
    if (CORTEX.includes(id)) return st.mode === "cut" ? !!anchors[id].med : true;
    if (st.mode === "whole") return OUTER.includes(id);
    if (st.mode === "cut") return SECTION.includes(id);
    return true;
  }

  /* painting */
  function paint() {
    const kids = (st.sel && regions[st.sel].children) || [];
    for (const s of surfaces) {
      const tbl = s.ids.map(id => {
        const b = colorFor(id, s.nat);
        const special = id === st.sel || kids.includes(id);
        return [b, !st.colored && !special ? col(SULCUS) : b.clone().multiplyScalar(0.5)];
      });
      const arr = s.geo.attributes.color.array, g = s.groove, reg = s.reg;
      for (let i = 0, n = g.length; i < n; i++) {
        const t = tbl[reg ? reg[i] : 0], b = t[0], d = t[1], k = g[i] * 0.72;
        arr[i * 3] = b.r + (d.r - b.r) * k;
        arr[i * 3 + 1] = b.g + (d.g - b.g) * k;
        arr[i * 3 + 2] = b.b + (d.b - b.b) * k;
      }
      s.geo.attributes.color.needsUpdate = true;
    }
    for (const d of deep) {
      const c = colorFor(d.userData.id, d.userData.nat);
      if (!d.userData.surface) d.material.color.copy(c);
      d.userData.cap.material.color.copy(c).multiplyScalar(0.8);
    }
    for (const m of sections) m.material.color.copy(colorFor(m.userData.id, m.userData.nat));
    dirty = true;
  }

  /* picking */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  function pick(cx, cy) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const ok = h => st.mode !== "cut" || h.point.z <= 0.004;
    const idOf = h => { const p = h.object.userData.proxy; return p ? p.ids[p.reg[h.face.a]] : h.object.userData.id; };
    const vis = deep.filter(d => d.visible);
    if (st.mode === "xray") {
      const hd = ray.intersectObjects(vis.filter(d => d.userData.id !== "cerebellum"), false).find(ok);
      if (hd) return idOf(hd);
      const hc = ray.intersectObjects([hemiL.proxy, hemiR.proxy, cbMesh], false).find(ok);
      return hc ? idOf(hc) : null;
    }
    const list = st.mode === "cut" ? [hemiR.proxy, ...sections, ...vis, ...vis.map(d => d.userData.cap)] : [hemiL.proxy, hemiR.proxy, ...vis];
    const h = ray.intersectObjects(list, false).find(ok);
    return h ? idOf(h) : null;
  }
  let hoverEvt = null, down = null;
  function setHover(id, e) {
    if (id !== st.hover) { st.hover = id; paint(); canvas.style.cursor = id ? "pointer" : ""; }
    onHover(id, e && e.clientX, e && e.clientY);
  }
  canvas.addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse" || e.buttons) { if (st.hover) setHover(null); return; }
    hoverEvt = e;
  });
  canvas.addEventListener("pointerleave", () => { hoverEvt = null; setHover(null); });
  canvas.addEventListener("pointerdown", e => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; });
  canvas.addEventListener("pointerup", e => {
    if (!down) return;
    const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y), dt = performance.now() - down.t;
    down = null;
    if (moved < 6 && dt < 600) { const id = pick(e.clientX, e.clientY); if (id) onPick(id); }
  });
  controls.addEventListener("start", () => {
    userMoved = true;
    anim = null;
    if (st.spin) { setSpin(false); onSpinChange(false); }
  });
  controls.addEventListener("change", () => (dirty = true));

  /* camera flights */
  function flyTo(dir, dist) {
    const from = camera.position.clone().sub(TARGET);
    const d0 = from.length();
    from.normalize();
    const to = new THREE.Vector3(...dir).normalize();
    anim = { from, q: new THREE.Quaternion().setFromUnitVectors(from, to), d0, d1: dist || homeDist(), t0: performance.now(), dur: 900 };
    userMoved = true;
    if (st.spin) { setSpin(false); onSpinChange(false); }
  }
  function setSpin(b) { st.spin = b; controls.autoRotate = b; dirty = true; }

  /* labels */
  const tmp = new THREE.Vector3(), toCam = new THREE.Vector3(), occ = new THREE.Raycaster();
  function anchorFor(id) {
    const A = anchors[id];
    if (!regionVisible(id)) return null;
    if (CORTEX.includes(id)) return st.mode === "cut" ? A.med : A.lat;
    return st.mode === "cut" ? A.cut : A.out;
  }
  function updateLabels() {
    const w = container.clientWidth, h = container.clientHeight;
    for (const id in labelEls) {
      const el = labelEls[id];
      const a = (st.labels || id === st.sel) && anchorFor(id);
      let show = !!a;
      if (show && a.n && st.mode !== "xray") show = toCam.copy(camera.position).sub(a.p).dot(a.n) > 0;
      if (show && st.mode === "whole" && OUTER.includes(id)) {
        toCam.copy(a.p).sub(camera.position);
        const dist = toCam.length();
        occ.set(camera.position, toCam.normalize());
        occ.far = dist - 0.05;
        show = occ.intersectObjects([hemiL.proxy, hemiR.proxy], false).length === 0;
      }
      if (show) { tmp.copy(a.p).project(camera); show = tmp.z < 1; }
      if (!show) { el.style.display = "none"; continue; }
      el.style.display = "";
      el.style.transform = `translate(${(tmp.x * 0.5 + 0.5) * w}px, ${(-tmp.y * 0.5 + 0.5) * h}px) translate(-50%, -50%)`;
      el.classList.toggle("sel", id === st.sel);
    }
  }

  /* sizing + loop */
  function resize() {
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (!userMoved) placeCamera(DIRS.home, homeDist());
    dirty = true;
  }
  new ResizeObserver(resize).observe(container);
  new IntersectionObserver(es => { onScreen = es[0].isIntersecting; dirty = true; }).observe(container);
  resize();

  function loop(now) {
    requestAnimationFrame(loop);
    if (!onScreen) return;
    if (anim) {
      const k = Math.min(1, (now - anim.t0) / anim.dur), e = 1 - Math.pow(1 - k, 3);
      const dir = anim.from.clone().applyQuaternion(new THREE.Quaternion().slerp(anim.q, e));
      camera.position.copy(TARGET).addScaledVector(dir, anim.d0 + (anim.d1 - anim.d0) * e);
      if (k >= 1) anim = null;
      dirty = true;
    }
    if (controls.update()) dirty = true;
    if (hoverEvt) { const e = hoverEvt; hoverEvt = null; setHover(pick(e.clientX, e.clientY), e); }
    if (dirty) { renderer.render(scene, camera); updateLabels(); dirty = false; }
  }
  applyMode();
  requestAnimationFrame(loop);

  return {
    kind: "3d",
    modes: [{ id: "whole", label: "Whole brain" }, { id: "cut", label: "Cut in half" }, { id: "xray", label: "X-ray" }],
    hints: {
      whole: "Drag to rotate · scroll or pinch to zoom · click any region",
      cut: "Cut down the middle — the inner surface of the right hemisphere and the structures along the midline.",
      xray: "X-ray — the cortex is see-through so you can explore deep structures like the hippocampus and amygdala."
    },
    get mode() { return st.mode; },
    get spin() { return st.spin; },
    setMode(m) {
      if (m === st.mode) return;
      st.mode = m;
      applyMode();
      onModeChange();
      if (m === "cut") flyTo(DIRS.cut);
    },
    setSelected(id) { st.sel = id; paint(); },
    setColored(b) { st.colored = b; paint(); },
    setLabels(b) { st.labels = b; dirty = true; },
    setSpin(b) { setSpin(b); },
    resetView() { flyTo(DIRS.home, homeDist()); },
    reveal(id, fly) {
      let m = st.mode;
      if (MIDLINE.includes(id) && m === "whole") m = "cut";
      if (LATERAL_DEEP.includes(id) && m !== "xray") m = "xray";
      if (LATERAL_ONLY.includes(id) && m === "cut") m = "whole";
      if (m !== st.mode) { st.mode = m; applyMode(); onModeChange(); }
      if (!fly) return;
      const own = CORTEX.includes(id) || OUTER.includes(id);
      flyTo(own ? (m === "cut" ? DIRS.cut : DIRS[id]) : DIRS[m]);
    }
  };
}
