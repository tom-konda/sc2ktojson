import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageInfo = JSON.parse(readFileSync(`${__dirname}/../package.json`).toString());
const bannerText = `
/**
 * SC2KtoJSON ver ${packageInfo.version}
 * Copyright (C) 2018-${new Date().getUTCFullYear()} Tom Konda
 * Released under the MIT license
 */
`

/** @type {import('vite').UserConfig} */
export default defineConfig({
  esbuild: {
    banner: bannerText.trim(),
  },
  build: {
    outDir: '../../../lib',
    lib: {
      entry: './sc2ktojson.ts',
      formats: ['es', 'cjs'],
    },
    minify: false,
  }
});
