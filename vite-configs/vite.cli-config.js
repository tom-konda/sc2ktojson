import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const binDir = resolve(__dirname, '../bin');
const packageInfo = JSON.parse(readFileSync(`${__dirname}/../package.json`).toString());
const bannerText = `
/**
 * SC2KtoJSON ver ${packageInfo.version}
 * Copyright (C) 2018-${new Date().getUTCFullYear()} Tom Konda
 * Released under the MIT license
 */
`

/** @type {import('vite').UserConfig} */
const viteConfig = {
  esbuild: {
    banner: bannerText.trim(),
  },
  build: {
    outDir: resolve(__dirname, '../bin'),
    lib: {
      entry: resolve(__dirname, '../src/ts/bin/cli.ts'),
      formats: ['es'],
      fileName: 'cli',
    },
    rollupOptions: {
      external: ['commander', 'node:fs', 'node:fs/promises', 'node:path', 'node:url'],
    },
    minify: false,
    write: false,
  },
};

const result = await build(viteConfig);
const { code = '' } = result?.[0]?.output?.[0];
if (code === '') {
  throw new Error('Output code is empty.');
}

if (existsSync(binDir) === false) {
  mkdirSync(binDir);
}
writeFileSync(`${binDir}/cli.js`, ['#!/usr/bin/env node', code].join('\n'));