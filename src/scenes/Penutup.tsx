import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, mix, ramp} from '../anim';
import {Bubble, Glass, HBond, IceCube, Kid, Stage, Tag, WaterMol, Zoomer, drift} from '../components/flat';
import {Kitchen} from '../components/sets';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// satu cincin segi enam es: tiap molekul menggandeng tetangga berikutnya (H₁), H₂ menunjuk ke luar cincin
const RING = Array.from({length: 6}, (_, i) => {
  const a = -90 + i * 60;
  const x = 1330 + 120 * Math.cos((a * Math.PI) / 180);
  const y = 380 + 120 * Math.sin((a * Math.PI) / 180);
  const an = -90 + (i + 1) * 60;
  const nx = 1330 + 120 * Math.cos((an * Math.PI) / 180);
  const ny = 380 + 120 * Math.sin((an * Math.PI) / 180);
  const h1 = (Math.atan2(ny - y, nx - x) * 180) / Math.PI;
  return {x, y, h1, h2: h1 - 104.5};
});

export const Tutup: React.FC = () => {
  const {t, cue, cueEnd, dur, wordOf} = useScene();
  const cam = drift(t, dur, {s: 1.02, x: -20, y: 0}, {s: 1.12, x: 60, y: -10});
  const zoomP = ramp(t, wordOf(0, 'molekul') - 0.3, wordOf(0, 'molekul') + 0.4) * (1 - ramp(t, cue(1) - 0.3, cue(1) + 0.1));
  const ask = ramp(t, wordOf(1, 'pipa') - 0.3, wordOf(1, 'pipa') + 0.2);
  const komen = ramp(t, wordOf(1, 'komentar') - 0.3, wordOf(1, 'komentar') + 0.3);
  const brand = ramp(t, cueEnd(1) + 0.4, cueEnd(1) + 1.2);
  const lift = ramp(t, cue(0) + 0.4, cue(0) + 1.4, EASE_IN_OUT);
  const cupX = 940;
  const cupY = 690;
  return (
    <AbsoluteFill>
      <Stage bg={C.wall}>
        <Kitchen
          cam={cam}
          t={t}
          mid={<Kid x={720} y={1010} s={1.3} t={t} look={0.5} face={{happy: 1 - ask, think: ask}} armL={mix(12, 30, ask)} armR={mix(10, 40, lift)} phase={1.2} />}
        >
          <Glass id="tutup" x={cupX} y={cupY + 62} w={190} h={240} level={0.7} t={t}>
            <IceCube x={cupX - 20} y={cupY + 62 - 240 * 0.7 + 22 + 3 * Math.sin(t * 1.8)} s={0.6} rot={-10 + 4 * Math.sin(t * 1.3)} />
            <IceCube x={cupX + 40} y={cupY + 62 - 240 * 0.7 + 20 + 3 * Math.sin(t * 1.5 + 1)} s={0.55} rot={14} />
            <rect x={cupX - 200} y={cupY + 62 - 240 * 0.7} width={400} height={300} fill={C.water} opacity={0.35} />
          </Glass>
        </Kitchen>
        <Zoomer x={1330} y={380} r={250} p={zoomP} id="tutup" fromX={cupX + 20} fromY={cupY - 90}>
          <rect x={1060} y={110} width={540} height={540} fill={C.ice} />
          {RING.map((m, i) => {
            const n = RING[(i + 1) % 6];
            const hx = m.x + 30 * 1.06 * Math.cos((m.h1 * Math.PI) / 180);
            const hy = m.y + 30 * 1.06 * Math.sin((m.h1 * Math.PI) / 180);
            const d = Math.hypot(n.x - hx, n.y - hy);
            return <HBond key={i} x1={hx} y1={hy} x2={n.x - ((n.x - hx) / d) * 30} y2={n.y - ((n.y - hy) / d) * 30} o={0.95} w={6} />;
          })}
          {RING.map((m, i) => (
            <WaterMol key={i} x={m.x} y={m.y + 3 * Math.sin(t * 2 + i)} r={30} rot={m.h1} t={t} phase={i * 0.4} happy={1} hAngles={[m.h1, m.h2]} />
          ))}
        </Zoomer>
        <Bubble x={1340} y={330} text={'KENAPA PIPA AIR\nBISA PECAH?'} p={ask} tail="left" w={520} size={50} />
        <Tag x={1340} y={520} text="tulis jawabanmu di komentar ↓" color={C.shirt2} o={komen} size={36} />
      </Stage>
      {/* penanda kanal */}
      <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', paddingTop: 70, opacity: brand}}>
        <div
          style={{
            fontFamily: FONT.sans,
            background: '#fff',
            borderRadius: 60,
            padding: '16px 40px 18px',
            boxShadow: '6px 8px 0 rgba(43,45,66,0.16)',
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            translate: `0px ${(1 - brand) * -20}px`,
          }}
        >
          <div style={{width: 60, height: 60, borderRadius: 30, background: C.shirt, color: '#fff', fontWeight: 800, fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>S</div>
          <div>
            <div style={{fontWeight: 800, fontSize: 40, color: C.ink, letterSpacing: 4}}>SCIENTIAN</div>
            <div style={{fontWeight: 600, fontSize: 24, color: C.ink2}}>Explore Science with Yayan</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
