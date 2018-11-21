'use strict';
import SC2KtoJSON from '../../ts/lib/sc2ktojson';
import cityDataCommonTest = require('../common/cityDataCommonTest');
import fs = require('fs');
const fixturesDir = `${__dirname}/../fixtures`;

describe(
  'index.js SC2KtoJSON',
  function () {
    const file = fs.readFileSync(`${fixturesDir}/test_city.sc2`);
    const cityData = SC2KtoJSON.analyze(new Uint8Array(file).buffer);

    describe(
      'Check tile data',
      function() {
        it(
          'Check surface data',
          function() {
            cityDataCommonTest.checkSurfaceData(cityData);
          }
        );

        it(
          'Check xbit data',
          function () {
            cityDataCommonTest.checkXbitData(cityData);
          }
        )
      }
    )
  }
)