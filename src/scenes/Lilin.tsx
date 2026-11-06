import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, mix, rand, ramp} from '../anim';
import {Glass, IceCube, Kid, Stage, Tag, Zoomer} from '../components/flat';
import {Lab} from '../components/sets';
import {useScene} from '../SceneContext';
import {C} from '../theme';

const WAX = '#ffe39a';
const WAX2 = '#ffc94d';
const SOLID = '#fff4cf';
const L = {x: 640, y: 772, w: 270, h: 330, level: 0.72};
const R = {x: 1290, y: 772, w: 270, h: 330, level: 0.72};
const surf = (g: typeof L) => g.y - g.h * g.level;

export const Lilin: React.FC = () => {
  const {t, cue} = useScene();
  // kamera: lebar → ke gelas lilin (baris 1) → ke gelas air (baris 2)
  const toL = ramp(t, cue(1) - 0.4, cue(1) + 1.2, EASE_IN_OUT);
  const toR = ramp(t, cue(2) - 0.3, cue(2) + 1.3, EASE_IN_OUT);
  const cam = {s: mix(1, 1.14, toL) + 0.02 * Math.sin(t * 0.3), x: mix(mix(0, -230, toL), 250, toR), y: mix(0, -30, toL)};
  // potongan lilin padat jatuh lalu tenggelam pelan ke dasar
  const drop = ramp(t, cue(0) + 1.4, cue(0) + 1.9, (x) => x * x);
  const sink = ramp(t, cue(0) + 1.9, cue(0) + 4.2, EASE_IN_OUT);
  const chunkY = mix(mix(surf(L) - 220, surf(L) + 10, drop), L.y - 52, sink);
  const zoomP = ramp(t, cue(1) + 0.5, cue(1) + 1.1) * (1 - ramp(t, cue(2) - 0.3, cue(2) + 0.1));
  const alert = ramp(t, cue(2) + 0.6, cue(2) + 1.2);
  const kidIn = ramp(t, cue(2) + 0.2, cue(2) + 1.2, EASE_IN_OUT);
  return (
    <AbsoluteFill>
      <Stage bg="#dff1ef">
        <Lab cam={cam} t={t}>
          {/* gelas kiri: lilin cair + lilin padat */}
          <Glass id="wax" x={L.x} y={L.y} w={L.w} h={L.h} level={L.level} liquid={WAX} liquid2={WAX2} t={t}>
            <g transform={`translate(${L.x + 10} ${chunkY}) rotate(${-8 + 16 * sink})`}>
              <rect x={-58} y={-40} width={116} height={80} rx={18} fill={SOLID} />
              <rect x={-58} y={-40} width={116} height={80} rx={18} fill="none" stroke="#fff" strokeWidth={4} opacity={0.8} />
              <rect x={10} y={-6} width={40} height={36} rx={10} fill={WAX2} opacity={0.35} />
            </g>
            <rect x={L.x - L.w} y={surf(L) + 2 * Math.sin(t * 2.2)} width={L.w * 2} height={L.h} fill={WAX} opacity={0.3} />
          </Glass>
          {chunkY < surf(L) - 40 ? (
            <g transform={`translate(${L.x + 10} ${chunkY}) rotate(-8)`}>
              <rect x={-58} y={-40} width={116} height={80} rx={18} fill={SOLID} />
            </g>
          ) : null}
          <Tag x={L.x} y={L.y - L.h - 40} text="lilin cair + lilin padat" o={ramp(t, cue(0) + 0.3, cue(0) + 0.9)} size={30} />
          <Tag x={L.x - 230} y={L.y - 70} text="tenggelam ↓" color={C.red} o={ramp(t, cue(0) + 3.6, cue(0) + 4.2)} size={28} />
          {/* gelas kanan: air + es */}
          <Glass id="air" x={R.x} y={R.y} w={R.w} h={R.h} level={R.level} t={t}>
            <IceCube x={R.x - 30} y={surf(R) + 28 + 3 * Math.sin(t * 1.8)} s={0.82} rot={-12 + 4 * Math.sin(t * 1.2)} />
            <IceCube x={R.x + 52} y={surf(R) + 26 + 3 * Math.sin(t * 1.5 + 1)} s={0.7} rot={18 + 3 * Math.sin(t * 1.3)} />
            <rect x={R.x - R.w} y={surf(R) + 2 * Math.sin(t * 2.2)} width={R.w * 2} height={R.h} fill={C.water} opacity={0.35} />
          </Glass>
          <Tag x={R.x} y={R.y - R.h - 40} text="air + es" o={ramp(t, cue(0) + 0.3, cue(0) + 0.9)} size={30} />
          <Tag x={R.x} y={R.y - R.h - 120} text="air: kebalikannya!" color="#fff" bg={C.red} o={alert} size={34} />
        </Lab>
        {/* kaca pembesar: partikel cair renggang vs padat rapat */}
        <Zoomer x={720} y={330} r={210} p={zoomP} id="wax" fromX={L.x + 10} fromY={L.y - 60}>
          <rect x={500} y={110} width={220} height={440} fill={WAX} />
          <rect x={720} y={110} width={220} height={440} fill={SOLID} />
          {Array.from({length: 13}, (_, i) => {
            const x = 530 + rand(i * 2.3) * 170 + 16 * Math.sin(t * (1.4 + rand(i) * 1.2) + i);
            const y = 170 + rand(i * 5.1) * 330 + 16 * Math.cos(t * (1.1 + rand(i * 3) * 1.3) + i);
            return <circle key={i} cx={x} cy={y} r={17} fill={WAX2} />;
          })}
          {Array.from({length: 30}, (_, i) => {
            const cx = 742 + (i % 5) * 36 + (Math.floor(i / 5) % 2) * 18;
            const cy = 200 + Math.floor(i / 5) * 31;
            return <circle key={i} cx={cx + 1.5 * Math.sin(t * 9 + i)} cy={cy} r={17} fill={WAX2} />;
          })}
          <line x1={720} y1={110} x2={720} y2={550} stroke="#fff" strokeWidth={6} />
        </Zoomer>
        <Tag x={610} y={590} text="cair: renggang" o={zoomP} size={28} />
        <Tag x={840} y={590} text="padat: rapat" o={zoomP} size={28} />
        <Kid x={mix(2150, 1720, kidIn)} y={1240} s={1.25} t={t} look={-1} face={{wow: 1}} armL={mix(10, 150, ramp(t, cue(2) + 1.0, cue(2) + 1.6))} armR={10} hairStyle={1} shirt={C.pink} />
      </Stage>
    </AbsoluteFill>
  );
};
