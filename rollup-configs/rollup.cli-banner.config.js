import { readFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageInfo = JSON.parse(readFileSync(`${__dirname}/../package.json`).toString());
const bannerText = `
#!/usr/bin/env node
/**
 * SC2KtoJSON ver ${packageInfo.version}
 * Copyright (C) 2018-${new Date().getUTCFullYear()} Tom Konda
 * Released under the MIT license
 */
`

export default {
  input: './temp/bin/bin/cli.js',
  external: ['commander', 'fs', 'fs/promises', 'path', 'url'],
  output: [
    {
      banner: bannerText.trim(),
      file: 'bin/cli.js', format: 'es',
    },
  ],
}