export default {
  input: './lib/sc2ktojson.js',
  output: [
    { file: 'lib/sc2ktojson.cjs.js', format: 'cjs'},
    { file: 'index.js', format: 'cjs' },
  ],
  external: ['fs'],
}