import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, mix, ramp} from '../anim';
import {BigTitle, Bubble, Bubbles, Glass, IceCube, Kid, Stage, drift} from '../components/flat';
import {Kitchen} from '../components/sets';
import {useScene} from '../SceneContext';
import {C} from '../theme';

// Gelas di atas meja dapur
const G = {x: 1090, y: 752, w: 210, h: 270, level: 0.7};
const SURF = G.y - G.h * G.level;
const SIDE = 64; // sisi es (px)
const FLOAT_Y = SURF + SIDE * 0.4; // ±90 % terendam

/** Posisi es: dipegang → jatuh (gravitasi) → menyelam sejenak → memantul dan mengapung. */
const icePos = (t: number, t0: number) => {
  const hand = {x: 898, y: 452};
  if (t < t0) return {x: hand.x, y: hand.y, rot: 0, inGlass: false, splash: -1};
  const tau = t - t0;
  const tFall = 0.62;
  if (tau < tFall) {
    const p = tau / tFall;
    return {x: mix(hand.x, G.x - 6, p), y: hand.y + (FLOAT_Y - hand.y) * p * p, rot: 40 * p, inGlass: p > 0.55, splash: -1};
  }
  const u = tau - tFall;
  const dip = 70 * Math.sin(4.4 * u) * Math.exp(-2.3 * u);
  return {x: G.x - 6 + 6 * Math.sin(u * 1.3) * Math.min(1, u), y: FLOAT_Y + dip + 3 * Math.sin(u * 2.1), rot: 40 + 8 * Math.sin(u * 1.7) * Math.exp(-0.5 * u), inGlass: true, splash: u};
};

export const Hook: React.FC = () => {
  const {t, cue, cueEnd} = useScene();
  const t0 = cue(0) + 2.2;
  const ice = icePos(t, t0);
  // kamera: lebar → mendorong ke gelas saat pertanyaan muncul
  const c1 = drift(t, cue(2), {s: 1.0, x: 0, y: 0}, {s: 1.08, x: 40, y: 0});
  const push = ramp(t, cue(2) - 0.2, cue(2) + 2.2, EASE_IN_OUT);
  const cam = {s: mix(c1.s, 1.45, push), x: mix(c1.x, G.x - 960 - 60, push), y: mix(c1.y, SURF - 540 + 40, push)};
  const wow = ramp(t, cue(1) + 0.1, cue(1) + 0.6);
  const think = ramp(t, cue(2) + 0.6, cue(2) + 1.2);
  const armR = t < t0 ? mix(10, 132, ramp(t, cue(0) + 0.5, cue(0) + 1.7)) : mix(132, 20, ramp(t, t0 + 0.3, t0 + 1.3));
  const titleP = ramp(t, cueEnd(2) + 0.25, cueEnd(2) + 1.1);
  const dim = ramp(t, cueEnd(2) + 0.1, cueEnd(2) + 0.7);
  const splash = ice.splash;
  return (
    <AbsoluteFill>
      <Stage bg={C.wall}>
        <Kitchen
          cam={cam}
          t={t}
          mid={
            <Kid
              x={720}
              y={880}
              s={1.3}
              t={t}
              look={mix(0.6, 1, wow)}
              face={{neutral: (1 - wow) * (1 - think), happy: 0, wow: wow * (1 - think), think}}
              armL={mix(8, 30, think)}
              armR={armR}
            />
          }
        >
          <Glass id="hook" x={G.x} y={G.y} w={G.w} h={G.h} level={G.level} t={t}>
            <Bubbles x={G.x} y0={G.y - 20} y1={SURF + 10} w={G.w * 0.6} t={t} />
            {ice.inGlass ? (
              <g>
                <IceCube x={ice.x} y={ice.y} s={SIDE / 92} rot={ice.rot} />
                <IceCube x={G.x + 48} y={FLOAT_Y + 4 + 3 * Math.sin(t * 1.9)} s={SIDE / 92} rot={-14 + 3 * Math.sin(t * 1.4)} />
                {/* bagian es di bawah air tampak kebiruan */}
                <rect x={G.x - G.w} y={SURF + 2 * Math.sin(t * 2.2)} width={G.w * 2} height={G.h} fill={C.water} opacity={0.35} />
              </g>
            ) : (
              <g>
                <IceCube x={G.x + 48} y={FLOAT_Y + 4 + 3 * Math.sin(t * 1.9)} s={SIDE / 92} rot={-14 + 3 * Math.sin(t * 1.4)} />
                <rect x={G.x - G.w} y={SURF + 2 * Math.sin(t * 2.2)} width={G.w * 2} height={G.h} fill={C.water} opacity={0.35} />
              </g>
            )}
          </Glass>
          {/* es di tangan / sedang jatuh (di luar gelas) */}
          {!ice.inGlass ? <IceCube x={ice.x} y={ice.y} s={SIDE / 92} rot={ice.rot} /> : null}
          {/* cipratan */}
          {splash >= 0 && splash < 0.8
            ? Array.from({length: 7}, (_, i) => {
                const a = (-150 + i * 20) * (Math.PI / 180);
                const v = 260 + (i % 3) * 60;
                const x = G.x + Math.cos(a) * v * splash;
                const y = SURF - 10 + Math.sin(a) * v * splash + 900 * splash * splash;
                return <circle key={i} cx={x} cy={y} r={9 - i % 3 * 2} fill={C.water} opacity={1 - splash / 0.8} />;
              })
            : null}
        </Kitchen>
        <Bubble x={420} y={300} text={'LHO,\nNGAMBANG?'} p={ramp(t, cue(1) + 0.5, cue(1) + 0.9) * (1 - ramp(t, cue(2) + 0.2, cue(2) + 0.5))} tail="right" w={330} />
        <rect x={0} y={0} width={1920} height={1080} fill={C.ink} opacity={0.35 * dim} />
      </Stage>
      <BigTitle p={titleP} lines={['Kenapa Es Batu', 'Mengapung?']} sub="padahal sama-sama air" />
    </AbsoluteFill>
  );
};
