import type { SC2KtoJSONOutputFormat, XBITTileDataFormat, surfaceDataFormat } from '../../declaration/sc2ktojson'
import { expect } from 'vitest';

const checkSurfaceValue: surfaceDataFormat[] = [
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

export const checkSurfaceData = (cityData: SC2KtoJSONOutputFormat) => {
  const mapSurface = cityData.tile['surface'] as surfaceDataFormat[][];
  const actualSurfaceData = [
    mapSurface[54][27],
    mapSurface[54][29],
    mapSurface[55][26],
  ];

  expect(actualSurfaceData).toStrictEqual(checkSurfaceValue);
}

export const checkXbitData = (cityData: SC2KtoJSONOutputFormat) => {
  const xbit = cityData.tile['xbit'] as XBITTileDataFormat[][];
  const actualXbitData = xbit[46][51];
  const compareXbit = {
    isSalty : actualXbitData.isSalty,
    isPiped : actualXbitData.isPiped,
    isPowered : actualXbitData.isPowered,
    isWaterCovered : actualXbitData.isWaterCovered,
    isWaterProvided : actualXbitData.isWaterProvided,
  }
  expect(compareXbit).toStrictEqual(checkXbitValue);
}