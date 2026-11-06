import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp} from '../anim';
import {C, FONT} from '../theme';

// ───────────────────────── Panggung & kamera ─────────────────────────

/** Kanvas SVG 1920×1080 dengan filter bersama (kabur kedalaman, bayangan lembut). */
export const Stage: React.FC<{children: React.ReactNode; bg?: string}> = ({children, bg}) => (
  <AbsoluteFill style={{background: bg}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <defs>
        <filter id="dof-far" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation={3} />
        </filter>
        <filter id="dof-near" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={9} />
        </filter>
        <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={18} />
        </filter>
        <linearGradient id="glass-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity={0.55} />
          <stop offset="0.18" stopColor="#fff" stopOpacity={0.1} />
          <stop offset="0.8" stopColor="#fff" stopOpacity={0} />
          <stop offset="1" stopColor="#fff" stopOpacity={0.25} />
        </linearGradient>
        <linearGradient id="lake-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fd8f0" />
          <stop offset="1" stopColor="#2f7fb0" />
        </linearGradient>
        <linearGradient id="sea-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5fc0e6" />
          <stop offset="1" stopColor="#1f5f8f" />
        </linearGradient>
      </defs>
      {children}
    </svg>
  </AbsoluteFill>
);

export type Cam = {s: number; x: number; y: number};

/**
 * Lapisan paralaks: depth 0 = diam (langit jauh), 1 = ikut kamera penuh, >1 = latar depan.
 * Kamera mendorong masuk (s) dan menggeser (x, y) berpusat di tengah layar.
 */
export const Layer: React.FC<{cam: Cam; depth: number; children: React.ReactNode; blur?: 'far' | 'near'; opacity?: number}> = ({cam, depth, children, blur, opacity}) => {
  const s = 1 + (cam.s - 1) * depth;
  const x = cam.x * depth;
  const y = cam.y * depth;
  return (
    <g opacity={opacity} filter={blur ? `url(#dof-${blur})` : undefined} transform={`translate(960 540) scale(${s.toFixed(4)}) translate(${(-960 - x).toFixed(2)} ${(-540 - y).toFixed(2)})`}>
      {children}
    </g>
  );
};

/** Kamera bergerak pelan terus-menerus (dorong masuk + geser), sesuai gaya explainer. */
export const drift = (t: number, dur: number, from: Cam, to: Cam): Cam => {
  const p = EASE_IN_OUT(Math.min(1, Math.max(0, t / Math.max(1, dur))));
  return {s: mix(from.s, to.s, p), x: mix(from.x, to.x, p), y: mix(from.y, to.y, p)};
};

/** Bayangan lonjong di bawah benda. */
export const Shadow: React.FC<{x: number; y: number; w: number; h?: number; o?: number}> = ({x, y, w, h = w * 0.16, o = 1}) => (
  <ellipse cx={x} cy={y} rx={w / 2} ry={h / 2} fill={C.shadow} opacity={o} />
);

// ───────────────────────── Karakter ─────────────────────────

export type Face = 'neutral' | 'happy' | 'wow' | 'think' | 'sad';

/**
 * Anak berkepala bulat besar (desain orisinal, bukan tokoh channel lain).
 * Titik pijak = kaki (x, y). Tinggi ±400 px pada s = 1.
 * face boleh dicampur: faceMix = {happy: 0.6, wow: 0.4} — ekspresi bersilang-pudar, tanpa ganti mendadak.
 */
export const Kid: React.FC<{
  x: number;
  y: number;
  s?: number;
  t: number;
  face?: Partial<Record<Face, number>>;
  armL?: number; // derajat, 0 = menggantung, 90 = mendatar ke samping, 160 = ke atas
  armR?: number;
  look?: number; // −1 kiri … 1 kanan (pupil & kepala)
  flip?: boolean;
  scarf?: boolean;
  hold?: React.ReactNode; // benda di tangan kanan
  shirt?: string;
  hairStyle?: 0 | 1;
  phase?: number;
}> = ({x, y, s = 1, t, face = {neutral: 1}, armL = 8, armR = 8, look = 0, flip, scarf, hold, shirt = C.shirt, hairStyle = 0, phase = 0}) => {
  const breathe = Math.sin(t * 2.1 + phase) * 0.012;
  // kedip ±0,14 dtk setiap ±3,4 dtk (halus, bukan biner)
  const bp = ((t + phase * 1.7) % 3.4) / 3.4;
  const blink = Math.max(0, 1 - Math.abs(bp - 0.96) / 0.022);
  const eyeH = 1 - 0.9 * Math.min(1, blink);
  const tot = Object.values(face).reduce((a, b) => a + (b ?? 0), 0) || 1;
  const f = (k: Face) => (face[k] ?? 0) / tot;
  const headTilt = look * 4 + Math.sin(t * 0.9 + phase) * 1.5;
  const px = look * 7;
  const shirt2 = shade(shirt, -0.16);
  // sudut 0 = menggantung, positif = terangkat ke arah luar badan
  const arm = (side: -1 | 1, ang: number) => {
    const sx = side * 58;
    const sy = -232;
    const a = (ang * Math.PI) / 180;
    const len = 104;
    return {sx, sy, ex: sx + side * Math.sin(a) * len, ey: sy + Math.cos(a) * len};
  };
  const L = arm(-1, armL);
  const R = arm(1, armR);
  return (
    <g transform={`translate(${x} ${y}) scale(${(flip ? -s : s).toFixed(4)} ${s.toFixed(4)})`}>
      <Shadow x={0} y={2} w={170} h={26} />
      {/* kaki */}
      <rect x={-46} y={-96} width={38} height={92} rx={16} fill={C.pants} />
      <rect x={8} y={-96} width={38} height={92} rx={16} fill={shade(C.pants, -0.12)} />
      <rect x={-54} y={-16} width={50} height={20} rx={10} fill={C.ink} />
      <rect x={4} y={-16} width={50} height={20} rx={10} fill={C.ink} />
      <g transform={`translate(0 ${(-breathe * 300).toFixed(2)})`}>
        {/* lengan belakang (kiri) */}
        <ArmShape a={L} color={shirt} />
        {/* badan */}
        <path d="M-66,-250 Q-72,-160 -62,-86 L62,-86 Q72,-160 66,-250 Q0,-276 -66,-250 Z" fill={shirt} />
        <path d="M18,-262 Q60,-258 66,-250 Q72,-160 62,-86 L28,-86 Q40,-170 18,-262 Z" fill={shirt2} opacity={0.55} />
        {scarf ? (
          <g>
            <path d="M-56,-262 Q0,-232 56,-262 L60,-238 Q0,-206 -60,-238 Z" fill={C.red} />
            <rect x={20} y={-246} width={30} height={84} rx={12} fill={shade(C.red, -0.1)} transform="rotate(-8 35 -246)" />
          </g>
        ) : null}
        {/* kepala */}
        <g transform={`translate(0 -262) rotate(${headTilt.toFixed(2)})`}>
          <rect x={-18} y={-8} width={36} height={22} rx={8} fill={C.skin2} />
          <circle cx={0} cy={-92} r={92} fill={C.skin} />
          <path d="M40,-170 A92,92 0 0 1 92,-92 A92,92 0 0 1 40,-14 Q78,-92 40,-170 Z" fill={C.skin2} opacity={0.45} />
          <circle cx={-90} cy={-86} r={15} fill={C.skin2} />
          <Hair style={hairStyle} />
          {/* pipi */}
          <ellipse cx={-48} cy={-62} rx={15} ry={9} fill={C.pink} opacity={0.35 + 0.35 * f('happy')} />
          <ellipse cx={46} cy={-62} rx={15} ry={9} fill={C.pink} opacity={0.35 + 0.35 * f('happy')} />
          {/* alis */}
          <g stroke={C.hair} strokeWidth={6} strokeLinecap="round" fill="none">
            <path d={`M${-44 + px},${-118 - 10 * f('wow') + 6 * f('sad')} q14,${-6 - 4 * f('wow') + 8 * f('sad')} 26,${2 * f('think')}`} />
            <path d={`M${18 + px},${-118 - 10 * f('wow') - 8 * f('think')} q14,${-6 - 4 * f('wow') + 4 * f('think')} 26,${0}`} />
          </g>
          {/* mata */}
          <ellipse cx={-30 + px} cy={-90} rx={8 + 2 * f('wow')} ry={(11 + 4 * f('wow')) * eyeH} fill={C.ink} />
          <ellipse cx={30 + px} cy={-90} rx={8 + 2 * f('wow')} ry={(11 + 4 * f('wow')) * eyeH} fill={C.ink} />
          {/* mulut: tiap ekspresi digambar, lalu dicampur lewat opacity */}
          <g fill="none" stroke={C.ink} strokeWidth={5} strokeLinecap="round">
            <path d={`M${-12 + px},-50 q12,4 24,0`} opacity={f('neutral') + f('think')} />
            <path d={`M${-18 + px},-54 q18,18 36,0`} opacity={f('happy')} />
            <path d={`M${-14 + px},-44 q14,-12 28,0`} opacity={f('sad')} />
          </g>
          <ellipse cx={px} cy={-48} rx={10} ry={13} fill={C.ink} opacity={f('wow')} />
          <ellipse cx={px} cy={-44} rx={6} ry={5} fill={C.red} opacity={f('wow') * 0.8} />
        </g>
        {/* lengan depan (kanan) + benda */}
        <ArmShape a={R} color={shirt} hold={hold} />
      </g>
    </g>
  );
};

const ArmShape: React.FC<{a: {sx: number; sy: number; ex: number; ey: number}; color: string; hold?: React.ReactNode}> = ({a, color, hold}) => {
  const mx = a.sx + (a.ex - a.sx) * 0.38;
  const my = a.sy + (a.ey - a.sy) * 0.38;
  return (
    <g>
      <line x1={a.sx} y1={a.sy} x2={a.ex} y2={a.ey} stroke={C.skin} strokeWidth={30} strokeLinecap="round" />
      <line x1={a.sx} y1={a.sy} x2={mx} y2={my} stroke={color} strokeWidth={38} strokeLinecap="round" />
      <circle cx={a.ex} cy={a.ey} r={19} fill={C.skin} />
      {hold ? <g transform={`translate(${a.ex} ${a.ey})`}>{hold}</g> : null}
    </g>
  );
};

const Hair: React.FC<{style: 0 | 1}> = ({style}) =>
  style === 0 ? (
    <path
      d="M-92,-96 Q-96,-170 -30,-188 Q-10,-214 22,-196 Q44,-226 62,-190 Q96,-172 94,-110 Q70,-140 40,-136 Q46,-152 30,-160 Q12,-136 -18,-142 Q-30,-160 -44,-150 Q-60,-128 -92,-96 Z"
      fill={C.hair}
    />
  ) : (
    <g fill={C.hair}>
      <path d="M-94,-80 Q-100,-176 0,-186 Q100,-176 94,-80 Q74,-140 0,-142 Q-74,-140 -94,-80 Z" />
      <path d="M-94,-90 Q-112,-10 -84,40 Q-70,-20 -74,-90 Z" />
      <path d="M94,-90 Q112,-10 84,40 Q70,-20 74,-90 Z" />
      <circle cx={58} cy={-170} r={16} fill={C.red} />
    </g>
  );

/** Menggelapkan/menerangkan warna hex. */
export const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.max(0, Math.min(255, Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k)));
  const r = ch((n >> 16) & 255);
  const g = ch((n >> 8) & 255);
  const b = ch(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

// ───────────────────────── Molekul air berwajah ─────────────────────────

/**
 * Molekul H₂O datar: O bulat berwajah, dua H menempel bersudut 104,5°.
 * rot = arah bisektor H (derajat, 90 = H ke bawah). hAngles opsional untuk kisi es.
 */
export const WaterMol: React.FC<{
  x: number;
  y: number;
  r?: number;
  rot?: number;
  t?: number;
  face?: number; // 0..1 kekuatan wajah
  happy?: number;
  hAngles?: [number, number];
  phase?: number;
  charges?: number;
  opacity?: number;
  h2fade?: number; // H kedua keluar bidang gambar (kisi es): lebih kecil & redup
}> = ({x, y, r = 46, rot = 90, t = 0, face = 1, happy = 0, hAngles, phase = 0, charges = 0, opacity = 1, h2fade = 0}) => {
  const a1 = hAngles ? hAngles[0] : rot - 52.25;
  const a2 = hAngles ? hAngles[1] : rot + 52.25;
  const hr = r * 0.6;
  const d = r * 1.06;
  const H = (a: number) => [x + d * Math.cos((a * Math.PI) / 180), y + d * Math.sin((a * Math.PI) / 180)] as const;
  const [h1x, h1y] = H(a1);
  const [h2x, h2y] = H(a2);
  const bp = ((t + phase) % 3.1) / 3.1;
  const blink = Math.max(0, 1 - Math.abs(bp - 0.95) / 0.025);
  const eyeH = 1 - 0.9 * Math.min(1, blink);
  // wajah selalu menghadap berlawanan dengan arah H, tetapi tetap tegak
  const fx = x - r * 0.16 * Math.cos((rot * Math.PI) / 180);
  const fy = y - r * 0.16 * Math.sin((rot * Math.PI) / 180);
  return (
    <g opacity={opacity}>
      {[
        [h1x, h1y],
        [h2x, h2y],
      ].map(([hx, hy], i) => {
        const k = i === 1 ? 1 - 0.3 * h2fade : 1;
        const hh = hr * k;
        return (
          <g key={i} opacity={i === 1 ? 1 - 0.5 * h2fade : 1}>
            <circle cx={hx} cy={hy} r={hh} fill={C.hyd} stroke="#c9d6e6" strokeWidth={r * 0.06} />
            <circle cx={hx + hh * 0.25} cy={hy + hh * 0.25} r={hh * 0.72} fill={C.hyd2} opacity={0.6} />
            <circle cx={hx - hh * 0.3} cy={hy - hh * 0.3} r={hh * 0.22} fill="#fff" />
          </g>
        );
      })}
      <circle cx={x} cy={y} r={r} fill={C.oxy} />
      <path d={`M${x + r * 0.2},${y - r * 0.98} A${r},${r} 0 0 1 ${x + r * 0.2},${y + r * 0.98} Q${x + r * 0.9},${y} ${x + r * 0.2},${y - r * 0.98} Z`} fill={C.oxy2} opacity={0.45} />
      <ellipse cx={x - r * 0.42} cy={y - r * 0.45} rx={r * 0.18} ry={r * 0.11} fill="#fff" opacity={0.5} transform={`rotate(-35 ${x - r * 0.42} ${y - r * 0.45})`} />
      <g opacity={face}>
        <ellipse cx={fx - r * 0.3} cy={fy - r * 0.05} rx={r * 0.09} ry={r * 0.13 * eyeH} fill={C.ink} />
        <ellipse cx={fx + r * 0.3} cy={fy - r * 0.05} rx={r * 0.09} ry={r * 0.13 * eyeH} fill={C.ink} />
        <path d={`M${fx - r * 0.18},${fy + r * 0.25} q${r * 0.18},${r * (0.06 + 0.16 * happy)} ${r * 0.36},0`} stroke={C.ink} strokeWidth={r * 0.08} strokeLinecap="round" fill="none" />
      </g>
      {charges > 0 ? (
        <g opacity={charges} fontFamily={FONT.sans} fontWeight={800} textAnchor="middle" fontSize={r * 0.62}>
          <text x={x - (h1x + h2x - 2 * x) * 0.9} y={y - (h1y + h2y - 2 * y) * 0.9 + r * 0.22} fill={C.oxy2}>
            δ−
          </text>
          <text x={h1x + (h1x - x) * 0.75} y={h1y + (h1y - y) * 0.75 + r * 0.22} fill={C.deep}>
            δ+
          </text>
          <text x={h2x + (h2x - x) * 0.75} y={h2y + (h2y - y) * 0.75 + r * 0.22} fill={C.deep}>
            δ+
          </text>
        </g>
      ) : null}
    </g>
  );
};

/** Ikatan hidrogen: garis putus-putus lembut antara H dan O tetangga. */
export const HBond: React.FC<{x1: number; y1: number; x2: number; y2: number; o: number; w?: number}> = ({x1, y1, x2, y2, o, w = 6}) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f4a300" strokeWidth={w} strokeDasharray={`${w * 1.6} ${w * 1.4}`} strokeLinecap="round" opacity={o} />
);

