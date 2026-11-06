import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import '@fontsource/outfit/700.css';
import '@fontsource/outfit/800.css';

export const W = 1920;
export const H = 1080;

// Gaya "explainer datar": warna pastel, bentuk bulat, tanpa garis tepi tebal,
// bayangan lembut satu arah (kanan-bawah), latar ilustrasi berlapis.
export const C = {
  ink: '#2b2d42', // teks & garis gelap (bukan hitam murni)
  ink2: '#4a4e69',
  paper: '#fffaf2',
  white: '#ffffff',
  sky: '#bfe6f5',
  sky2: '#e4f5fb',
  wall: '#f6e7d4',
  wall2: '#ead3b8',
  wood: '#c98b5a',
  wood2: '#a8693e',
  floor: '#e9c9a5',
  leaf: '#7cc47f',
  leaf2: '#4fa36a',
  water: '#7fd3ef',
  water2: '#4fb6dd',
  deep: '#2f7fb0',
  ice: '#e8f8ff',
  ice2: '#bfe9fb',
  skin: '#f7d6b5',
  skin2: '#e9b98f',
  hair: '#2e2b3a',
  shirt: '#3cc6c9',
  shirt2: '#2aa3a6',
  pants: '#4a5a7a',
  red: '#ff5a5f',
  orange: '#ffa94d',
  yellow: '#ffd166',
  pink: '#ff8fab',
  purple: '#9b8cff',
  green: '#5dd39e',
  // molekul: O merah koral, H putih
  oxy: '#ff6b6b',
  oxy2: '#e04f55',
  hyd: '#ffffff',
  hyd2: '#dfe7f0',
  shadow: 'rgba(43,45,66,0.14)',
};

export const FONT = {
  sans: 'Outfit, system-ui, sans-serif',
};

export const MOOD_TINT: Record<string, string> = {
  mystery: '#bfe6f5',
  title: '#ffd166',
  wonder: '#bfe6f5',
  build: '#e4f5fb',
  quantum: '#d9d2ff',
  tension: '#ffd6d6',
  bright: '#fff1c9',
  resolve: '#d6f5e4',
  outro: '#fffaf2',
};
