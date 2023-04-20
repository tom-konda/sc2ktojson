export type SC2KChunkName =
  'CNAM' | 'ALTM' | 'XBIT' | 'XBLD' | 'XTER' | 'XTXT' | 'XMIC' |
  'XZON' | 'XUND' | 'XLAB' | 'MISC' | 'XPLC' | 'XFIR' | 'TMPL' |
  'XPOP' | 'XROG' | 'XPLT' | 'XCRM' | 'XVAL' | 'XTRF' | 'XTHG' |
  'XGRP' | 'TEXT' | 'PICT' | 'SCEN' | 'SCDH' | 'FORM';

export type SC2KCompressedChunkName =
  'MISC' | 'XTER' | 'XBLD' | 'XZON' |
  'XUND' | 'XTXT' | 'XLAB' | 'XMIC' |
  'XTHG' | 'XBIT' | 'XTRF' | 'XPLT' |
  'XVAL' | 'XCRM' | 'XPLC' | 'XFIR' |
  'XPOP' | 'XROG' | 'XGRP'

export type SC2KSpecHandlarExistChunkName =
  'MISC' | 'XTER' | 'XBLD' | 'XZON' |
  'XUND' | 'XTXT' | 'XLAB' | 'XMIC' |
  'XTHG' | 'XBIT' | 'XTRF' | 'XPLT' |
  'XVAL' | 'XCRM' | 'XPLC' | 'XFIR' |
  'XPOP' | 'XROG' | 'XGRP' | 'ALTM' |
  'TEXT' | 'PICT' | 'SCEN' | 'TMPL'

export type SC2KtoJSONOutputFormat =
  {
    fileSize: number,
    tile: tileKeyValueFormat,
    statistic: statisticKeyValueFormat,
    city: cityKeyValueFormat,
    scenario: scenarioKeyValueFormat,
  }

type tileValueFormat = ALTMTileDataFormat[][] | surfaceDataFormat[][] | XBITTileDataFormat[][] | XZONTileDataFormat[][] | number[][];
export type tileKeyValueFormat = { [key: string]: tileValueFormat }
type statisticValueFormat = number[][];
type statisticKeyValueFormat = { [key: string]: statisticValueFormat }
type cityValueFormat = number[][] | number[] | XMICDataFormat[] | XLABDataFormat;
type cityKeyValueFormat = { [key: string]: cityValueFormat }
type scenarioValueFormat = number[][] | PICTDataFormat | TEXTDataFormat | SCENDataFormat;
export type scenarioKeyValueFormat = { [key: string]: cityValueFormat } |  {[key: string] : {[key: string] : number[]}}

export type SC2KChunkType = 'scenario' | 'city' | 'statistic' | 'tile';
type SC2KChunkTypeValueFormat = tileValueFormat | statisticValueFormat | cityValueFormat | scenarioValueFormat;
type SC2KChunkTypeKeyValueFormat = {
  [chunktype: string]: SC2KChunkTypeValueFormat
}

export type surfaceDataFormat = 'xbld' | 'xter' | 'xzon';

export type ALTMTileDataFormat = {
  isInitialWater: boolean,
  height: number,
  binaryText: string,
}

export type XMICDataFormat = {
  tileNum: number,
  microSim: number[],
}

export type XLABDataFormat = {
  length: number,
  label: any[],
}

export type XGRPDataFormat = {
  [key: string]: {
    year: number[],
    decade: number[],
    century: number[],
  }
}

export type XBITTileDataFormat = {
  isSalty: boolean,
  isWaterCovered: boolean,
  isWaterProvided: boolean,
  isPiped: boolean,
  isPowered: boolean,
  binaryText: string,
}

export type XZONTileDataFormat = {
  zone: number,
  binaryText: string,
}

type PICTDataFormat = {
  width: number,
  height: number,
  picture: number[][]
}

export type TEXTDataFormat = {
  textType: string,
  textData: number[],
}

export type SCENDataFormat = {
  [key: string]: number | { x: number, y: number },
}
