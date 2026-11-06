import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Glass, IceCube, Kid, Stage, WaterMol} from './components/flat';
import {C, FONT, H, W} from './theme';

/** Gambar sampul 2560×1440 (desain 1920×1080 diperbesar). */
const Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.sky}}>
    <Stage bg={C.sky}>
      <circle cx={1450} cy={560} r={430} fill="#fff" opacity={0.55} />
      <Glass id="th" x={1420} y={930} w={330} h={430} level={0.72} t={0.5}>
        <IceCube x={1390} y={930 - 430 * 0.72 + 38} s={1.1} rot={-12} />
        <IceCube x={1490} y={930 - 430 * 0.72 + 34} s={0.9} rot={16} />
        <rect x={1100} y={930 - 430 * 0.72} width={700} height={500} fill={C.water} opacity={0.35} />
      </Glass>
      <WaterMol x={1730} y={330} r={70} rot={270} t={0.2} happy={1} />
      <WaterMol x={1180} y={250} r={50} rot={300} t={1.2} happy={1} />
      <Kid x={1830} y={1220} s={1.2} t={0.3} look={-1} face={{wow: 1}} armL={150} armR={20} />
    </Stage>
    <div style={{position: 'absolute', left: 110, top: 230, width: 1000, fontFamily: FONT.sans}}>
      <div style={{fontSize: 150, fontWeight: 800, lineHeight: 1, color: '#fff', WebkitTextStroke: `12px ${C.ink}`, paintOrder: 'stroke fill', textShadow: '0 10px 0 rgba(43,45,66,0.3)'}}>
        Kenapa Es
        <br />
        Batu <span style={{color: C.yellow}}>Ngambang?</span>
      </div>
      <div style={{marginTop: 40, display: 'inline-block', background: '#fff', borderRadius: 50, padding: '14px 36px', fontSize: 44, fontWeight: 700, color: C.ink, boxShadow: '6px 8px 0 rgba(43,45,66,0.16)'}}>
        rahasia molekul air
      </div>
    </div>
  </AbsoluteFill>
);

export const Thumbnail: React.FC = () => (
  <AbsoluteFill>
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `scale(${2560 / W})`, transformOrigin: '0 0'}}>
      <Cover />
    </div>
  </AbsoluteFill>
);
