// Posisi molekul air bersama untuk adegan "molekul" (cair) dan "beku" (kisi es segi enam).
import {rand} from '../anim';
import {honeycomb} from './sets';

export const MOL_R = 30;
export const CX = 960;
export const CY = 500;

// ── Kisi es: sarang lebah (proyeksi 2D es Ih). Jarak O–O = LAT.
export const LAT = 108;
const raw = honeycomb(CX, CY, LAT, 5, 4);
export const LATTICE = raw.map((p, k) => ({...p, k}));

const ang = (dx: number, dy: number) => ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
const near = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180) < 8;

// Aturan es: tiap ikatan O···O memuat tepat satu H.
// Sub-kisi 0 (titik atas) menyumbang H ke bawah (90°) dan kanan-atas (330°);
// sub-kisi 1 menyumbang H ke kanan-bawah (30°); H keduanya keluar bidang (digambar redup).
export const H_IN_PLANE: Record<0 | 1, number[]> = {0: [90, 330], 1: [30]};
export const latticeHAngles = (sub: 0 | 1): [number, number] => (sub === 0 ? [90, 330] : [30, 112]);

export type Bond = {a: number; b: number; donor: number; acceptor: number; hAng: number};
export const BONDS: Bond[] = (() => {
  const out: Bond[] = [];
  for (let i = 0; i < LATTICE.length; i++)
    for (let j = i + 1; j < LATTICE.length; j++) {
      const p = LATTICE[i];
      const q = LATTICE[j];
      const d = Math.hypot(q.x - p.x, q.y - p.y);
      if (Math.abs(d - LAT) > 2) continue;
      const aij = ang(q.x - p.x, q.y - p.y);
      const aji = ang(p.x - q.x, p.y - q.y);
      if (H_IN_PLANE[p.sub].some((h) => near(h, aij))) out.push({a: i, b: j, donor: i, acceptor: j, hAng: aij});
      else if (H_IN_PLANE[q.sub].some((h) => near(h, aji))) out.push({a: i, b: j, donor: j, acceptor: i, hAng: aji});
    }
  return out;
})();

/** Pusat segi enam yang lengkap (enam O di sekelilingnya). */
export const HEX_CENTERS: {x: number; y: number}[] = (() => {
  const cands: {x: number; y: number}[] = [];
  for (const p of LATTICE) cands.push({x: p.x, y: p.y + (p.sub === 1 ? LAT : -LAT)});
  const uniq: {x: number; y: number}[] = [];
  for (const c of cands) {
    if (uniq.some((u) => Math.hypot(u.x - c.x, u.y - c.y) < 4)) continue;
    const ring = LATTICE.filter((p) => Math.abs(Math.hypot(p.x - c.x, p.y - c.y) - LAT) < 3).length;
    if (ring === 6) uniq.push(c);
  }
  return uniq;
})();

// ── Air cair: jumlah molekul sama, lebih rapat dan acak, terus berdesakan.
const N = LATTICE.length;
const order = [...LATTICE].sort((p, q) => p.y - q.y || p.x - q.x).map((p) => p.k);
const COLS = 8;
const ROWS = Math.ceil(N / COLS);
export const LIQ_W = 800;
export const LIQ_H = 520;
export const LIQUID = Array.from({length: N}, (_, s) => {
  const i = s % COLS;
  const j = Math.floor(s / COLS);
  const bx = CX + (i - (COLS - 1) / 2) * (LIQ_W / COLS) + (rand(s * 3.7) - 0.5) * 40;
  const by = CY + (j - (ROWS - 1) / 2) * (LIQ_H / ROWS) + (rand(s * 5.3) - 0.5) * 40;
  return {k: order[s], bx, by, rot0: rand(s * 9.1) * 360, f1: 0.5 + rand(s * 1.3) * 0.7, f2: 0.4 + rand(s * 2.9) * 0.7, ph: rand(s * 4.4) * 6.28};
}).sort((a, b) => a.k - b.k);

/** Posisi cair molekul k pada waktu t; amp = besar gerak (1 = cair, 0 = diam). */
export const liquidPos = (k: number, t: number, amp = 1) => {
  const m = LIQUID[k];
  return {
    x: m.bx + amp * (26 * Math.sin(t * m.f1 + m.ph) + 10 * Math.sin(t * 2.3 * m.f2 + m.ph * 2)),
    y: m.by + amp * (22 * Math.cos(t * m.f2 + m.ph) + 9 * Math.sin(t * 1.9 * m.f1 + m.ph)),
    rot: m.rot0 + amp * (t * 40 * (m.f1 - 0.85) + 25 * Math.sin(t * m.f2 + m.ph)),
  };
};

/** Titik H (dua) dari molekul di (x, y) dengan bisektor rot. */
export const hPoints = (x: number, y: number, rot: number, r = MOL_R) =>
  [rot - 52.25, rot + 52.25].map((a) => ({x: x + r * 1.06 * Math.cos((a * Math.PI) / 180), y: y + r * 1.06 * Math.sin((a * Math.PI) / 180)}));
