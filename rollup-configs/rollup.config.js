import * as fs from 'fs';

const packageInfo = JSON.parse(fs.readFileSync(`${__dirname}/../package.json`).toString())
const bannerText = `
/**
 * SC2KtoJSON ver ${packageInfo.version}
 * Copyright (C) 2018-${new Date().getUTCFullYear()} Tom Konda
 * Released under the MIT license
 */
`

export default {
  input: './lib/sc2ktojson.js',
  output: [
    {
      banner: bannerText.trim(),
      file: 'lib/sc2ktojson.js',
      format: 'es'
    },
  ],
  external: ['fs'],
}