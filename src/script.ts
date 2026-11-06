// Naskah gaya explainer: Kenapa Es Batu Mengapung?
// Struktur cerita (bukan urutan tugas kuliah):
//   1. pembuka yang dekat (es di gelas)  2. keanehan  3. "bayangkan kalau…"  4. rahasia molekul (analogi)
//   5. bukti sehari-hari  6. kembali ke skenario awal (terpecahkan)  7. pertanyaan untuk penonton.
// Satu adegan = satu "shot" pendek (5–15 dtk). trans: 'cut' = potong langsung (bawaan),
// 'wipe' = sapuan panel warna, hanya di pergantian babak.
// Durasi baris dihitung dari suku kata (timeline.ts) atau dari rekaman suara bila sudah ada.

export type Line = {
  text: string;
  /** Teks khusus TTS (opsional). Bila kosong, dibuat otomatis oleh src/tts.ts. */
  tts?: string;
  hl?: string[];
  pause?: number;
};

export type SceneScript = {
  id: string;
  chapter: string;
  part?: 1 | 2 | 3;
  title: string;
  lines: Line[];
  lead?: number;
  tail?: number;
  fixed?: number;
  trans?: 'cut' | 'wipe';
  mood: 'mystery' | 'title' | 'wonder' | 'build' | 'quantum' | 'tension' | 'bright' | 'resolve' | 'outro';
};

