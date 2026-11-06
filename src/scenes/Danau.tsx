import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, mix, ramp} from '../anim';
import {Kid, Stage, Tag, drift} from '../components/flat';
import {Lake} from '../components/sets';
import {useScene} from '../SceneContext';
import {C} from '../theme';

const ICE_Y = 520;

export const Selamat: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  // kamera: lebar (musim dingin) → turun ke bawah es, ke ikan
  const c0 = drift(t, cue(1), {s: 1.0, x: 0, y: -40}, {s: 1.06, x: 40, y: -20});
  const down = ramp(t, cue(1) - 0.2, cue(1) + 2.0, EASE_IN_OUT);
  const cam = {s: mix(c0.s, 1.25, down), x: mix(c0.x, 80, down), y: mix(c0.y, 230, down)};
  const tIce = wordOf(0, 'membeku');
  const ice = ramp(t, tIce - 0.3, tIce + 1.4, EASE_IN_OUT);
  const kidIn = ramp(t, tIce + 0.8, tIce + 2.8, EASE_IN_OUT);
  const glide = mix(2250, 1380, kidIn) + 30 * Math.sin(t * 0.8) * kidIn;
  const tag0 = ramp(t, wordOf(0, 'selimut') - 0.2, wordOf(0, 'selimut') + 0.4);
  const tag4 = ramp(t, wordOf(1, 'empat') - 0.2, wordOf(1, 'empat') + 0.4);
  const happyFish = ramp(t, wordOf(1, 'ikan') - 0.2, wordOf(1, 'ikan') + 0.4);
  return (
    <AbsoluteFill>
      <Stage bg="#cfe9f7">
        <Lake cam={cam} t={t} ice={ice} iceY={ICE_Y}>
          {/* anak bermain seluncur di atas es */}
          <g opacity={kidIn > 0.001 ? 1 : 0}>
            <Kid x={glide} y={ICE_Y + 2} s={0.85} t={t} look={-0.6} face={{happy: 1}} armL={70 + 10 * Math.sin(t * 1.6)} armR={60 - 10 * Math.sin(t * 1.6)} scarf />
          </g>
          {/* termometer kecil: 0 °C di dekat es, 4 °C di dasar */}
          <Tag x={420} y={ICE_Y + 120} text="es = selimut · ≈ 0 °C" o={tag0} size={34} />
          <Tag x={760} y={990} text="≈ 4 °C di dasar · air tetap cair" o={tag4} size={36} color={C.deep} />
        </Lake>
        <Tag x={960} y={90} text="danau membeku dari atas ✓" o={ramp(t, tIce, tIce + 0.6) * (1 - down)} size={40} />
        <Tag x={1400} y={720} text="aman sampai musim semi ♥" color={C.shirt2} o={happyFish} size={34} />
      </Stage>
    </AbsoluteFill>
  );
};