// ───────────────────────── Benda ─────────────────────────

/** Es batu bulat-persegi dengan kilap. */
export const IceCube: React.FC<{x: number; y: number; s?: number; rot?: number; o?: number}> = ({x, y, s = 1, rot = 0, o = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
    <rect x={-46} y={-46} width={92} height={92} rx={18} fill={C.ice2} />
    <rect x={-46} y={-46} width={92} height={92} rx={18} fill="none" stroke="#fff" strokeWidth={4} opacity={0.7} />
    <path d="M-30,-34 L8,-34" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.9} />
    <path d="M-34,-30 L-34,-6" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.9} />
    <rect x={6} y={10} width={30} height={26} rx={10} fill="#9fdcf5" opacity={0.6} />
  </g>
);

/**
 * Gelas berisi air. level = tinggi air (0..1). children digambar DI DALAM air (dipotong bentuk gelas).
 * Titik (x, y) = dasar gelas di tengah.
 */
export const Glass: React.FC<{x: number; y: number; w?: number; h?: number; level?: number; liquid?: string; liquid2?: string; t?: number; children?: React.ReactNode; id: string}> = ({
  x,
  y,
  w = 220,
  h = 300,
  level = 0.72,
  liquid = C.water,
  liquid2 = C.water2,
  t = 0,
  children,
  id,
}) => {
  const top = y - h;
  const lw = w * 0.86;
  const surf = y - h * level;
  const wave = (k: number) => 5 * Math.sin(t * 2.2 + k);
  const glassPath = `M${x - w / 2},${top} L${x - lw / 2},${y - 8} Q${x - lw / 2},${y} ${x - lw / 2 + 10},${y} L${x + lw / 2 - 10},${y} Q${x + lw / 2},${y} ${x + lw / 2},${y - 8} L${x + w / 2},${top} Z`;
  const fracAt = (yy: number) => (yy - top) / h;
  const halfAt = (yy: number) => (w / 2) * (1 - fracAt(yy)) + (lw / 2) * fracAt(yy);
  return (
    <g>
      <Shadow x={x + 14} y={y + 4} w={lw * 1.25} h={22} />
      <clipPath id={`glass-${id}`}>
        <path d={glassPath} />
      </clipPath>
      <path d={glassPath} fill="#ffffff" opacity={0.35} />
      <g clipPath={`url(#glass-${id})`}>
        <path
          d={`M${x - w},${surf + wave(0)} Q${x - w / 4},${surf - 8 + wave(1.3)} ${x},${surf + wave(2.1)} T${x + w},${surf + wave(3)} L${x + w},${y + 10} L${x - w},${y + 10} Z`}
          fill={liquid}
        />
        <rect x={x + halfAt(surf) * 0.25} y={surf} width={w} height={h} fill={liquid2} opacity={0.35} />
        {children}
      </g>
      <path d={glassPath} fill="url(#glass-sheen)" />
      <path d={glassPath} fill="none" stroke="#ffffff" strokeWidth={5} opacity={0.85} strokeLinejoin="round" />
      <ellipse cx={x} cy={top} rx={w / 2} ry={10} fill="none" stroke="#fff" strokeWidth={5} opacity={0.85} />
    </g>
  );
};

