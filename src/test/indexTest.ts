'use strict';
const SC2KtoJSON = <SC2KtoJSONStatic>require('../../');

import cityDataCommonTest = require('./cityDataCommonTest');
import fs = require('fs');

describe(
  'index.js SC2KtoJSON',
  function () {
    const file = fs.readFileSync(`${__dirname}/fixture/test_city.sc2`);
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