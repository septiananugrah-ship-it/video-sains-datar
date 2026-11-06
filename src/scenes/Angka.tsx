import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, mix, ramp} from '../anim';
import {DataCard, Glass, IceCube, Shadow, Stage, Tag, drift, Layer} from '../components/flat';
import {Sea} from '../components/sets';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

const RHO_ICE = 0.917; // g/cm³ pada 0 °C
const RHO_WATER = 1.0; // ≈ (0,9998 g/cm³ pada 0 °C)
const RHO_SEA = 1.025;

/** Luas poligon di atas garis y = yl (bagian gunung es di atas air). */
const areaAbove = (pts: [number, number][], yl: number) => {
  const clip: [number, number][] = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    const ina = a[1] <= yl;
    const inb = b[1] <= yl;
    if (ina) clip.push(a);
    if (ina !== inb) {
      const u = (yl - a[1]) / (b[1] - a[1]);
      clip.push([a[0] + (b[0] - a[0]) * u, yl]);
    }
  }
  return Math.abs(clip.reduce((s, p, i) => s + p[0] * clip[(i + 1) % clip.length][1] - clip[(i + 1) % clip.length][0] * p[1], 0)) / 2;
};
const area = (pts: [number, number][]) => Math.abs(pts.reduce((s, p, i) => s + p[0] * pts[(i + 1) % pts.length][1] - pts[(i + 1) % pts.length][0] * p[1], 0)) / 2;

