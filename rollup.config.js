import buble from 'rollup-plugin-buble';

export default {
  entry: './lib/sc2tojson.js',
  targets: [
    { dest: './index.js', format: 'cjs' },
  ],
  plugins: [
    buble({
      node: 4,
    })
  ]
}