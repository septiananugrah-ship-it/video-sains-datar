import React from 'react';
import {mix, rand} from '../anim';
import {C, FONT} from '../theme';
import {type Cam, Layer, shade} from './flat';

// Latar ilustrasi datar berlapis. Setiap latar menerima kamera; lapisan jauh bergerak lebih sedikit.
// Semua ukuran melebihi layar agar dorongan/geseran kamera tidak memperlihatkan tepi.

const Cloud: React.FC<{x: number; y: number; s?: number; o?: number}> = ({x, y, s = 1, o = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity={o}>
    <ellipse cx={0} cy={0} rx={70} ry={34} />
    <ellipse cx={-50} cy={10} rx={46} ry={26} />
    <ellipse cx={56} cy={8} rx={52} ry={28} />
    <ellipse cx={10} cy={-22} rx={44} ry={30} />
  </g>
);

const Plant: React.FC<{x: number; y: number; s?: number; t: number; pot?: string}> = ({x, y, s = 1, t, pot = C.orange}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-38, -14, 10, 32].map((a, i) => (
      <ellipse
        key={i}
        cx={0}
        cy={-70}
        rx={20}
        ry={62}
        fill={i % 2 ? C.leaf : C.leaf2}
        transform={`rotate(${a + 3 * Math.sin(t * 1.2 + i)} 0 -10)`}
      />
    ))}
    <path d="M-40,-20 L40,-20 L30,40 L-30,40 Z" fill={pot} />
    <rect x={-46} y={-30} width={92} height={18} rx={6} fill={shade(pot, -0.12)} />
  </g>
);

/** Dapur siang hari: dinding krem, jendela berawan, rak, meja kayu, daun buram di depan. */
export const Kitchen: React.FC<{cam: Cam; t: number; children?: React.ReactNode; mid?: React.ReactNode; front?: boolean}> = ({cam, t, children, mid, front = true}) => (
  <>
    <Layer cam={cam} depth={0.35}>
      <rect x={-400} y={-300} width={2720} height={1700} fill={C.wall} />
      {/* ubin dinding belakang meja */}
      <g opacity={0.5}>
        {Array.from({length: 22}, (_, i) => (
          <line key={i} x1={-400 + i * 130} y1={560} x2={-400 + i * 130} y2={760} stroke={C.wall2} strokeWidth={4} />
        ))}
        <line x1={-400} y1={660} x2={2320} y2={660} stroke={C.wall2} strokeWidth={4} />
      </g>
      {/* jendela */}
      <g>
        <rect x={1180} y={130} width={560} height={400} rx={18} fill={C.white} />
        <rect x={1200} y={150} width={520} height={360} rx={10} fill={C.sky} />
        <circle cx={1600} cy={240} r={52} fill={C.yellow} />
        <circle cx={1600} cy={240} r={78} fill={C.yellow} opacity={0.25} />
        <g>
          <Cloud x={1250 + ((t * 14) % 600)} y={230} s={0.8} />
          <Cloud x={1150 + ((t * 9 + 300) % 600)} y={380} s={0.6} o={0.9} />
        </g>
        <rect x={1180} y={130} width={560} height={400} rx={18} fill="none" stroke={C.white} strokeWidth={20} />
        <rect x={1452} y={150} width={16} height={360} fill={C.white} />
        <rect x={1200} y={322} width={520} height={16} fill={C.white} />
        <rect x={1160} y={520} width={600} height={26} rx={10} fill={C.wall2} />
        <Plant x={1660} y={505} s={0.55} t={t} pot={C.pink} />
      </g>
      {/* rak & toples */}
      <g>
        <rect x={140} y={300} width={520} height={20} rx={8} fill={C.wood} />
        <rect x={180} y={210} width={70} height={90} rx={14} fill="#fff" opacity={0.85} />
        <rect x={180} y={240} width={70} height={60} rx={12} fill={C.orange} opacity={0.75} />
        <rect x={270} y={180} width={80} height={120} rx={16} fill="#fff" opacity={0.85} />
        <rect x={270} y={230} width={80} height={70} rx={14} fill={C.green} opacity={0.6} />
        <Plant x={480} y={290} s={0.6} t={t} pot={C.purple} />
        <circle cx={590} cy={250} r={44} fill={C.yellow} opacity={0.9} />
        <rect x={140} y={460} width={380} height={20} rx={8} fill={C.wood} />
        <rect x={170} y={380} width={120} height={80} rx={10} fill={C.red} opacity={0.85} />
        <rect x={180} y={392} width={100} height={18} rx={6} fill="#fff" opacity={0.7} />
        <rect x={310} y={370} width={60} height={90} rx={26} fill={C.shirt} opacity={0.8} />
      </g>
    </Layer>
    {/* tokoh di belakang meja */}
    {mid ? (
      <Layer cam={cam} depth={0.9}>
        {mid}
      </Layer>
    ) : null}
    {/* meja dapur */}
    <Layer cam={cam} depth={1}>
      <rect x={-300} y={760} width={2520} height={500} fill={C.wood2} />
      <rect x={-300} y={740} width={2520} height={44} rx={10} fill={C.wood} />
      <rect x={-300} y={784} width={2520} height={14} fill={shade(C.wood2, -0.15)} opacity={0.5} />
      {Array.from({length: 9}, (_, i) => (
        <g key={i}>
          <rect x={-240 + i * 300} y={830} width={270} height={300} rx={14} fill={shade(C.wood2, 0.08)} />
          <rect x={-240 + i * 300 + 110} y={860} width={50} height={12} rx={6} fill={C.wall2} />
        </g>
      ))}
      {children}
    </Layer>
    {front ? (
      <Layer cam={cam} depth={1.5} blur="near">
        <Plant x={-30} y={1180} s={1.9} t={t} pot={C.orange} />
        <Plant x={2000} y={1220} s={1.6} t={t + 2} pot={C.purple} />
      </Layer>
    ) : null}
  </>
);

