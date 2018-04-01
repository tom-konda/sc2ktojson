import * as fs from 'fs';

const packageInfo = JSON.parse(fs.readFileSync(`${__dirname}/../package.json`).toString())
const bannerText = `
#!/usr/bin/env node
/**
 * SC2KtoJSON ver ${packageInfo.version}
 * Copyright (C) 2018-${new Date().getUTCFullYear()} Tom Konda
 * Released under the MIT license
 */
`

export default {
  input: './bin/cli.js',
  output: [
    {
      banner: bannerText.trim(),
      file: 'bin/cli.js',
      format: 'cjs'
    },
  ],
  external: ['fs'],
}