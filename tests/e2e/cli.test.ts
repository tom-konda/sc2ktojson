'use strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, unlinkSync } from 'node:fs';
import { fileSync, FileResult } from 'tmp';
import { SC2KtoJSONOutputFormat } from '../../declaration/sc2ktojson';
import { checkSurfaceData, checkXbitData } from '../common/cityDataCommonTest';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = `${__dirname}/../fixtures`;

describe(
  'cli SC2KtoJSON failure test',
  () => {
    it(
      'Input file is missing',
      () => {
        const {stderr} = spawnSync(
          'node',
          [
            './bin/cli.js',
            `${fixturesDir}/c.sc2`,
          ]
        );
        expect(stderr.toString().length).toBeGreaterThan(0)
      }
    )
    it(
      'Input file is wrong format',
      () => {
        const {stderr} = spawnSync(
          'node',
          [
            './bin/cli.js',
            `${fixturesDir}/wrong.sc2`,
          ]
        );
        expect(stderr.toString().length).toBeGreaterThan(0)
      }
    )
    it(
      'Output to non-existent directory',
      () => {
        const {stderr} = spawnSync(
          'node',
          [
            './bin/cli.cjs',
            `${fixturesDir}/test_city.sc2`,
            `-o`,
            `foobar/hogehoge.json`
          ]
        );
        expect(stderr.toString().length).toBeGreaterThan(0)
      }
    )
  }
)

// describe(
//   'cli SC2KtoJSON output test',
//   () => {
//     let tmpFile: FileResult;
//     beforeEach(
//       () => {
//         tmpFile = fileSync({
//           prefix: `sc2tojson-${Date.now()}`,
//         })
//       }
//     );

//     it(
//       'JSON output test',
//       () => {
//         spawnSync(
//           'node',
//           [
//             './bin/cli.cjs',
//             `${fixturesDir}/test_city.cty`,
//             '-o',
//             `${tmpFile.name}`,
//           ]
//         );
//         const json = readFileSync(`${tmpFile.name}`, 'utf8');
//         const cityData = JSON.parse(json) as SC2KtoJSONOutputFormat;
//         checkSurfaceData(cityData);
//         checkXbitData(cityData);
//       }
//     )

//     afterEach(
//       () => {
//         unlinkSync(`${tmpFile.name}`);
//       }
//     )
//   }
// )