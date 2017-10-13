interface SC2toJSONStatic {
  analyze(data: ArrayBuffer): SC2KtoJSONOutputFormat;
  outputJSONText(data: ArrayBuffer): string;
}

declare const SC2toJSON: SC2toJSONStatic;

declare module 'sc2tojson' {
  export = SC2toJSON;
}

type SC2KChunkName =
  'CNAM' | 'ALTM' | 'XBIT' | 'XBLD' | 'XTER' | 'XTXT' | 'XMIC' |
  'XZON' | 'XUND' | 'XLAB' | 'MISC' | 'XPLC' | 'XFIR' | 'TMPL' |
  'XPOP' | 'XROG' | 'XPLT' | 'XCRM' | 'XVAL' | 'XTRF' | 'XTHG' |
  'XGRP' | 'TEXT' | 'PICT' | 'SCEN' | 'SCDH' | 'FORM';

type SC2KCompressedChunkName =
  'MISC' | 'XTER' | 'XBLD' | 'XZON' |
  'XUND' | 'XTXT' | 'XLAB' | 'XMIC' |
  'XTHG' | 'XBIT' | 'XTRF' | 'XPLT' |
  'XVAL' | 'XCRM' | 'XPLC' | 'XFIR' |
  'XPOP' | 'XROG' | 'XGRP'

type SC2KSpecHandlarExistChunkName =
  'MISC' | 'XTER' | 'XBLD' | 'XZON' |
  'XUND' | 'XTXT' | 'XLAB' | 'XMIC' |
  'XTHG' | 'XBIT' | 'XTRF' | 'XPLT' |
  'XVAL' | 'XCRM' | 'XPLC' | 'XFIR' |
  'XPOP' | 'XROG' | 'XGRP' | 'ALTM' |
  'TEXT' | 'PICT' | 'SCEN' | 'TMPL'

type SC2KtoJSONOutputFormat =
  {
    fileSize: number,
    tile: tileKeyValueFormat,
    statistic: statisticKeyValueFormat,
    city: cityKeyValueFormat,
    scenario: scenarioKeyValueFormat,
  }

type tileValueFormat = ALTMTileDataFormat[][] | surfaceDataFormat[][] | number[][];
type tileKeyValueFormat = { [key: string]: tileValueFormat }
type statisticValueFormat = number[][];
type statisticKeyValueFormat = { [key: string]: statisticValueFormat }
type cityValueFormat = number[][] | number[] | XMICDataFormat[] | XLABDataFormat;
type cityKeyValueFormat = { [key: string]: cityValueFormat }
type scenarioValueFormat = number[][] | PICTDataFormat | TEXTDataFormat | SCENDataFormat;
type scenarioKeyValueFormat = { [key: string]: cityValueFormat }

type SC2KChunkType = 'scenario' | 'city' | 'statistic' | 'tile';
type SC2KChunkTypeValueFormat = tileValueFormat | statisticValueFormat | cityValueFormat | scenarioValueFormat;
type SC2KChunkTypeKeyValueFormat = {
  [chunktype: string]: SC2KChunkTypeValueFormat
}

type surfaceDataFormat = 'xbld' | 'xter' | 'xzon';

type ALTMTileDataFormat = {
  isWater: number,
  height: number
}

type XMICDataFormat = {
  tileNum: number,
  microSim: number[],
}

type XLABDataFormat = {
  length: number,
  label: any[],
}

type XGRPDataFormat = {
  [key: string]: {
    year: number[],
    decade: number[],
    century: number[],
  }
}

type XBitTileDataFormat = {
  'isSalt': number,
  'isWaterCovered': number,
  'isWaterProvided': number,
  'isPiped': number,
  'isPowered': number,
}

type PICTDataFormat = {
  width: number,
  height: number,
  picture: number[][]
}

type TEXTDataFormat = {
  textType: string,
  textData: number[],
}

type SCENDataFormat = {
  [key: string]: number | { x: number, y: number },
}