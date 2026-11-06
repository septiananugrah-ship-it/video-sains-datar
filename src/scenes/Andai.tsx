import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, mix, ramp} from '../anim';
import {Kid, Stage, Tag, drift} from '../components/flat';
import {LAKE_FISH_Y, Lake} from '../components/sets';
import {useScene} from '../SceneContext';
import {C} from '../theme';

const ICE_Y = 520;
const BED = 1050;

/** Skenario "andai es tenggelam": es menumpuk dari dasar danau sampai ikan terperangkap. */
export const Andai: React.FC = () => {
  const {t, cue} = useScene();
  const cam = drift(t, cue(2) + 3, {s: 1.0, x: 0, y: -10}, {s: 1.1, x: -30, y: 40});
  // tebal es dasar: tiga lapis bertahap (baris 1), lalu penuh (baris 2)
  const layer = (k: number) => ramp(t, cue(1) + 0.6 + k * 1.1, cue(1) + 1.4 + k * 1.1, EASE_IN_OUT);
  const full = ramp(t, cue(2) + 0.6, cue(2) + 3.4, EASE_IN_OUT);
  const thick = (layer(0) + layer(1) + layer(2)) * 90 + full * (BED - ICE_Y - 270);
  const top = BED - thick;
  // waktu efektif ikan: melambat lalu berhenti saat permukaan es dasar melewati badannya
  const fishTime = (i: number) => {
    const y = LAKE_FISH_Y[i] + 30;
    let tt = t;
    // cari kapan es mencapai ikan (pindai mundur 0,05 dtk)
    if (top < y) {
      let s = t;
      for (let k = 0; k < 400 && s > 0; k++) {
        s -= 0.05;
        const th = (ramp(s, cue(1) + 0.6, cue(1) + 1.4, EASE_IN_OUT) + ramp(s, cue(1) + 1.7, cue(1) + 2.5, EASE_IN_OUT) + ramp(s, cue(1) + 2.8, cue(1) + 3.6, EASE_IN_OUT)) * 90 + ramp(s, cue(2) + 0.6, cue(2) + 3.4, EASE_IN_OUT) * (BED - ICE_Y - 270);
        if (BED - th >= y) break;
      }
      tt = s + Math.min(0.4, (t - s) * 0.5); // berhenti mulus
    }
    return tt;
  };
  const sad = ramp(t, cue(2) + 1.5, cue(2) + 2.2);
  const what = ramp(t, cue(0) + 0.3, cue(0) + 0.9);
  return (
    <AbsoluteFill>
      <Stage bg="#cfe9f7">
        <Lake cam={cam} t={t} ice={0} iceY={ICE_Y} bottomIce={thick} fishTime={fishTime}>
          <Kid x={260} y={ICE_Y - 6} s={0.8} t={t} look={0.6} face={{neutral: 1 - sad, sad}} armL={10} armR={mix(10, 40, sad)} scarf />
          <Tag x={1380} y={top - 50} text="es menumpuk dari dasar ↑" color={C.deep} o={layer(0) * (1 - full)} size={32} />
          <Tag x={1100} y={700} text="ikan terperangkap!" color="#fff" bg={C.red} o={ramp(t, cue(2) + 2.4, cue(2) + 3.0)} size={36} />
        </Lake>
        {/* bingkai "andai-andai": tepi bergaris putus & label */}
        <rect x={24} y={24} width={1872} height={1032} rx={40} fill="none" stroke="#fff" strokeWidth={10} strokeDasharray="40 26" opacity={what * 0.9} />
        <Tag x={960} y={95} text="ANDAI es tenggelam…" color="#fff" bg={C.purple} o={what} size={44} />
      </Stage>
    </AbsoluteFill>
  );
};
