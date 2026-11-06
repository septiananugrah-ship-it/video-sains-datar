# Audit angka — "Kenapa Es Batu Mengapung?" (uji gaya explainer datar)

Nilai di bawah adalah konstanta buku teks yang umum. Kolom "Dicek" = sudah dicocokkan ke sumber
primer (isi saat dicek). **Cek ulang sebelum narasi direkam** — mengubah angka berarti merekam ulang baris.

| Klaim di naskah/layar | Nilai | Sumber yang disarankan | Dicek |
|---|---|---|---|
| Massa jenis es (0 °C) | 0,9167 g/cm³ → layar "≈ 0,92" | CRC Handbook of Chemistry and Physics; USGS Water Science School "Ice, Snow, and Glaciers" | ⏳ |
| Massa jenis air (0 °C / 4 °C) | 0,9998 / 0,99997 g/cm³ → layar "≈ 1,00" | CRC Handbook; NIST | ⏳ |
| Es "kira-kira 9 % lebih mengembang" | 1/0,9167 = 1,091 → +9 % volume | hitung dari dua baris di atas | ✓ (hitung) |
| Sudut H–O–H | 104,5° (fase gas 104,48°) | NIST CCCBDB (H₂O) | ⏳ |
| Tiap molekul es menggandeng 4 tetangga (tetrahedral), pola segi enam (es Ih) | — | Atkins *Physical Chemistry*; Chaplin, "Water Structure and Science" | ⏳ |
| Gunung es ≈ 9/10 terendam | 1 − 0,917/1,025 = 0,105 di atas → ≈ 89–90 % terendam | hitung; NOAA / USGS | ✓ (hitung) |
| Lilin parafin padat tenggelam di lilin cair | padat ≈ 0,9 g/cm³ > cair ≈ 0,78 g/cm³ | lembar data parafin (mis. Sigma-Aldrich) | ⏳ |
| Dasar danau musim dingin ≈ 4 °C | air paling rapat pada 3,98 °C | USGS; buku limnologi (Wetzel) | ⏳ |

Catatan visual:
- Kisi segi enam = proyeksi 2D es Ih. Sub-kisi 0 memberi H ke dua tetangga di bidang; sub-kisi 1 memberi satu H di bidang
  dan satu H keluar bidang (digambar redup) — aturan es "satu H per ikatan" tetap terpenuhi.
- Kotak perbandingan volume cair vs es **dilebihkan** (diberi label di layar).
- Gunung es: posisi vertikal dihitung agar luas di atas air = 1 − ρes/ρlaut (Angka.tsx).
