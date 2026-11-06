import type React from 'react';
import {Andai} from './Andai';
import {Aneh} from './Aneh';
import {Angka, Gunung} from './Angka';
import {Dansa} from './Beku';
import {Botol} from './Botol';
import {Selamat} from './Danau';
import {Es} from './Es';
import {Kenalan, Konser} from './Molekul';
import {Tutup} from './Penutup';

export const SCENES: Record<string, React.FC> = {
  es: Es,
  aneh: Aneh,
  andai: Andai,
  kenalan: Kenalan,
  konser: Konser,
  dansa: Dansa,
  botol: Botol,
  angka: Angka,
  gunung: Gunung,
  selamat: Selamat,
  tutup: Tutup,
};
