import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, mix, ramp} from '../anim';
import {HBond, Stage, Tag, WaterMol} from '../components/flat';
import {BONDS, HEX_CENTERS, LAT, LATTICE, LIQ_H, LIQ_W, MOL_R, CX, CY, latticeHAngles, liquidPos} from '../components/mols';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';
import {MolBg} from './Molekul';

const angMix = (a: number, b: number, p: number) => {
  const d = ((b - a + 540) % 360) - 180;
  return a + d * p;
};

/** Termometer datar; temp dalam °C (0..25). */
const Thermo: React.FC<{x: number; y: number; temp: number}> = ({x, y, temp}) => {
  const h = 360;
  const lv = (temp / 25) * (h - 40) + 20;
  const col = temp > 4 ? C.red : C.water2;
  return (
    <g>
      <rect x={x - 30 + 6} y={y - h + 8} width={60} height={h} rx={30} fill={C.shadow} />
      <rect x={x - 30} y={y - h} width={60} height={h} rx={30} fill="#fff" />
      <rect x={x - 14} y={y - lv} width={28} height={lv} rx={14} fill={col} />
      <circle cx={x} cy={y} r={46} fill="#fff" />
      <circle cx={x} cy={y} r={32} fill={col} />
      <text x={x} y={y - h - 30} textAnchor="middle" fontFamily={FONT.sans} fontWeight={800} fontSize={48} fill={C.ink}>
        {`${Math.round(temp)} °C`}
      </text>
    </g>
  );
};

export const Beku: React.FC = () => {
  const {t, cue} = useScene();
  // membeku: gerak melambat lalu molekul berpindah ke kisi segi enam
  const cool = ramp(t, cue(0) + 0.2, cue(0) + 3.0, EASE_IN_OUT);
  const p = ramp(t, cue(0) + 1.2, cue(1) + 0.4, EASE_IN_OUT);
  const amp = mix(1, 0.05, cool);
  const temp = mix(20, 0, cool);
  const pos = LATTICE.map((L, k) => {
    const q = liquidPos(k, t, amp);
    const ha = latticeHAngles(L.sub);
    const latRot = angMix(ha[0], ha[1], 0.5);
    const jig = p * 2; // getaran kecil di kisi (es tetap bergetar)
    const h1 = angMix(q.rot - 52.25, ha[0], p);
    const h2 = angMix(q.rot + 52.25, ha[1], p);
    return {
      x: mix(q.x, L.x, p) + jig * Math.sin(t * 6 + k),
      y: mix(q.y, L.y, p) + jig * Math.cos(t * 5 + k),
      rot: angMix(q.rot, latRot, p),
      ha: [h1, h2] as [number, number],
      out: L.sub === 1 ? p : 0,
    };
  });
  const bondO = ramp(t, cue(0) + 3.2, cue(1) + 0.8);
  const ringP = ramp(t, cue(1) + 0.8, cue(1) + 1.6);
  const ring = HEX_CENTERS.reduce((b, c) => (Math.hypot(c.x - CX, c.y - CY) < Math.hypot(b.x - CX, b.y - CY) ? c : b), HEX_CENTERS[0]);
  const holes = ramp(t, cue(2) + 0.4, cue(2) + 1.2);
  const boxes = ramp(t, cue(2) + 2.2, cue(2) + 3.0);
  // kotak batas: cair (rapat) vs es (renggang)
  const xs = LATTICE.map((l) => l.x);
  const ys = LATTICE.map((l) => l.y);
  const iceBox = {x0: Math.min(...xs) - 60, x1: Math.max(...xs) + 60, y0: Math.min(...ys) - 60, y1: Math.max(...ys) + 60};
  const liqBox = {x0: CX - LIQ_W / 2 - 40, x1: CX + LIQ_W / 2 + 40, y0: CY - LIQ_H / 2 - 40, y1: CY + LIQ_H / 2 + 40};
  return (
    <AbsoluteFill>
      <Stage>
        <MolBg t={t} tint={`rgb(${Math.round(mix(215, 228, cool))},${Math.round(mix(241, 246, cool))},${Math.round(mix(251, 255, cool))})`} />
        {/* lubang segi enam */}
        {HEX_CENTERS.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r={LAT * 0.55} fill="#fff" opacity={0.75 * holes * (0.85 + 0.15 * Math.sin(t * 3 + i))} />
        ))}
        {/* cincin segi enam yang disorot */}
        <polygon
          points={Array.from({length: 6}, (_, i) => {
            const a = ((30 + i * 60) * Math.PI) / 180;
            return `${ring.x + LAT * Math.cos(a)},${ring.y + LAT * Math.sin(a)}`;
          }).join(' ')}
          fill={C.yellow}
          opacity={0.45 * ringP * (0.8 + 0.2 * Math.sin(t * 4))}
          stroke={C.orange}
          strokeWidth={8}
          strokeLinejoin="round"
        />
        {/* ikatan hidrogen kisi */}
        {BONDS.map((b, i) => {
          const d = pos[b.donor];
          const a = pos[b.acceptor];
          const hx = d.x + MOL_R * 1.06 * Math.cos((b.hAng * Math.PI) / 180);
          const hy = d.y + MOL_R * 1.06 * Math.sin((b.hAng * Math.PI) / 180);
          const L = Math.hypot(a.x - hx, a.y - hy);
          return <HBond key={i} x1={hx} y1={hy} x2={a.x - ((a.x - hx) / L) * MOL_R} y2={a.y - ((a.y - hy) / L) * MOL_R} o={bondO} w={6} />;
        })}
        {pos.map((m, k) => (
          <WaterMol key={k} x={m.x} y={m.y} r={MOL_R} rot={m.rot} hAngles={m.ha} h2fade={m.out} t={t} phase={k * 0.37} happy={0.3 + 0.5 * p} />
        ))}
        {/* kotak perbandingan ukuran */}
        <g opacity={boxes}>
          <rect x={liqBox.x0} y={liqBox.y0} width={liqBox.x1 - liqBox.x0} height={liqBox.y1 - liqBox.y0} rx={24} fill="none" stroke={C.water2} strokeWidth={6} strokeDasharray="18 14" />
          <rect x={iceBox.x0} y={iceBox.y0} width={iceBox.x1 - iceBox.x0} height={iceBox.y1 - iceBox.y0} rx={24} fill="none" stroke={C.ink} strokeWidth={6} />
        </g>
        <Thermo x={170} y={760} temp={temp} />
        <Tag x={960} y={70} text="ikatan hidrogen mengunci molekul" o={ramp(t, cue(0) + 3.4, cue(0) + 4.0) * (1 - ringP)} size={36} />
        <Tag x={ring.x} y={ring.y - LAT - 70} text="segi enam" o={ringP * (1 - holes)} color={C.orange} size={38} />
        <Tag x={960} y={70} text="banyak ruang kosong" o={holes * (1 - boxes)} size={38} />
        <Tag x={1700} y={iceBox.y0 + 40} text="es" o={boxes} size={36} />
        <Tag x={1700} y={iceBox.y0 + 120} text="air cair" color={C.water2} o={boxes} size={32} />
        <Tag x={960} y={70} text="volume es ≈ 9 % lebih besar (gambar dilebihkan)" o={boxes} size={32} />
      </Stage>
    </AbsoluteFill>
  );
};
