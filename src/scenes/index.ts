import type React from 'react';
import {Angka} from './Angka';
import {Beku} from './Beku';
import {Danau} from './Danau';
import {Hook} from './Hook';
import {Lilin} from './Lilin';
import {Molekul} from './Molekul';
import {Penutup} from './Penutup';

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  lilin: Lilin,
  molekul: Molekul,
  beku: Beku,
  angka: Angka,
  danau: Danau,
  penutup: Penutup,
};
