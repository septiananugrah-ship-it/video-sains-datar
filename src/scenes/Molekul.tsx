import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, mix, ramp} from '../anim';
import {HBond, Stage, Tag, WaterMol} from '../components/flat';
import {CX, CY, LIQUID, MOL_R, hPoints, liquidPos} from '../components/mols';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

/** Latar dunia molekul: biru muda dengan bulatan lembut yang melayang (bokeh). */
export const MolBg: React.FC<{t: number; tint?: string}> = ({t, tint = '#d7f1fb'}) => (
  <g>
    <rect x={0} y={0} width={1920} height={1080} fill={tint} />
    {Array.from({length: 14}, (_, i) => (
      <circle
        key={i}
        cx={(i * 263 + 40 * Math.sin(t * 0.2 + i)) % 2000}
        cy={(i * 157) % 1080 + 30 * Math.cos(t * 0.17 + i)}
        r={60 + (i % 4) * 40}
        fill="#fff"
        opacity={0.28}
      />
    ))}
  </g>
);

// dua molekul yang diperkenalkan: dekat pusat kerumunan
const K0 = LIQUID.reduce((b, m, k) => (Math.hypot(m.bx - CX, m.by - CY) < Math.hypot(LIQUID[b].bx - CX, LIQUID[b].by - CY) ? k : b), 0);
const K1 = LIQUID.reduce(
  (b, m, k) => (k === K0 ? b : b < 0 || Math.hypot(m.bx - LIQUID[K0].bx, m.by - LIQUID[K0].by) < Math.hypot(LIQUID[b].bx - LIQUID[K0].bx, LIQUID[b].by - LIQUID[K0].by) ? k : b),
  -1,
);

