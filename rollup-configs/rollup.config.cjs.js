import buble from 'rollup-plugin-buble';

export default {
  entry: './lib/sc2tojson.js',
  external: ['fs'],
  targets: [
    { dest: 'lib/sc2tojson.cjs.js', format: 'cjs' },
    { dest: 'index.js', format: 'cjs' },
  ],
  plugins: [
    buble({
      node: 4,
    })
  ]
}