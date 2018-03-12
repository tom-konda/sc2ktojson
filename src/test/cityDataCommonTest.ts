import assert = require('assert');

const checkSurfaceValue = [
  'xbld',
  'xter',
  'xzon',
];

const checkXbitValue = {
  isPiped: true,
  isSalty: false,
  isWaterCovered: true,
  isPowered: false,
  isWaterProvided: true,
}

const defaultMessages = {
  'surface': 'Surface data is not analyzed correctly.',
  'xbit': 'XBIT data is not analyzed correctly.',
}

export const checkSurfaceData = (cityData: SC2KtoJSONOutputFormat, message: string = defaultMessages.surface) => {
  const mapSurface = cityData.tile['surface'] as surfaceDataFormat[][];
  const actualSurfaceData = [
    mapSurface[54][27],
    mapSurface[54][29],
    mapSurface[55][26],
  ];

  assert.deepEqual(actualSurfaceData, checkSurfaceValue, message);
}

export const checkXbitData = (cityData: SC2KtoJSONOutputFormat, message: string = defaultMessages.xbit) => {
  const xbit = cityData.tile['xbit'] as XBITTileDataFormat[][];
  const actualXbitData = xbit[46][51];
  const compareXbit = {
    isSalty : actualXbitData.isSalty,
    isPiped : actualXbitData.isPiped,
    isPowered : actualXbitData.isPowered,
    isWaterCovered : actualXbitData.isWaterCovered,
    isWaterProvided : actualXbitData.isWaterProvided,
  }
  assert.deepEqual(compareXbit, checkXbitValue, message);
}