/** Gelembung kecil naik di dalam cairan (siklus mulus). */
export const Bubbles: React.FC<{x: number; y0: number; y1: number; w: number; t: number; n?: number; seed?: number}> = ({x, y0, y1, w, t, n = 7, seed = 1}) => (
  <g>
    {Array.from({length: n}, (_, i) => {
      const sp = 0.18 + ((i * 37 + seed * 13) % 10) / 40;
      const ph = (t * sp + i / n + seed * 0.17) % 1;
      const fade = Math.min(1, ph * 6) * (1 - ph);
      const bx = x + (((i * 53 + seed * 29) % 100) / 100 - 0.5) * w + 6 * Math.sin(t * 2 + i);
      return <circle key={i} cx={bx} cy={mix(y0, y1, ph)} r={4 + (i % 3) * 2} fill="#fff" opacity={0.7 * fade} />;
    })}
  </g>
);

// ───────────────────────── Teks & kartu ─────────────────────────

/** Balon ucapan; p = kemunculan 0..1 (meletup dengan BACK). tail = arah ekor ('left'|'right'). */
export const Bubble: React.FC<{x: number; y: number; text: string; p: number; tail?: 'left' | 'right'; w?: number; size?: number}> = ({x, y, text, p, tail = 'left', w = 300, size = 40}) => {
  if (p <= 0.001) return null;
  const sc = BACK(Math.min(1, p));
  const lines = text.split('\n');
  const h = lines.length * size * 1.1 + 44;
  const tx = tail === 'left' ? -w / 2 + 50 : w / 2 - 50;
  return (
    <g transform={`translate(${x} ${y}) scale(${sc.toFixed(4)})`} opacity={Math.min(1, p * 3)}>
      <rect x={-w / 2 + 6} y={-h / 2 + 8} width={w} height={h} rx={h / 2.4} fill={C.shadow} />
      <path d={`M${tx - 18},${h / 2 - 6} L${tx + (tail === 'left' ? -30 : 30)},${h / 2 + 40} L${tx + 22},${h / 2 - 6} Z`} fill="#fff" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2.4} fill="#fff" />
      {lines.map((l, i) => (
        <text key={i} x={0} y={-h / 2 + 22 + size * 0.86 + i * size * 1.1} textAnchor="middle" fontFamily={FONT.sans} fontWeight={800} fontSize={size} fill={C.ink}>
          {l}
        </text>
      ))}
    </g>
  );
};

