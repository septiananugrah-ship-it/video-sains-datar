import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, mix, rand, ramp} from '../anim';
import {Bubble, Layer, Shadow, Stage, Tag, drift} from '../components/flat';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Botol kaca (titik dasar di tengah)
const B = {x: 960, y: 820, w: 230, h: 380, neck: 70, neckH: 120};

const bottlePath = () => {
  const {x, y, w, h, neck, neckH} = B;
  const sh = y - h; // bahu
  return `M${x - w / 2},${y - 20} Q${x - w / 2},${y} ${x - w / 2 + 20},${y} L${x + w / 2 - 20},${y} Q${x + w / 2},${y} ${x + w / 2},${y - 20} L${x + w / 2},${sh + 40} Q${x + w / 2},${sh - 10} ${x + neck / 2},${sh - 50} L${x + neck / 2},${sh - neckH} L${x - neck / 2},${sh - neckH} L${x - neck / 2},${sh - 50} Q${x - w / 2},${sh - 10} ${x - w / 2},${sh + 40} Z`;
};

/** Retakan zigzag yang "tumbuh" (stroke-dash) dari titik awal. */
const Crack: React.FC<{pts: [number, number][]; p: number}> = ({pts, p}) => {
  let len = 0;
  for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return (
    <path
      d={pts.map((q, i) => `${i ? 'L' : 'M'}${q[0]},${q[1]}`).join(' ')}
      fill="none"
      stroke="#fff"
      strokeWidth={6}
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeDasharray={`${len} ${len}`}
      strokeDashoffset={len * (1 - p)}
    />
  );
};

