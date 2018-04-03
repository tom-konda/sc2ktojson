'use strict';
import assert = require('assert');
import childProc = require('child_process');
import fs = require('fs');
import tmp = require('tmp');
import cityDataCommonTest = require('./cityDataCommonTest');

describe(
  'cli SC2toJSON failure test',
  function () {
    it(
      'File is missing',
      function () {
        const result = childProc.spawnSync(
          'node',
          [
            './bin/cli.js',
            `${__dirname}/fixture/c.cty`,
          ]
        );
        assert.notEqual(result.stderr.length, 0, 'File check is not worked.');
      }
    )
    it(
      'File is wrong format',
      function () {
        const result = childProc.spawnSync(
          'node',
          [
            './bin/cli.js',
            `${__dirname}/fixture/wrong.sc2`,
          ]
        );
        assert.notEqual(result.stderr.length, 0, 'File format is not checked.');
      }
    )
    it(
      'Output to non-exsistent dircectory',
      function () {
        const result = childProc.spawnSync(
          'node',
          [
            './bin/cli.js',
            `${__dirname}/fixture/test_city.sc2`,
            `-o`,
            `foobar/hogehoge.json`
          ]
        );
        assert.notEqual(result.stderr.length, 0, `Output error isn't checked.`);
      }
    )
  }
);

describe(
  'cli SC2toJSON output test',
  function () {
    let tmpFile: tmp.SynchrounousResult;
    before(
      function () {
        tmpFile = tmp.fileSync({
          prefix: `sc2tojson-${new Date().getTime()}`,
        })
      }
    );

    it(
      'Output test',
      function () {
        const result = childProc.spawnSync(
          'node',
          [
            './bin/cli.js',
            `${__dirname}/fixture/test_city.sc2`,
          ]
        );
        const cityData = <SC2KtoJSONOutputFormat>JSON.parse(result.stdout);
        cityDataCommonTest.checkSurfaceData(cityData, 'File is not created correctly.');
      }
    )
    it(
      'JSON output test',
      function () {
        childProc.spawnSync(
          'node',
          [
            './bin/cli.js',
            `${__dirname}/fixture/test_city.sc2`,
            '-o',
            `${tmpFile.name}`,
          ]
        );
        const json = fs.readFileSync(`${tmpFile.name}`, 'utf8');
        const cityData = <SC2KtoJSONOutputFormat>JSON.parse(json);
        cityDataCommonTest.checkSurfaceData(cityData, 'File is not created correctly.');
      }
    )

    after(
      function () {
        fs.unlinkSync(`${tmpFile.name}`);
      }
    )
  }
)