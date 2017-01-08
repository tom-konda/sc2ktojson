import buble from 'rollup-plugin-buble';

export default {
  entry: './lib/sc2tojson.js',
  dest: 'lib/sc2tojson.legacy.js',
  format: 'iife',
  legacy: true,
  moduleName: 'sc2toJSON',
  plugins: [
    buble({
      ie: 8,
    })
  ]
}