export const Molekul: React.FC = () => {
  const {t, cue} = useScene();
  const out = ramp(t, cue(2) - 0.2, cue(2) + 2.0, EASE_IN_OUT); // zoom keluar ke kerumunan
  const S = mix(3.4, 1, out);
  const two = ramp(t, cue(1) + 0.9, cue(1) + 1.6);
  const charges = ramp(t, cue(1) + 0.1, cue(1) + 0.7) * (1 - out);
  const amp = mix(0.15, 1, out);
  const pos = LIQUID.map((_, k) => liquidPos(k, t, amp));
  // molekul kedua mengarahkan satu H ke O molekul pertama (ikatan hidrogen pertama)
  const p0 = pos[K0];
  // saat diperkenalkan, molekul kedua berdiri pada jarak ikatan hidrogen yang jelas (≈ 3,6 r dari O)
  const dirx = pos[K1].x - p0.x;
  const diry = pos[K1].y - p0.y;
  const dl = Math.hypot(dirx, diry) || 1;
  const p1raw = {...pos[K1], x: mix(pos[K1].x, p0.x + (dirx / dl) * MOL_R * 3.6, 1 - out), y: mix(pos[K1].y, p0.y + (diry / dl) * MOL_R * 3.6, 1 - out)};
  const towards = (Math.atan2(p0.y - p1raw.y, p0.x - p1raw.x) * 180) / Math.PI + 52.25;
  const aim = 1 - out * 0.85;
  pos[K1] = {...p1raw, rot: mix(p1raw.rot, towards, aim)};
  pos[K0] = {...p0, rot: mix(p0.rot, 270, 1 - out)};
  // fokus kamera: molekul pertama (baris 0) → pasangan (baris 1) → pusat kerumunan
  const pairX = mix(pos[K0].x, (pos[K0].x + pos[K1].x) / 2, two);
  const pairY = mix(pos[K0].y, (pos[K0].y + pos[K1].y) / 2, two);
  const fx = mix(pairX, CX, out);
  const fy = mix(pairY, CY, out);
  const tr = (x: number, y: number) => ({x: 960 + (x - fx) * S, y: 520 + (y - fy) * S});
  // ikatan hidrogen di cairan: H suatu molekul cukup dekat ke O molekul lain
  const bonds: {x1: number; y1: number; x2: number; y2: number; o: number}[] = [];
  pos.forEach((p, i) => {
    const hs = hPoints(p.x, p.y, p.rot);
    pos.forEach((q, j) => {
      if (i === j) return;
      for (const h of hs) {
        const d = Math.hypot(q.x - h.x, q.y - h.y);
        if (d < 100) {
          const show = i === K1 && j === K0 ? Math.max(two, out) : out;
          bonds.push({x1: h.x, y1: h.y, x2: q.x - ((q.x - h.x) / d) * MOL_R, y2: q.y - ((q.y - h.y) / d) * MOL_R, o: Math.min(1, (100 - d) / 30) * show});
        }
      }
    });
  });
  const tagO = tr(pos[K0].x, pos[K0].y);
  const hs0 = hPoints(pos[K0].x, pos[K0].y, pos[K0].rot).map((h) => tr(h.x, h.y));
  const tagsP = ramp(t, cue(0) + 0.8, cue(0) + 1.4) * (1 - ramp(t, cue(1) - 0.3, cue(1) + 0.1));
  const vP = ramp(t, cue(0) + 2.4, cue(0) + 3.0) * (1 - ramp(t, cue(1) - 0.3, cue(1) + 0.1));
  return (
    <AbsoluteFill>
      <Stage>
        <MolBg t={t} />
        <g transform={`translate(${960 - fx * S} ${520 - fy * S}) scale(${S})`}>
          {bonds.map((b, i) => (b.o > 0.01 ? <HBond key={i} {...b} w={5} /> : null))}
          {pos.map((p, k) => {
            const vis = k === K0 ? 1 : k === K1 ? Math.max(two, out) : out;
            return vis > 0.01 ? <WaterMol key={k} x={p.x} y={p.y} r={MOL_R} rot={p.rot} t={t} phase={k * 0.37} opacity={vis} happy={k === K0 ? 0.6 : 0.2} charges={k === K0 || k === K1 ? charges : 0} /> : null;
          })}
        </g>
        {/* label atom & sudut V */}
        <Tag x={tagO.x} y={tagO.y + MOL_R * S + 60} text="O · oksigen" o={tagsP} color={C.oxy2} size={34} />
        {hs0.map((h, i) => (
          <Tag key={i} x={tagO.x + (h.x - tagO.x) * 2.3 + (i ? 60 : -60)} y={tagO.y + (h.y - tagO.y) * 1.6} text="H · hidrogen" o={tagsP} color={C.deep} size={30} />
        ))}
        <g opacity={vP}>
          {/* busur sudut H–O–H di atas molekul */}
          <path
            d={(() => {
              const R = MOL_R * S * 2.0;
              const a1 = Math.atan2(hs0[0].y - tagO.y, hs0[0].x - tagO.x);
              const a2 = Math.atan2(hs0[1].y - tagO.y, hs0[1].x - tagO.x);
              return `M${tagO.x + R * Math.cos(a1)},${tagO.y + R * Math.sin(a1)} A${R},${R} 0 0 1 ${tagO.x + R * Math.cos(a2)},${tagO.y + R * Math.sin(a2)}`;
            })()}
            fill="none"
            stroke={C.ink}
            strokeWidth={6}
            strokeDasharray="4 12"
            strokeLinecap="round"
          />
          <text x={tagO.x} y={tagO.y - MOL_R * S * 2.0 - 24} textAnchor="middle" fontFamily={FONT.sans} fontWeight={800} fontSize={52} fill={C.ink}>
            bentuk V · 104,5°
          </text>
        </g>
        <Tag x={960} y={150} text="tarik-menarik = ikatan hidrogen (garis kuning)" o={ramp(t, cue(1) + 1.6, cue(1) + 2.2) * (1 - out)} size={34} />
        <Tag x={960} y={110} text="air cair: berdesakan & terus bergerak" o={ramp(t, cue(2) + 1.6, cue(2) + 2.3)} size={36} />
      </Stage>
    </AbsoluteFill>
  );
};
