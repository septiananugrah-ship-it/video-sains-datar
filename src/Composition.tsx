import {Audio} from '@remotion/media';
import React from 'react';
import {AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {EASE_IN_OUT} from './anim';
import {Captions} from './components/Captions';
import {POST, PRE, SceneProvider, useScene} from './SceneContext';
import {SCENES} from './scenes';
import {type VideoProps, defaultVideoProps} from './defaults.ts';
import {FPS, TIMELINE, lineKey, type TScene} from './timeline.ts';
import {C} from './theme';

export {defaultVideoProps, type VideoProps};

// Lama sapuan transisi (detik). Panel menutup layar penuh di sekitar batas adegan,
// adegan lama/baru berganti di balik panel (tidak pernah terlihat bertumpuk).
const WIPE = 0.9;

const SceneShell: React.FC<{children: React.ReactNode; first: boolean; last: boolean}> = ({children, first, last}) => {
  const {t, dur} = useScene();
  const visible = (first || t >= 0) && (last || t < dur);
  if (!visible) return null;
  return <AbsoluteFill>{children}</AbsoluteFill>;
};

const SceneSlot: React.FC<{scene: TScene}> = ({scene}) => {
  const Comp = SCENES[scene.id];
  const pre = scene.index === 0 ? 0 : PRE;
  const from = Math.round((scene.start - pre) * FPS);
  const isLast = scene.index === TIMELINE.scenes.length - 1;
  const duration = Math.round((scene.duration + pre + (isLast ? 0 : POST)) * FPS);
  if (!Comp) return null;
  return (
    <Sequence name={scene.title} from={from} durationInFrames={duration}>
      <SceneProvider scene={scene} pre={pre}>
        <SceneShell first={scene.index === 0} last={isLast}>
          <Comp />
        </SceneShell>
      </SceneProvider>
    </Sequence>
  );
};

const WIPE_COLORS = [
  [C.yellow, C.shirt, C.pink],
  [C.shirt, C.purple, C.yellow],
  [C.pink, C.yellow, C.green],
  [C.purple, C.green, C.orange],
];

/** Sapuan tiga panel warna pastel (kanan → kiri) di pergantian babak (adegan bertanda trans: 'wipe'); selebihnya potong langsung. */
const Wipe: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const k = TIMELINE.scenes.slice(1).findIndex((s) => s.trans === 'wipe' && Math.abs(t - s.start) < WIPE / 2 + 0.25);
  if (k < 0) return null;
  const b = TIMELINE.scenes[k + 1].start;
  const nth = TIMELINE.scenes.slice(1, k + 2).filter((s) => s.trans === 'wipe').length - 1;
  const cols = WIPE_COLORS[nth % WIPE_COLORS.length];
  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      {cols.map((col, i) => {
        // tiap panel: masuk dari kanan, menutup penuh di b, keluar ke kiri
        // panel bawah (i = 0) menutup penuh tepat di b; panel atas menyusul 0,07 dtk kemudian
        const p = (t - (b - WIPE / 2) - i * 0.07) / WIPE;
        const q = Math.min(1, Math.max(0, p));
        const x = q < 0.5 ? 1 - EASE_IN_OUT(q * 2) : -EASE_IN_OUT((q - 0.5) * 2);
        // panel menutup layar penuh saat |t − b| kecil
        return <AbsoluteFill key={i} style={{background: col, translate: `${(x * 2050).toFixed(1)}px 0px`, zIndex: i}} />;
      })}
    </AbsoluteFill>
  );
};

const MusicFade: React.FC<{volume: number}> = ({volume}) => {
  const {durationInFrames} = useVideoConfig();
  useCurrentFrame();
  return <Audio src={staticFile('music.mp3')} volume={(f) => volume * Math.min(1, f / 30) * Math.min(1, (durationInFrames - f) / 60)} />;
};

export const SainsDatar: React.FC<VideoProps> = ({showCaptions, musicVolume, voiceover}) => (
  <AbsoluteFill style={{backgroundColor: C.paper}}>
    {TIMELINE.scenes.map((s) => (
      <SceneSlot key={s.id} scene={s} />
    ))}
    <Wipe />
    {showCaptions ? <Captions /> : null}
    {musicVolume > 0 ? <MusicFade volume={musicVolume} /> : null}
    {voiceover
      ? TIMELINE.scenes.flatMap((s) =>
          s.tLines.map((l) => (
            <Sequence key={lineKey(s.id, l.index)} name={`VO ${lineKey(s.id, l.index)}`} from={Math.round(l.start * FPS)} layout="none">
              <Audio src={staticFile(`voiceover/${lineKey(s.id, l.index)}.mp3`)} />
            </Sequence>
          )),
        )
      : null}
  </AbsoluteFill>
);

/** Versi 2K (2560×1440): film 1920×1080 diperbesar sebagai vektor. */
export const SainsDatar2K: React.FC<VideoProps> = (props) => (
  <AbsoluteFill style={{backgroundColor: C.paper}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${2560 / 1920})`, transformOrigin: '0 0'}}>
      <SainsDatar {...props} />
    </div>
  </AbsoluteFill>
);

/** Pratinjau satu adegan (folder "Adegan" di Studio). */
export const SingleScene: React.FC<{sceneId: string}> = ({sceneId}) => {
  const scene = TIMELINE.scenes.find((s) => s.id === sceneId)!;
  return (
    <AbsoluteFill style={{backgroundColor: C.paper}}>
      <Sequence from={-Math.round(scene.start * FPS)} layout="absolute-fill">
        <SceneSlot scene={scene} />
        <Captions />
      </Sequence>
    </AbsoluteFill>
  );
};
