// Naskah uji coba gaya "explainer datar": Kenapa Es Batu Mengapung?
// Durasi baris dihitung otomatis dari jumlah suku kata (timeline.ts) atau dari
// rekaman suara bila sudah ada. Angka dicek di naskah/AUDIT.md.
//
// hl     : kata/frasa yang disorot pada subtitle
// pause  : jeda (detik) SETELAH baris dibacakan
// lead   : jeda (detik) sebelum baris pertama adegan
// tail   : jeda (detik) setelah baris terakhir adegan

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
  mood: 'mystery' | 'title' | 'wonder' | 'build' | 'quantum' | 'tension' | 'bright' | 'resolve' | 'outro';
};

export const SCRIPT: SceneScript[] = [
  {
    id: 'hook',
    chapter: '',
    title: 'Es yang ngambang',
    mood: 'bright',
    lead: 0.8,
    tail: 2.8,
    lines: [
      {text: 'Siang yang panas. Kamu memasukkan es batu ke segelas air dingin.', hl: ['es batu'], pause: 0.5},
      {text: 'Esnya tidak tenggelam. Ia malah mengapung di permukaan.', hl: ['mengapung'], pause: 0.5},
      {text: 'Padahal es dan air itu zat yang sama. Kok bisa beda?', hl: ['zat yang sama'], pause: 0.4},
    ],
  },
  {
    id: 'lilin',
    chapter: '',
    title: 'Zat lain justru tenggelam',
    mood: 'wonder',
    lead: 0.5,
    tail: 0.6,
    lines: [
      {text: 'Kebanyakan zat justru sebaliknya. Lilin padat tenggelam di dalam lilin cair.', hl: ['tenggelam'], pause: 0.5},
      {text: 'Saat membeku, partikelnya merapat, jadi bentuk padatnya lebih berat untuk ukuran yang sama.', hl: ['merapat'], pause: 0.5},
      {text: 'Air melanggar aturan ini. Rahasianya ada di dalam molekulnya.', hl: ['melanggar aturan'], pause: 0.4},
    ],
  },
  {
    id: 'molekul',
    chapter: '',
    title: 'Kenalan dengan molekul air',
    mood: 'build',
    lead: 0.6,
    tail: 0.6,
    lines: [
      {text: 'Satu molekul air terdiri dari satu atom oksigen dan dua atom hidrogen, membentuk huruf V.', hl: ['huruf V'], pause: 0.5},
      {text: 'Sisi oksigen sedikit negatif, sisi hidrogen sedikit positif. Jadi mereka saling tarik.', hl: ['saling tarik'], pause: 0.5},
      {text: 'Di air cair, molekul-molekul ini berdesakan, bergandengan lalu melepas, terus-menerus.', hl: ['berdesakan'], pause: 0.4},
    ],
  },
  {
    id: 'beku',
    chapter: '',
    title: 'Saat air membeku',
    mood: 'wonder',
    lead: 0.6,
    tail: 0.6,
    lines: [
      {text: 'Saat suhu turun, gerakan mereka melambat, dan gandengannya makin erat. Namanya ikatan hidrogen.', hl: ['ikatan hidrogen'], pause: 0.5},
      {text: 'Setiap molekul menggandeng empat tetangga, menyusun pola segi enam yang renggang.', hl: ['segi enam'], pause: 0.5},
      {text: 'Pola ini menyisakan banyak ruang kosong. Akibatnya, es kira-kira sembilan persen lebih mengembang daripada air.', hl: ['ruang kosong', 'sembilan persen'], pause: 0.4},
    ],
  },
  {
    id: 'angka',
    chapter: '',
    title: 'Massa jenis',
    mood: 'build',
    lead: 0.5,
    tail: 0.8,
    lines: [
      {
        text: 'Hasilnya, satu sentimeter kubik air bermassa sekitar satu gram, sedangkan es hanya sekitar nol koma sembilan dua gram.',
        hl: ['nol koma sembilan dua'],
        pause: 0.5,
      },
      {text: 'Benda yang massa jenisnya lebih kecil akan mengapung. Itulah sebabnya es selalu naik ke atas.', hl: ['mengapung'], pause: 0.5},
      {text: 'Dan karena bedanya tipis, sebagian besar es tetap terendam. Pada gunung es, kira-kira sembilan per sepuluhnya tersembunyi di bawah laut.', hl: ['sembilan per sepuluh'], pause: 0.4},
    ],
  },
  {
    id: 'danau',
    chapter: '',
    title: 'Penyelamat kehidupan',
    mood: 'resolve',
    lead: 0.6,
    tail: 0.6,
    lines: [
      {text: 'Sifat aneh ini menyelamatkan kehidupan di negeri bermusim dingin.', hl: ['menyelamatkan kehidupan'], pause: 0.5},
      {text: 'Danau membeku dari atas. Lapisan es menjadi selimut yang menahan dingin.', hl: ['dari atas'], pause: 0.5},
      {text: 'Di bawahnya, air tetap cair, sekitar empat derajat Celsius, dan ikan tetap bisa berenang.', hl: ['empat derajat Celsius'], pause: 0.4},
    ],
  },
  {
    id: 'penutup',
    chapter: '',
    title: 'Penutup',
    mood: 'outro',
    lead: 0.6,
    tail: 2.4,
    lines: [
      {text: 'Jadi, lain kali kamu melihat es mengapung di minumanmu,', pause: 0.2},
      {text: 'ingatlah: itu jutaan molekul air yang sedang bergandengan tangan.', hl: ['bergandengan tangan'], pause: 0.6},
    ],
  },
];
