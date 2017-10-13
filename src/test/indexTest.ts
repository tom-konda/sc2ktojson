'use strict';
const SC2toJSON = <SC2toJSONStatic>require('../../');

import cityDataCommonTest = require('./cityDataCommonTest');
import fs = require('fs');

describe(
  'index.js SC2toJSON',
  function () {
    const file = fs.readFileSync(`${__dirname}/fixture/test_city.sc2`);
    const cityData = SC2toJSON.analyze(new Uint8Array(file).buffer);

    it(
      'Check tile data',
      function () {
        cityDataCommonTest.checkTileData(cityData);
      }
    )
  }
)