import assert = require('assert');

const checkTileValue = [
  'xbld',
];

const defaultMessages = {
  'tile': 'Tile data is not analyzed correctly.',
}

export const checkTileData = (cityData: SC2KtoJSONOutputFormat, message: string = defaultMessages.tile) => {
  const mapTile = cityData.tile['surface'] as surfaceDataFormat[][];
  const actualTileData = [
    cityData.tile['xbld'][54][27],
    cityData.tile['xbld'][55][25],
    cityData.tile['xbld'][55][26],
  ];

  assert.deepEqual(actualTileData, checkTileValue, message);
}