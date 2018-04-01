import buble from 'rollup-plugin-buble';

export default {
  input: './lib/sc2ktojson.js',
  output: [
    {
      legacy: true,
      file: 'lib/sc2ktojson.legacy.js',
      name: 'sc2ktoJSON',
      format: 'iife'
    },
  ],
  plugins: [
    buble({
      ie: 8,
    })
  ]
}