/** Label kecil di dalam SVG (pil putih). */
export const Tag: React.FC<{x: number; y: number; text: string; color?: string; o?: number; size?: number; bg?: string}> = ({x, y, text, color = C.ink, o = 1, size = 30, bg = '#fff'}) => {
  const w = text.length * size * 0.56 + 40;
  return (
    <g opacity={o}>
      <rect x={x - w / 2 + 4} y={y - size * 0.95 + 6} width={w} height={size * 1.6} rx={size * 0.8} fill={C.shadow} />
      <rect x={x - w / 2} y={y - size * 0.95} width={w} height={size * 1.6} rx={size * 0.8} fill={bg} />
      <text x={x} y={y + size * 0.2} textAnchor="middle" fontFamily={FONT.sans} fontWeight={700} fontSize={size} fill={color}>
        {text}
      </text>
    </g>
  );
};

/** Kartu data HTML (judul tebal + pil merah + sumber kecil), meletup masuk. */
export const DataCard: React.FC<{
  x: number;
  y: number;
  p: number;
  title: string;
  items: {label: string; value: string; color?: string}[];
  source?: string;
}> = ({x, y, p, title, items, source}) => {
  if (p <= 0.001) return null;
  const sc = interpolate(BACK(Math.min(1, p)), [0, 1], [0.6, 1]);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${sc})`, opacity: Math.min(1, p * 2.5), textAlign: 'center', fontFamily: FONT.sans}}>
      <div style={{fontSize: 62, fontWeight: 800, color: C.ink, whiteSpace: 'nowrap'}}>{title}</div>
      <div style={{display: 'flex', gap: 22, justifyContent: 'center', marginTop: 18}}>
        {items.map((it, i) => (
          <div
            key={i}
            style={{
              background: it.color ?? C.red,
              color: '#fff',
              borderRadius: 18,
              padding: '14px 34px 16px',
              boxShadow: '6px 8px 0 rgba(43,45,66,0.18)',
              opacity: ramp(p, 0.3 + i * 0.15, 0.6 + i * 0.15),
              translate: `0px ${(1 - ramp(p, 0.3 + i * 0.15, 0.6 + i * 0.15)) * 20}px`,
            }}
          >
            <div style={{fontSize: 34, fontWeight: 700, lineHeight: 1.1}}>{it.label}</div>
            <div style={{fontSize: 56, fontWeight: 800, lineHeight: 1.1}}>{it.value}</div>
          </div>
        ))}
      </div>
      {source ? <div style={{marginTop: 16, fontSize: 24, fontWeight: 600, color: C.ink2}}>{source}</div> : null}
    </div>
  );
};

/** Judul besar meletup (kartu judul video). */
export const BigTitle: React.FC<{p: number; lines: string[]; sub?: string}> = ({p, lines, sub}) => {
  if (p <= 0.001) return null;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', fontFamily: FONT.sans}}>
      <div style={{textAlign: 'center'}}>
        {lines.map((l, i) => {
          const q = ramp(p, i * 0.15, 0.55 + i * 0.15, BACK);
          return (
            <div
              key={i}
              style={{
                fontSize: 130,
                fontWeight: 800,
                lineHeight: 1.02,
                color: i === lines.length - 1 ? C.yellow : '#fff',
                textShadow: '0 8px 0 rgba(43,45,66,0.3)',
                WebkitTextStroke: `10px ${C.ink}`,
                paintOrder: 'stroke fill',
                transform: `scale(${(0.5 + 0.5 * q).toFixed(3)}) rotate(${((1 - q) * (i % 2 ? 6 : -6)).toFixed(2)}deg)`,
                opacity: Math.min(1, q * 2),
              }}
            >
              {l}
            </div>
          );
        })}
        {sub ? (
          <div style={{marginTop: 26, fontSize: 40, fontWeight: 700, color: C.ink, background: '#fff', display: 'inline-block', padding: '8px 30px', borderRadius: 40, opacity: ramp(p, 0.5, 0.8)}}>{sub}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/** Lingkaran "kaca pembesar" (inset) untuk memperlihatkan dunia molekul. */
export const Zoomer: React.FC<{x: number; y: number; r: number; p: number; id: string; children: React.ReactNode; fromX?: number; fromY?: number}> = ({x, y, r, p, id, children, fromX, fromY}) => {
  if (p <= 0.001) return null;
  const q = BACK(Math.min(1, p));
  const rr = r * q;
  return (
    <g>
      {fromX !== undefined && fromY !== undefined ? (
        <path d={`M${fromX},${fromY} L${x - rr * 0.7},${y + rr * 0.7} L${x + rr * 0.7},${y + rr * 0.7} Z`} fill="#fff" opacity={0.35 * Math.min(1, p)} />
      ) : null}
      <circle cx={x + 10} cy={y + 14} r={rr + 14} fill={C.shadow} />
      <clipPath id={`zoom-${id}`}>
        <circle cx={x} cy={y} r={rr} />
      </clipPath>
      <circle cx={x} cy={y} r={rr} fill={C.sky2} />
      <g clipPath={`url(#zoom-${id})`}>{children}</g>
      <circle cx={x} cy={y} r={rr} fill="none" stroke="#fff" strokeWidth={14} />
    </g>
  );
};
