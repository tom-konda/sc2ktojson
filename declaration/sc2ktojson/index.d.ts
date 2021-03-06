interface SC2KtoJSONStatic {
  analyze(data: ArrayBuffer): SC2KtoJSONOutputFormat;
  outputJSONText(data: ArrayBuffer): string;
}

declare const SC2KtoJSON: SC2KtoJSONStatic;

declare module '@tom-konda/sc2ktojson' {
  export = SC2KtoJSON;
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

type tileValueFormat = ALTMTileDataFormat[][] | surfaceDataFormat[][] | XBITTileDataFormat[][] | XZONTileDataFormat[][] | number[][];
type tileKeyValueFormat = { [key: string]: tileValueFormat }
type statisticValueFormat = number[][];
type statisticKeyValueFormat = { [key: string]: statisticValueFormat }
type cityValueFormat = number[][] | number[] | XMICDataFormat[] | XLABDataFormat;
type cityKeyValueFormat = { [key: string]: cityValueFormat }
type scenarioValueFormat = number[][] | PICTDataFormat | TEXTDataFormat | SCENDataFormat;
type scenarioKeyValueFormat = { [key: string]: cityValueFormat } |  {[key: string] : {[key: string] : number[]}}

type SC2KChunkType = 'scenario' | 'city' | 'statistic' | 'tile';
type SC2KChunkTypeValueFormat = tileValueFormat | statisticValueFormat | cityValueFormat | scenarioValueFormat;
type SC2KChunkTypeKeyValueFormat = {
  [chunktype: string]: SC2KChunkTypeValueFormat
}

type surfaceDataFormat = 'xbld' | 'xter' | 'xzon';

type ALTMTileDataFormat = {
  isInitialWater: boolean,
  height: number,
  binaryText: string,
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

type XBITTileDataFormat = {
  isSalty: boolean,
  isWaterCovered: boolean,
  isWaterProvided: boolean,
  isPiped: boolean,
  isPowered: boolean,
  binaryText: string,
}

type XZONTileDataFormat = {
  zone: number,
  binaryText: string,
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