export const Botol: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const cam0 = drift(t, cue(1), {s: 1.0, x: 0, y: 0}, {s: 1.12, x: 0, y: -30});
  // getaran kamera saat botol retak (meluruh halus)
  const tCrack = wordOf(1, 'retak') - 0.1;
  const k = Math.max(0, t - tCrack);
  const shake = t > tCrack ? 9 * Math.exp(-k * 5) * Math.sin(k * 55) : 0;
  const cam = {...cam0, x: cam0.x + shake};
  // pintu freezer menutup → membeku → mengembang
  const fill = ramp(t, cue(0) + 0.6, cue(0) + 2.0, EASE_IN_OUT);
  const freeze = ramp(t, cue(1) - 0.4, cue(1) + 1.6, EASE_IN_OUT);
  const crack = ramp(t, tCrack, tCrack + 0.5);
  const sh = B.y - B.h;
  // permukaan air: penuh sampai leher; saat membeku, volume +9 % mendorong permukaan naik di leher
  const levelLiquid = mix(B.y, sh - 70, fill);
  const levelIce = sh - 70 - freeze * 45;
  const level = freeze > 0 ? levelIce : levelLiquid;
  const iceIn = (B.w / 2) * (1 - freeze); // tepi es merambat dari dinding ke tengah
  return (
    <AbsoluteFill>
      <Stage bg="#d6eef9">
        <Layer cam={cam} depth={0.4}>
          {/* dinding dalam freezer */}
          <rect x={-300} y={-300} width={2520} height={1700} fill="#d6eef9" />
          <rect x={300} y={60} width={1320} height={960} rx={40} fill="#eaf7fd" />
          {Array.from({length: 30}, (_, i) => (
            <circle key={i} cx={320 + rand(i * 2.1) * 1280} cy={80 + rand(i * 3.7) * 900} r={3 + rand(i) * 4} fill="#fff" opacity={0.8} />
          ))}
          {/* rak kawat */}
          <rect x={300} y={330} width={1320} height={12} rx={6} fill="#c3dbe8" />
          {Array.from({length: 12}, (_, i) => (
            <line key={i} x1={340 + i * 110} y1={330} x2={340 + i * 110} y2={342} stroke="#a9c7d8" strokeWidth={6} />
          ))}
          {/* isi rak: wadah es & kantong kacang polong */}
          <rect x={420} y={250} width={260} height={80} rx={14} fill="#fff" />
          {Array.from({length: 6}, (_, i) => (
            <rect key={i} x={436 + (i % 3) * 80} y={262 + Math.floor(i / 3) * 30} width={66} height={24} rx={6} fill={C.ice2} />
          ))}
          <path d="M1240,330 Q1230,230 1290,210 L1450,215 Q1500,240 1480,330 Z" fill={C.green} />
          <text x={1360} y={290} textAnchor="middle" fontFamily={FONT.sans} fontWeight={800} fontSize={30} fill="#fff">
            KACANG
          </text>
          <Tag x={1480} y={150} text="−18 °C" size={40} />
          {/* bunga es di tepi */}
          <path d="M300,1020 Q420,940 540,1020 Z M1380,1020 Q1500,950 1620,1020 Z" fill="#fff" opacity={0.9} />
        </Layer>
        <Layer cam={cam} depth={1}>
          <Shadow x={B.x + 18} y={B.y + 6} w={300} h={30} />
          <clipPath id="bottle-in">
            <path d={bottlePath()} />
          </clipPath>
          <path d={bottlePath()} fill="#ffffff" opacity={0.45} />
          <g clipPath="url(#bottle-in)">
            {/* air cair */}
            <rect x={B.x - B.w} y={level} width={B.w * 2} height={1000} fill={C.water} />
            {/* es merambat dari dinding ke tengah */}
            <g opacity={Math.min(1, freeze * 3)}>
              <rect x={B.x - B.w} y={level} width={B.w - iceIn} height={1000} fill={C.ice2} />
              <rect x={B.x + iceIn} y={level} width={B.w} height={1000} fill={C.ice2} />
              <rect x={B.x - B.w} y={level} width={B.w * 2} height={18} fill="#fff" opacity={0.9} />
              {Array.from({length: 9}, (_, i) => (
                <path key={i} d={`M${B.x - 90 + (i % 3) * 80},${level + 80 + Math.floor(i / 3) * 110} l14,-14 l14,14 l-14,14 Z`} fill="#fff" opacity={0.7 * freeze} />
              ))}
            </g>
          </g>
          <path d={bottlePath()} fill="none" stroke="#fff" strokeWidth={7} opacity={0.9} strokeLinejoin="round" />
          <path d={`M${B.x - B.w / 2 + 26},${B.y - 40} L${B.x - B.w / 2 + 26},${sh + 50}`} stroke="#fff" strokeWidth={12} strokeLinecap="round" opacity={0.6} />
          {/* tutup botol terdorong ke atas */}
          <rect x={B.x - B.neck / 2 - 8} y={sh - B.neckH - 40 - crack * 34} width={B.neck + 16} height={46} rx={10} fill={C.red} transform={`rotate(${crack * -14} ${B.x} ${sh - B.neckH})`} />
          {/* retakan */}
          <g opacity={crack > 0 ? 1 : 0}>
            <Crack p={crack} pts={[[B.x - 30, sh + 30], [B.x - 60, sh + 110], [B.x - 20, sh + 170], [B.x - 70, sh + 260], [B.x - 40, sh + 320]]} />
            <Crack p={ramp(t, tCrack + 0.1, tCrack + 0.6)} pts={[[B.x + 50, sh + 80], [B.x + 80, sh + 160], [B.x + 40, sh + 220], [B.x + 90, sh + 300]]} />
            <Crack p={ramp(t, tCrack + 0.2, tCrack + 0.7)} pts={[[B.x - 60, sh + 110], [B.x - 105, sh + 140]]} />
          </g>
        </Layer>
        <Bubble x={1330} y={420} text="KRAK!" p={ramp(t, tCrack + 0.05, tCrack + 0.35)} tail="left" w={260} size={54} />
        <Tag x={560} y={520} text="air penuh sampai leher" o={ramp(t, cue(0) + 1.6, cue(0) + 2.2) * (1 - freeze)} size={32} />
        <Tag x={560} y={520} text="membeku → mengembang ≈ 9 %" color={C.deep} o={ramp(t, cue(1) + 0.4, cue(1) + 1.0)} size={32} />
      </Stage>
    </AbsoluteFill>
  );
};