/** Meja lab pastel dengan rak labu kimia. */
export const Lab: React.FC<{cam: Cam; t: number; children?: React.ReactNode}> = ({cam, t, children}) => (
  <>
    <Layer cam={cam} depth={0.35}>
      <rect x={-400} y={-300} width={2720} height={1700} fill="#dff1ef" />
      <g opacity={0.45}>
        {Array.from({length: 24}, (_, i) => (
          <line key={i} x1={-400 + i * 120} y1={-300} x2={-400 + i * 120} y2={760} stroke="#c4e4e0" strokeWidth={3} />
        ))}
        {Array.from({length: 10}, (_, i) => (
          <line key={i} x1={-400} y1={-300 + i * 120} x2={2320} y2={-300 + i * 120} stroke="#c4e4e0" strokeWidth={3} />
        ))}
      </g>
      <rect x={120} y={330} width={640} height={22} rx={8} fill={C.wood} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${190 + i * 150} 330)`}>
          <path d="M-22,-110 L22,-110 L22,-70 L56,0 L-56,0 L-22,-70 Z" fill="#fff" opacity={0.9} />
          <path d={`M-40,-30 L40,-30 L56,0 L-56,0 Z`} fill={[C.pink, C.yellow, C.green, C.purple][i]} opacity={0.75} />
        </g>
      ))}
      <rect x={1380} y={90} width={420} height={250} rx={20} fill="#fff" />
      <text x={1590} y={160} textAnchor="middle" fontFamily={FONT.sans} fontWeight={800} fontSize={40} fill={C.ink}>
        PADAT vs CAIR
      </text>
      <g stroke={C.ink2} strokeWidth={4} opacity={0.6}>
        <line x1={1430} y1={210} x2={1750} y2={210} />
        <line x1={1430} y1={260} x2={1700} y2={260} />
        <line x1={1430} y1={305} x2={1730} y2={305} />
      </g>
    </Layer>
    <Layer cam={cam} depth={1}>
      <rect x={-300} y={780} width={2520} height={500} fill="#9fb4c7" />
      <rect x={-300} y={760} width={2520} height={40} rx={10} fill="#c9d6e2" />
      {children}
    </Layer>
    <Layer cam={cam} depth={1.5} blur="near">
      <g transform="translate(1900 1120) scale(2)">
        <path d="M-22,-110 L22,-110 L22,-70 L56,0 L-56,0 L-22,-70 Z" fill="#fff" opacity={0.9} />
        <path d="M-40,-30 L40,-30 L56,0 L-56,0 Z" fill={C.shirt} opacity={0.75} />
      </g>
    </Layer>
  </>
);

/** Danau musim dingin dalam penampang: salju, es di atas, air cair di bawah, ikan berenang. */
export const LAKE_FISH_Y = [760, 880, 960];
/**
 * bottomIce = tebal es yang menumpuk dari dasar (px, skenario "andai es tenggelam").
 * fishTime(i) = waktu efektif ikan ke-i (berhenti bergerak saat terperangkap es).
 */
export const Lake: React.FC<{cam: Cam; t: number; ice: number; children?: React.ReactNode; iceY?: number; bottomIce?: number; fishTime?: (i: number) => number}> = ({
  cam,
  t,
  ice,
  children,
  iceY = 520,
  bottomIce = 0,
  fishTime,
}) => {
  const fish = [
    {y: LAKE_FISH_Y[0], sp: 60, ph: 0, c: C.orange, s: 1},
    {y: LAKE_FISH_Y[1], sp: -45, ph: 700, c: C.pink, s: 0.8},
    {y: LAKE_FISH_Y[2], sp: 38, ph: 1300, c: C.yellow, s: 0.9},
  ];
  return (
    <>
      <Layer cam={cam} depth={0.15}>
        <rect x={-400} y={-300} width={2720} height={1700} fill="#cfe9f7" />
        <path d="M-400,420 L-100,190 L180,380 L460,160 L760,400 L1080,210 L1380,390 L1700,170 L2020,380 L2320,250 L2320,600 L-400,600 Z" fill="#a9cce3" />
        <path d="M-100,190 L-30,250 L-150,260 Z M460,160 L540,230 L400,220 Z M1080,210 L1150,270 L1020,262 Z M1700,170 L1780,240 L1640,232 Z" fill="#fff" />
      </Layer>
      <Layer cam={cam} depth={0.5}>
        {Array.from({length: 16}, (_, i) => (
          <g key={i} transform={`translate(${-300 + i * 170 + (i % 3) * 30} ${470 - (i % 2) * 14}) scale(${0.8 + (i % 3) * 0.15})`}>
            <path d="M0,-150 L50,-50 L28,-50 L64,30 L-64,30 L-28,-50 L-50,-50 Z" fill={i % 2 ? '#5c9c84' : '#4c8a74'} />
            <path d="M0,-150 L22,-106 L-22,-106 Z" fill="#fff" />
            <rect x={-8} y={30} width={16} height={24} fill={C.wood2} />
          </g>
        ))}
        <rect x={-400} y={iceY - 30} width={2720} height={40} fill="#f4fbff" />
      </Layer>
      <Layer cam={cam} depth={1}>
        {/* air danau (penampang) */}
        <rect x={-300} y={iceY} width={2520} height={1080 - iceY + 400} fill="url(#lake-water)" />
        {/* dasar danau */}
        <path d={`M-300,1040 Q300,990 900,1030 T2220,1020 L2220,1500 L-300,1500 Z`} fill="#8a6b4f" />
        <path d={`M-300,1060 Q300,1010 900,1050 T2220,1040`} stroke="#6f543d" strokeWidth={10} fill="none" />
        {/* rumput air */}
        {Array.from({length: 9}, (_, i) => (
          <path
            key={i}
            d={`M${80 + i * 230},1040 q${10 + 14 * Math.sin(t * 1.3 + i)},-60 0,-120 q${-14 * Math.sin(t * 1.3 + i)},-50 6,-90`}
            stroke={C.leaf2}
            strokeWidth={14}
            strokeLinecap="round"
            fill="none"
          />
        ))}
        {/* ikan */}
        {fish.map((f, i) => {
          const span = 2400;
          const ft = fishTime ? fishTime(i) : t;
          const xx = (((f.ph + ft * f.sp) % span) + span) % span - 240;
          const dir = f.sp > 0 ? 1 : -1;
          return (
            <g key={i} transform={`translate(${xx} ${f.y + 10 * Math.sin(ft * 1.5 + i)}) scale(${dir * f.s} ${f.s})`}>
              <ellipse cx={0} cy={0} rx={60} ry={32} fill={f.c} />
              <path d={`M-50,0 L-96,${-26 + 6 * Math.sin(ft * 8 + i)} L-96,${26 + 6 * Math.sin(ft * 8 + i)} Z`} fill={shade(f.c, -0.15)} />
              <circle cx={30} cy={-8} r={7} fill={C.ink} />
              <path d="M-10,-30 Q4,-48 20,-30" fill={shade(f.c, -0.12)} />
            </g>
          );
        })}
        {/* es yang menumpuk dari dasar (skenario andai) */}
        {bottomIce > 0.5 ? (
          <g>
            <rect x={-300} y={1050 - bottomIce} width={2520} height={bottomIce + 500} fill={C.ice2} opacity={0.88} />
            <rect x={-300} y={1050 - bottomIce} width={2520} height={12} fill="#fff" opacity={0.85} />
            {Array.from({length: Math.floor(bottomIce / 90)}, (_, k) => (
              <line key={k} x1={-300} y1={1050 - (k + 1) * 90} x2={2220} y2={1050 - (k + 1) * 90} stroke="#fff" strokeWidth={4} strokeDasharray="60 30" opacity={0.6} />
            ))}
          </g>
        ) : null}
        {/* lapisan es di permukaan */}
        <g opacity={ice}>
          <rect x={-300} y={iceY - 6} width={2520} height={70} fill={C.ice2} />
          <rect x={-300} y={iceY - 6} width={2520} height={14} fill="#fff" opacity={0.9} />
          {Array.from({length: 14}, (_, i) => (
            <path key={i} d={`M${-200 + i * 180},${iceY + 14} l40,30 l-20,20`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.7} />
          ))}
        </g>
        {children}
      </Layer>
      {/* salju turun */}
      <Layer cam={cam} depth={1.3}>
        {Array.from({length: 46}, (_, i) => {
          const r0 = rand(i * 3.1);
          const sp = 40 + r0 * 50;
          const yy = ((rand(i * 7.7) * 1400 + t * sp) % 1400) - 200;
          const xx = rand(i * 1.9) * 2300 - 200 + 30 * Math.sin(t * 0.8 + i);
          return yy < iceY - 20 ? <circle key={i} cx={xx} cy={yy} r={4 + r0 * 5} fill="#fff" opacity={0.9} /> : null;
        })}
      </Layer>
    </>
  );
};

/** Laut dengan gunung es dalam penampang. sub = fraksi terendam (0,89 untuk laut). */
export const Sea: React.FC<{cam: Cam; t: number; children?: React.ReactNode}> = ({cam, t, children}) => (
  <>
    <Layer cam={cam} depth={0.2}>
      <rect x={-400} y={-300} width={2720} height={1700} fill="#cdeaf8" />
      <circle cx={1650} cy={170} r={60} fill={C.yellow} opacity={0.9} />
      <Cloud x={300 + ((t * 10) % 300)} y={160} s={0.9} />
      <Cloud x={1000 + ((t * 7) % 300)} y={110} s={0.7} />
    </Layer>
    <Layer cam={cam} depth={1}>
      <rect x={-300} y={420} width={2520} height={1100} fill="url(#sea-water)" />
      {children}
      <path
        d={`M-300,420 ${Array.from({length: 27}, (_, i) => `Q${-300 + i * 100 + 50},${420 + 8 * Math.sin(t * 2 + i)} ${-200 + i * 100},420`).join(' ')}`}
        stroke="#fff"
        strokeWidth={5}
        fill="none"
        opacity={0.8}
      />
    </Layer>
  </>
);

/** Titik pola segi enam (sarang lebah) untuk kisi es; mengembalikan posisi O dan tetangganya. */
export const honeycomb = (cx: number, cy: number, L: number, cols: number, rows: number) => {
  const pts: {x: number; y: number; sub: 0 | 1; i: number; j: number}[] = [];
  const dx = L * Math.sqrt(3);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const bx = cx + (i - (cols - 1) / 2) * dx + (j % 2 ? dx / 2 : 0);
      const by = cy + (j - (rows - 1) / 2) * 1.5 * L;
      pts.push({x: bx, y: by - L / 2, sub: 0, i, j});
      pts.push({x: bx, y: by + L / 2, sub: 1, i, j});
    }
  }
  return pts;
};

export const lerp = mix;
