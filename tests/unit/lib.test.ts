'use strict';

import { analyze } from '../../src/ts/lib/sc2ktojson';
import { checkSurfaceData, checkXbitData } from '../common/cityDataCommonTest';
import {readFileSync} from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { describe, it } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = `${__dirname}/../fixtures`;

describe(
  'SC2KtoJSON library testing',
  () => {
    const file = readFileSync(`${fixturesDir}/test_city.sc2`);
    const cityData = analyze(new Uint8Array(file).buffer);

    it(
      'Check surface data',
      () => {
        checkSurfaceData(cityData);
      }
    )

    it(
      'Check xbit data',
      () => {
        checkXbitData(cityData);
      }
    )
  }
)