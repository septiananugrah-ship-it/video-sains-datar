# Konteks repo (untuk asisten AI)

- **Uji coba gaya baru "explainer datar"** untuk video sains milik **Yayan** (Septian Anugrah Dwi Putra): topik "Kenapa Es Batu Mengapung?" (±2 menit). Aturan umum & pelajaran teknis: repo `septiananugrah-ship-it/science-intro` → `CLAUDE.md`; skill gaya: `science-intro/.claude/skills/explainer-datar/`.
- Mesin (naskah → timeline → subtitle, render 2K di Actions, voice-over) disalin dari `video-spektroskopi-molekul`; **seluruh visual baru**.
- **Gaya (wajib, beda dari seri kuantum/fisika):** animasi vektor datar ala channel explainer — warna pastel, bentuk bulat, tanpa garis tepi tebal, bayangan lembut satu arah, karakter berkepala bulat besar (desain orisinal, jangan meniru tokoh/logo channel lain), latar ilustrasi berlapis dengan **kamera paralaks yang selalu bergerak pelan**, daun buram di depan (kedalaman), balon ucapan, kartu data bersumber, transisi sapuan tiga panel warna. Font Outfit (800 untuk judul). Tanpa neon/glow gelap.
- Komponen: `src/components/flat.tsx` (Stage, Layer/kamera, Kid, WaterMol, HBond, Glass, IceCube, Bubbles, Bubble, Tag, DataCard, BigTitle, Zoomer), `sets.tsx` (Kitchen, Lab, Lake, Sea, honeycomb), `mols.ts` (posisi cair ↔ kisi es bersama).
- **Claude tidak menjalankan workflow GitHub Actions.** Setelah merge ke `main`, minta pengguna menekan *Run workflow*.
- Narasi menyusul. Selalu sediakan versi tanpa narasi.

## Aturan
- Zona subtitle (bawah ±180 px) bebas; label penting di atas benda, bukan di bawah.
- Ekspresi karakter dicampur (`face={{happy: 0.6, wow: 0.4}}`), tidak diganti mendadak. Kedip & napas otomatis.
- Fisika visual tetap benar: es ≈ 90 % terendam, sisi berat timbangan turun, H-bond dari H ke O, kisi mengikuti aturan es.
- Pergantian adegan di balik panel sapuan (adegan lama/baru tidak pernah tampil bertumpuk).

## QA
- `CHROME_PATH=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell node scripts/qa-lines.mjs out/x [adegan...]` lalu `python3 scripts/contact.py out/x out/x-s 3`.
- Momen tertentu: `node scripts/qa-moments.mjs out/x adegan:baris:offset`.