// bentuk gunung es (koordinat lokal, puncak di atas)
const BERG: [number, number][] = [
  [0, -150], [60, -90], [110, -60], [150, 20], [260, 120], [330, 260], [300, 420], [220, 540], [60, 600], [-120, 580], [-260, 470], [-320, 300], [-260, 140], [-140, 40], [-90, -40], [-40, -80],
];
const WATERLINE = 420;
// cari posisi vertikal sehingga fraksi di atas air = 1 − ρes/ρlaut (≈ 11 %)
const BERG_DY = (() => {
  const target = 1 - RHO_ICE / RHO_SEA;
  const A = area(BERG);
  let lo = WATERLINE - 600;
  let hi = WATERLINE + 150;
  for (let k = 0; k < 40; k++) {
    const mid = (lo + hi) / 2;
    const f = areaAbove(BERG.map(([x, y]) => [x, y + mid]), WATERLINE) / A;
    if (f > target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
})();

export const Angka: React.FC = () => {
  const {t, cue, dur} = useScene();
  const aOut = ramp(t, cue(1) - 0.35, cue(1) + 0.05, EASE_IN_OUT);
  const bOut = ramp(t, cue(2) - 0.35, cue(2) + 0.05, EASE_IN_OUT);
  // ── A: timbangan 1 cm³ air vs es
  const card = ramp(t, cue(0) + 0.3, cue(0) + 1.3);
  const load = ramp(t, cue(0) + 1.0, cue(0) + 2.4, EASE_IN_OUT);
  const tilt = load * 9 * ((RHO_WATER - RHO_ICE) / 0.083) + 0.6 * Math.sin(t * 2.4) * load; // sisi air (kiri) turun
  const bx = 960;
  const by = 640;
  const arm = 300;
  const rad = (tilt * Math.PI) / 180;
  const lx = bx - arm * Math.cos(rad);
  const ly = by - 20 + arm * Math.sin(rad);
  const rx = bx + arm * Math.cos(rad);
  const ry = by - 20 - arm * Math.sin(rad);
  // ── B: es dilepas dari dasar gelas, naik dan mengapung
  const rise = ramp(t, cue(1) + 0.8, cue(1) + 2.6, EASE_IN_OUT);
  const G = {x: 960, y: 860, w: 360, h: 520, level: 0.78};
  const surf = G.y - G.h * G.level;
  const iceY = mix(G.y - 70, surf + 40, rise) + (rise > 0.99 ? 0 : 0) + 4 * Math.sin(t * 1.7) * rise;
  // ── C: gunung es
  const camC = drift(t - cue(2), dur - cue(2), {s: 1.05, x: 0, y: -60}, {s: 1.0, x: 0, y: 60});
  const bob = 4 * Math.sin(t * 1.1);
  const berg = BERG.map(([x, y]) => `${960 + x},${y + BERG_DY + bob}`).join(' ');
  const bergTop = Math.min(...BERG.map((p) => p[1])) + BERG_DY + bob;
  const bergBot = Math.max(...BERG.map((p) => p[1])) + BERG_DY + bob;
  const labC = ramp(t, cue(2) + 1.2, cue(2) + 2.0);
  return (
    <AbsoluteFill>
      {/* A */}
      {aOut < 1 ? (
        <AbsoluteFill style={{opacity: 1 - aOut}}>
          <Stage bg="#fff1c9">
            <circle cx={960} cy={560} r={520} fill="#ffe3a0" opacity={0.6} />
            <Shadow x={bx + 20} y={by + 250} w={420} h={40} />
            <rect x={bx - 22} y={by - 20} width={44} height={260} rx={14} fill={C.ink2} />
            <rect x={bx - 150} y={by + 230} width={300} height={34} rx={14} fill={C.ink2} />
            <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={C.ink} strokeWidth={22} strokeLinecap="round" />
            <circle cx={bx} cy={by - 20} r={22} fill={C.yellow} />
            {[
              {x: lx, y: ly},
              {x: rx, y: ry},
            ].map((pp, i) => (
              <g key={i}>
                <line x1={pp.x} y1={pp.y} x2={pp.x - 90} y2={pp.y + 120} stroke={C.ink2} strokeWidth={5} />
                <line x1={pp.x} y1={pp.y} x2={pp.x + 90} y2={pp.y + 120} stroke={C.ink2} strokeWidth={5} />
                <path d={`M${pp.x - 120},${pp.y + 120} L${pp.x + 120},${pp.y + 120} Q${pp.x},${pp.y + 180} ${pp.x - 120},${pp.y + 120} Z`} fill={C.ink2} />
              </g>
            ))}
            {/* kubus 1 cm³: air (dalam wadah tipis) dan es */}
            <g opacity={load}>
              <rect x={lx - 62} y={ly + 120 - 124 - (1 - load) * 200} width={124} height={124} rx={14} fill={C.water} />
              <rect x={lx - 62} y={ly + 120 - 124 - (1 - load) * 200} width={124} height={124} rx={14} fill="none" stroke="#fff" strokeWidth={6} />
              <IceCube x={rx} y={ry + 120 - 62 - (1 - load) * 200} s={124 / 92} />
            </g>
            <text x={lx} y={ly + 250} textAnchor="middle" fontFamily={FONT.sans} fontWeight={800} fontSize={40} fill={C.ink} opacity={load}>
              1 cm³ air
            </text>
            <text x={rx} y={ry + 250} textAnchor="middle" fontFamily={FONT.sans} fontWeight={800} fontSize={40} fill={C.ink} opacity={load}>
              1 cm³ es
            </text>
          </Stage>
          <DataCard
            x={960}
            y={190}
            p={card}
            title="Massa jenis"
            items={[
              {label: 'Air', value: '≈ 1,00 g/cm³', color: C.water2},
              {label: 'Es', value: '≈ 0,92 g/cm³', color: C.shirt2},
            ]}
            source="nilai sekitar 0 °C · sumber: CRC Handbook / USGS"
          />
        </AbsoluteFill>
      ) : null}
      {/* B */}
      {aOut > 0 && bOut < 1 ? (
        <AbsoluteFill style={{opacity: aOut * (1 - bOut)}}>
          <Stage bg={C.sky2}>
            <circle cx={960} cy={560} r={520} fill="#fff" opacity={0.6} />
            <Glass id="angka" x={G.x} y={G.y} w={G.w} h={G.h} level={G.level} t={t}>
              <IceCube x={G.x} y={iceY} s={1.2} rot={6 * Math.sin(t * 1.3)} />
              <rect x={G.x - G.w} y={surf + 2 * Math.sin(t * 2.2)} width={G.w * 2} height={G.h} fill={C.water} opacity={0.35} />
            </Glass>
            <g opacity={ramp(t, cue(1) + 0.8, cue(1) + 1.2) * (1 - ramp(t, cue(1) + 2.4, cue(1) + 2.9))}>
              <line x1={G.x + 120} y1={iceY + 60} x2={G.x + 120} y2={iceY - 70} stroke={C.green} strokeWidth={14} strokeLinecap="round" />
              <path d={`M${G.x + 98},${iceY - 52} L${G.x + 120},${iceY - 92} L${G.x + 142},${iceY - 52} Z`} fill={C.green} />
            </g>
            <Tag x={1450} y={420} text="ρ es < ρ air" o={ramp(t, cue(1) + 0.3, cue(1) + 0.9)} size={46} />
            <Tag x={1450} y={520} text="→ naik & mengapung" color={C.shirt2} o={ramp(t, cue(1) + 1.8, cue(1) + 2.4)} size={36} />
          </Stage>
        </AbsoluteFill>
      ) : null}
      {/* C */}
      {bOut > 0 ? (
        <AbsoluteFill style={{opacity: bOut}}>
          <Stage>
            <Sea cam={camC} t={t}>
              <polygon points={berg} fill={C.ice2} />
              <polygon points={berg} fill="none" stroke="#fff" strokeWidth={8} strokeLinejoin="round" />
              <rect x={-300} y={WATERLINE} width={2520} height={900} fill={C.deep} opacity={0.25} />
            </Sea>
            <Layer cam={camC} depth={1}>
              <g opacity={labC}>
                <path d={`M1330,${bergTop} h30 V${WATERLINE} h-30`} fill="none" stroke={C.ink} strokeWidth={5} />
                <path d={`M1330,${WATERLINE + 8} h30 V${bergBot} h-30`} fill="none" stroke="#fff" strokeWidth={5} />
              </g>
              <Tag x={1560} y={(bergTop + WATERLINE) / 2 + 10} text="≈ 1/10 di atas" o={labC} size={34} />
              <Tag x={1560} y={(WATERLINE + bergBot) / 2 + 10} text="≈ 9/10 terendam" o={labC} size={34} color={C.deep} />
            </Layer>
          </Stage>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
