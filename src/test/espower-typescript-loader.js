'use strict';
const path = require('path');
const fs = require('fs');
const ts = require(`typescript`)

const cwd = 'src/test';
const tsconfigPath = `${cwd}/tsconfig.json`;
let tsconfigBasepath = null;
let compilerOptions = null;
if (tsconfigPath) {
  compilerOptions = parseTsConfig(tsconfigPath);
  tsconfigBasepath = path.dirname(tsconfigPath);
}

require('espower-typescript')({
  // directory where match starts with
  cwd: cwd,

  // glob pattern using minimatch module
  pattern: 'test/**/*.ts',

  // options for espower module
  espowerOptions: {
    patterns: [
      'assert(value, [message])',
      'assert.ok(value, [message])',
      'assert.equal(actual, expected, [message])',
      'assert.notEqual(actual, expected, [message])',
      'assert.strictEqual(actual, expected, [message])',
      'assert.notStrictEqual(actual, expected, [message])',
      'assert.deepEqual(actual, expected, [message])',
      'assert.notDeepEqual(actual, expected, [message])'
    ]
  },
  compilerOptions : compilerOptions
});

function parseTsConfig(tsconfigPath) {
  var parsed = ts.parseConfigFileTextToJson(tsconfigPath, fs.readFileSync(tsconfigPath, 'utf8'));
  if (parsed.error) {
    throw new Error(parsed.error.messageText);
  }

  if (!parsed.config || !parsed.config.compilerOptions) {
    return null;
  }

  return parsed.config.compilerOptions;
}
