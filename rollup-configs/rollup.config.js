import { readFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageInfo = JSON.parse(readFileSync(`${__dirname}/../package.json`).toString());

const bannerText = `
/**
 * SC2KtoJSON ver ${packageInfo.version}
 * Copyright (C) 2018-${new Date().getUTCFullYear()} Tom Konda
 * Released under the MIT license
 */
`

export default {
  input: './temp/lib/sc2ktojson.js',
  external: ['fs'],
  output: [
    {
      banner: bannerText.trim(),
      file: 'lib/sc2ktojson.js',
      format: 'es'
    },
    {
      banner: bannerText.trim(),
      file: 'lib/sc2ktojson.cjs',
      format: 'commonjs',
    },
  ],
}