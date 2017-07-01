import * as fs from 'fs';

const packageInfo = JSON.parse(fs.readFileSync(`${__dirname}/../package.json`).toString())
const bannerText = `
/**
 * SC2toJSON ver ${packageInfo.version}
 * Copyright (C) 2015-${new Date().getUTCFullYear()} Tom Konda
 * Released under the MIT license
 */
`

export default {
  banner: bannerText.trim(),
  entry: './lib/sc2tojson.js',
  external: ['fs'],
  targets: [
    { dest: 'lib/sc2tojson.js', format: 'es' },
  ],
}