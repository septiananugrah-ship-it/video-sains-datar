import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, mix, ramp} from '../anim';
import {BigTitle, Bubble, Glass, IceCube, Kid, Stage, Tag} from '../components/flat';
import {Lab} from '../components/sets';
import {useScene} from '../SceneContext';
import {C} from '../theme';

const WAX = '#ffe39a';
const WAX2 = '#ffc94d';
const SOLID = '#fff4cf';
const L = {x: 640, y: 772, w: 270, h: 330, level: 0.72};
const R = {x: 1290, y: 772, w: 270, h: 330, level: 0.72};
const surf = (g: typeof L) => g.y - g.h * g.level;

export const Aneh: React.FC = () => {
  const {t, cue, cueEnd, wordOf} = useScene();
  // kamera: dekat gelas es (baris 0) → gelas lilin (baris 1) → kembali ke es (baris 2)
  const toL = ramp(t, cue(1) - 0.3, cue(1) + 1.1, EASE_IN_OUT);
  const toR = ramp(t, cue(2) - 0.3, cue(2) + 1.0, EASE_IN_OUT);
  const cam = {s: 1.14 + 0.02 * Math.sin(t * 0.3), x: mix(mix(250, -230, toL), 250, toR), y: -30};
  // potongan lilin padat jatuh lalu tenggelam pelan ke dasar
  const tDrop = wordOf(1, 'membeku');
  const drop = ramp(t, tDrop, tDrop + 0.5, (x) => x * x);
  const sink = ramp(t, tDrop + 0.5, tDrop + 2.6, EASE_IN_OUT);
  const chunkY = mix(mix(surf(L) - 220, surf(L) + 10, drop), L.y - 52, sink);
  const alert = ramp(t, cue(2) + 0.4, cue(2) + 1.0);
  const kidIn = ramp(t, cue(0) + 0.2, cue(0) + 1.2, EASE_IN_OUT) * (1 - ramp(t, cue(1) - 0.4, cue(1) + 0.4, EASE_IN_OUT)) + ramp(t, cue(2) + 0.1, cue(2) + 1.0, EASE_IN_OUT);
  const titleP = ramp(t, cueEnd(2) + 0.25, cueEnd(2) + 1.1);
  const dim = ramp(t, cueEnd(2) + 0.1, cueEnd(2) + 0.7);
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
            <g transform={`translate(${L.x + 10} ${chunkY}) rotate(-8)`} opacity={ramp(t, tDrop - 0.35, tDrop - 0.05)}>
              <rect x={-58} y={-40} width={116} height={80} rx={18} fill={SOLID} />
            </g>
          ) : null}
          <Tag x={L.x} y={L.y - L.h - 40} text="lilin cair + lilin padat" o={ramp(t, cue(1) + 0.2, cue(1) + 0.8)} size={30} />
          <Tag x={L.x - 230} y={L.y - 70} text="tenggelam ↓" color={C.red} o={ramp(t, tDrop + 2.2, tDrop + 2.7)} size={28} />
          {/* gelas kanan: air + es */}
          <Glass id="air" x={R.x} y={R.y} w={R.w} h={R.h} level={R.level} t={t}>
            <IceCube x={R.x - 30} y={surf(R) + 28 + 3 * Math.sin(t * 1.8)} s={0.82} rot={-12 + 4 * Math.sin(t * 1.2)} />
            <IceCube x={R.x + 52} y={surf(R) + 26 + 3 * Math.sin(t * 1.5 + 1)} s={0.7} rot={18 + 3 * Math.sin(t * 1.3)} />
            <rect x={R.x - R.w} y={surf(R) + 2 * Math.sin(t * 2.2)} width={R.w * 2} height={R.h} fill={C.water} opacity={0.35} />
          </Glass>
          <Tag x={R.x} y={R.y - R.h - 40} text="air + es" o={ramp(t, cue(0) + 0.2, cue(0) + 0.8)} size={30} />
          <Tag x={R.x + 250} y={surf(R) + 40} text="mengapung ↑" color={C.shirt2} o={ramp(t, cue(0) + 1.0, cue(0) + 1.5) * Math.max(1 - toL, toR)} size={28} />
          <Tag x={R.x} y={R.y - R.h - 120} text="air: kebalikannya!" color="#fff" bg={C.red} o={alert} size={34} />
        </Lab>
        <Kid x={mix(2150, 1720, kidIn)} y={1240} s={1.25} t={t} look={-1} face={{think: 1 - alert, wow: alert}} armL={mix(10, 150, ramp(t, cue(2) + 0.8, cue(2) + 1.4))} armR={10} hairStyle={1} shirt={C.pink} />
        <Bubble x={1480} y={600} text={'KOK\nBISA?'} p={ramp(t, cue(0) + 1.4, cue(0) + 1.8) * (1 - ramp(t, cue(1) - 0.4, cue(1)))} tail="right" w={240} />
        <rect x={0} y={0} width={1920} height={1080} fill={C.ink} opacity={0.35 * dim} />
      </Stage>
      <BigTitle p={titleP} lines={['Kenapa Es Batu', 'Mengapung?']} sub="padahal sama-sama air" />
    </AbsoluteFill>
  );
};