export const SCRIPT: SceneScript[] = [
  // ── Babak 1: pembuka & keanehan
  {
    id: 'es',
    chapter: '',
    title: 'Plung!',
    mood: 'bright',
    lead: 0.6,
    tail: 0.5,
    lines: [
      {text: 'Coba perhatikan es batu di minumanmu.', hl: ['es batu'], pause: 0.4},
      {text: 'Dicemplungkan, tenggelam sebentar, lalu muncul lagi dan mengapung.', hl: ['mengapung'], pause: 0.4},
    ],
  },
  {
    id: 'aneh',
    chapter: '',
    title: 'Sebenarnya aneh',
    mood: 'wonder',
    lead: 0.3,
    tail: 2.8,
    lines: [
      {text: 'Kelihatannya biasa. Padahal, ini aneh banget.', hl: ['aneh banget'], pause: 0.4},
      {text: 'Hampir semua zat, kalau membeku, jadi lebih padat dan tenggelam di cairannya sendiri. Lilin begitu.', hl: ['tenggelam'], pause: 0.4},
      {text: 'Air? Malah kebalikannya.', hl: ['kebalikannya'], pause: 0.3},
    ],
  },
  // ── Babak 2: bayangkan kalau es tenggelam
  {
    id: 'andai',
    chapter: '',
    title: 'Bayangkan kalau…',
    mood: 'tension',
    trans: 'wipe',
    lead: 0.6,
    tail: 0.8,
    lines: [
      {text: 'Sekarang bayangkan kalau es itu tenggelam.', hl: ['tenggelam'], pause: 0.5},
      {text: 'Setiap musim dingin, es akan menumpuk dari dasar danau, lapis demi lapis.', hl: ['dari dasar'], pause: 0.4},
      {text: 'Lama-lama seluruh danau membeku padat, dan ikan-ikan tidak punya tempat lagi.', hl: ['membeku padat'], pause: 0.4},
    ],
  },
  // ── Babak 3: rahasia molekul
  {
    id: 'kenalan',
    chapter: '',
    title: 'Kenalan dulu',
    mood: 'build',
    trans: 'wipe',
    lead: 0.5,
    tail: 0.5,
    lines: [
      {text: 'Untungnya, air punya rahasia. Kenalan dulu dengan molekulnya.', hl: ['rahasia'], pause: 0.4},
      {text: 'Satu oksigen, dua hidrogen, bentuknya seperti huruf V.', hl: ['huruf V'], pause: 0.4},
      {text: 'Ujung oksigennya sedikit negatif, ujung hidrogennya sedikit positif. Jadi mereka suka tarik-tarikan.', hl: ['tarik-tarikan'], pause: 0.3},
    ],
  },
  {
    id: 'konser',
    chapter: '',
    title: 'Seperti penonton konser',
    mood: 'bright',
    lead: 0.3,
    tail: 0.5,
    lines: [
      {text: 'Di air cair, molekul-molekul ini seperti penonton konser.', hl: ['penonton konser'], pause: 0.3},
      {text: 'Desak-desakan, gandengan sebentar, lalu lepas lagi.', hl: ['desak-desakan'], pause: 0.3},
    ],
  },
  {
    id: 'dansa',
    chapter: '',
    title: 'Tari lingkaran',
    mood: 'wonder',
    lead: 0.3,
    tail: 0.8,
    lines: [
      {text: 'Begitu dingin, mereka berhenti berdesakan, lalu bergandengan rapi, seperti tari lingkaran.', hl: ['bergandengan rapi'], pause: 0.4},
      {text: 'Pola gandengannya segi enam, dan di tengahnya tersisa ruang kosong.', hl: ['segi enam', 'ruang kosong'], pause: 0.4},
      {text: 'Hasilnya, es memakan tempat kira-kira sembilan persen lebih banyak daripada air.', hl: ['sembilan persen'], pause: 0.3},
    ],
  },
  // ── Babak 4: buktinya ada di sekitar kita
  {
    id: 'botol',
    chapter: '',
    title: 'Botol di freezer',
    mood: 'tension',
    trans: 'wipe',
    lead: 0.5,
    tail: 1.4,
    lines: [
      {text: 'Buktinya gampang. Isi botol kaca sampai penuh, lalu masukkan ke freezer.', hl: ['botol kaca'], pause: 0.4},
      {text: 'Esnya mengembang, dan botolnya bisa retak.', hl: ['retak'], pause: 0.3},
    ],
  },
  {
    id: 'angka',
    chapter: '',
    title: 'Lebih ringan',
    mood: 'build',
    lead: 0.3,
    tail: 0.6,
    lines: [
      {text: 'Karena lebih mengembang, es jadi lebih ringan untuk ukuran yang sama: sekitar nol koma sembilan dua gram per sentimeter kubik, sedangkan air sekitar satu.', hl: ['nol koma sembilan dua'], pause: 0.4},
      {text: 'Yang lebih ringan, naik ke atas.', hl: ['naik ke atas'], pause: 0.3},
    ],
  },
  {
    id: 'gunung',
    chapter: '',
    title: 'Gunung es',
    mood: 'wonder',
    lead: 0.3,
    tail: 0.8,
    lines: [
      {text: 'Tapi bedanya tipis. Jadi kira-kira sembilan per sepuluh gunung es tetap tersembunyi di bawah air.', hl: ['sembilan per sepuluh'], pause: 0.3},
    ],
  },
  // ── Babak 5: kembali ke danau & penutup
  {
    id: 'selamat',
    chapter: '',
    title: 'Danau yang selamat',
    mood: 'resolve',
    trans: 'wipe',
    lead: 0.5,
    tail: 0.6,
    lines: [
      {text: 'Kembali ke danau tadi. Karena es mengapung, danau membeku dari atas, dan esnya jadi selimut.', hl: ['dari atas', 'selimut'], pause: 0.4},
      {text: 'Di bawahnya, air tetap cair, sekitar empat derajat Celsius, dan ikan aman sampai musim semi.', hl: ['empat derajat Celsius'], pause: 0.3},
    ],
  },
  {
    id: 'tutup',
    chapter: '',
    title: 'Penutup',
    mood: 'outro',
    lead: 0.4,
    tail: 2.8,
    lines: [
      {text: 'Jadi, es yang mengapung di gelasmu itu sebenarnya jutaan molekul yang sedang bergandengan tangan.', hl: ['bergandengan tangan'], pause: 0.5},
      {text: 'Nah, coba tebak: kenapa pipa air di negara dingin bisa pecah saat musim dingin? Tulis jawabanmu di kolom komentar!', hl: ['pipa air'], pause: 0.4},
    ],
  },
];
