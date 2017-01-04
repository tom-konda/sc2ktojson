'use strict';

(function (global) {
  'use strict';
  const isNode = ('process' in global);
  const LENGTH_OF_EDGE = 128;
  const CHUNK_NAME_LENGTH = 4;
  const CHUNK_SIZE_LENGTH = 4;

  const chunkSpecificHandler = {
    'ALTM' : (chunkData:Uint8Array) => {
      let altmMap:{}[][] = Array(LENGTH_OF_EDGE).fill(Array(LENGTH_OF_EDGE));
      for (let i = 0, x = 0; i < 0x8000; i += 2) {
        let data = new DataView(chunkData.slice(i, i + 2).buffer).getUint16(0);

        let mod = i % 0x100;
        let y = Math.floor(mod / 2);

        let height = 0x1f & data;
        let isWater = (data >> 7) & 1;
        altmMap[x][y] = { 'isWater': isWater, 'height': height };
        if (mod === 254) {
          ++x;
        }
      }
      return altmMap;
    },
    'XBIT' : (chunkData:Uint8Array) => {
      let xbitMap:{}[][] = Array(LENGTH_OF_EDGE).fill(Array(LENGTH_OF_EDGE));
      for (let y = 0; y < LENGTH_OF_EDGE; ++y) {
        for (let x = 0; x < LENGTH_OF_EDGE; ++x) {
          let xbitData = getCurrentByteValue(chunkData, y * LENGTH_OF_EDGE + x);
          let isSalt = xbitData[y * LENGTH_OF_EDGE + x] & 1;
          let isWaterCovered = (xbitData[y * LENGTH_OF_EDGE + x] >> 2) & 1;
          let isWaterProvided = (xbitData[y * LENGTH_OF_EDGE + x] >> 4) & 1;
          let isPiped = (xbitData[y * LENGTH_OF_EDGE + x] >> 5) & 1;
          let isPowered = (xbitData[y * LENGTH_OF_EDGE + x] >> 6) & 1;
          xbitMap[x][y] = {
            'isSalt': isSalt,
            'isWaterCovered': isWaterCovered,
            'isWaterProvided': isWaterProvided,
            'isPiped': isPiped,
            'isPowered': isPowered
          };
        }
      }
      return xbitMap;
    },
    'XBLD' : (chunkData:Uint8Array) => getMapData(chunkData, 1),
    'XTER' : (chunkData:Uint8Array) => getMapData(chunkData, 1),
    'XTXT' : (chunkData:Uint8Array) => getMapData(chunkData, 1),
    'XZON' : (chunkData:Uint8Array) => getMapData(chunkData, 1),
    'XUND' : (chunkData:Uint8Array) => getMapData(chunkData, 1),
    'XPLC' : (chunkData:Uint8Array) => getMapData(chunkData, 4),
    'XFIR' : (chunkData:Uint8Array) => getMapData(chunkData, 4),
    'XPOP' : (chunkData:Uint8Array) => getMapData(chunkData, 4),
    'XROG' : (chunkData:Uint8Array) => getMapData(chunkData, 4),
    'XPLT' : (chunkData:Uint8Array) => getMapData(chunkData, 4),
    'XCRM' : (chunkData:Uint8Array) => getMapData(chunkData, 2),
    'XVAL' : (chunkData:Uint8Array) => getMapData(chunkData, 2),
    'XTRF' : (chunkData:Uint8Array) => getMapData(chunkData, 2),
    'XLAB' : (chunkData:Uint8Array) => {
      let labels = Array(0x100);
      for (let i = 0; i < 0x100; i ++) {
        let current = i * 25;
        labels[i] = Array.from(chunkData.slice(current, current + 25))
      }
      return labels;
    },
    'XMIC' : (chunkData:Uint8Array) => {
      const MAX_MICROSIM_NUM = 150;
      let microsims = Array(MAX_MICROSIM_NUM);
      for (let i = 0; i < MAX_MICROSIM_NUM; i++) {
        let current = i * 8;
        let currentMicroSim = chunkData.slice(current, current + 8);
        /*
          #1 : Bus Sim
          #2 : Railway Sim
          #3 : Subway Sim
          #4 : Wind Power Sim
          #5 : Hydro Power Sim
          #6 : Large Park Sim
          #7 : Museum Sim
          #8 : Library Sim
          #9 : Marina Sim
        */
        // if (microsims.length === 2 || microsims.length === 3) {
        //   microsims[microsims.length] = getInteger(i, 8, xmicData);
        // }
        microsims[i] = Array.from(currentMicroSim);
      }
      return microsims;
    },
    'XTHG' : (chunkData:Uint8Array) => Array.from(chunkData),
    'XGRP' : (chunkData:Uint8Array) => Array.from(chunkData),
    'MISC' : (chunkData:Uint8Array) => {
      const MAX_MISC_NUM = 1200;
      let miscs = Array(MAX_MISC_NUM);
      for (let i = 0; i < MAX_MISC_NUM; i++) {
        let current = i * 4;
        let currentMisc = chunkData.slice(current, current + 4);
        
        miscs[i] = Array.from(currentMisc);
      }
      return miscs;
    },
    'TMPL' : (chunkData:Uint8Array) => Array.from(chunkData),
    'TEXT' : (chunkData:Uint8Array) => {
      const textTypeValue = getCurrentByteValue(chunkData, 0);
      let textType = '';
      switch (textTypeValue) {
        case 0x80 : 
          textType = 'postSelect';
          break;
        case 0x81 :
          textType = 'preSelect';
          break;
        default:
      }
      const textData = Array.from(chunkData.slice(1));
      return {
        textType : textType,
        textData : textData,
      }
    },
    'SCEN' : (chunkData:Uint8Array) => {
      let scenData = {};
      scenData['disaster'] = new DataView(chunkData.slice(4, 6).buffer).getUint16(0);
      scenData['disasterCoordinate'] = {
        x : getCurrentByteValue(chunkData, 6),
        y : getCurrentByteValue(chunkData, 7),
      };
      scenData['limit'] = new DataView(chunkData.slice(8, 10).buffer).getUint16(0);
      scenData['condPop'] = new DataView(chunkData.slice(10, 14).buffer).getUint32(0);
      scenData['condRPop'] = new DataView(chunkData.slice(14, 18).buffer).getUint32(0);
      scenData['condCPop'] = new DataView(chunkData.slice(18, 22).buffer).getUint32(0);
      scenData['condIPop'] = new DataView(chunkData.slice(22, 26).buffer).getUint32(0);
      scenData['condFund'] = new DataView(chunkData.slice(26, 30).buffer).getUint32(0);
      scenData['condLVal'] = new DataView(chunkData.slice(30, 34).buffer).getUint32(0);
      scenData['condEdu'] = new DataView(chunkData.slice(34, 38).buffer).getUint32(0);
      scenData['condPol'] = new DataView(chunkData.slice(38, 42).buffer).getUint32(0);
      scenData['condCri'] = new DataView(chunkData.slice(42, 46).buffer).getUint32(0);
      scenData['condTra'] = new DataView(chunkData.slice(46, 50).buffer).getUint32(0);
      scenData['condBld1ID'] = getCurrentByteValue(chunkData, 50);
      scenData['condBld2ID'] = getCurrentByteValue(chunkData, 51);
      if (chunkData.byteLength > 52) {
        scenData['condBld1Tiles'] = new DataView(chunkData.slice(52, 54).buffer).getUint16(0);
        scenData['condBld2Tiles'] = new DataView(chunkData.slice(54, 56).buffer).getUint16(0);
      }
      return scenData;
    },
    'PICT' : (chunkData:Uint8Array) => {
      const END_OF_PICTURE_ROW = 0;
      const width = getCurrentByteValue(chunkData, 4);
      const height = getCurrentByteValue(chunkData, 6);
      let pictureArrayData = Array.from(chunkData.slice(8));
      let pictureData = [];
      let offset = 0;
      let findIndex = pictureArrayData.indexOf(END_OF_PICTURE_ROW, offset);
      
      while(findIndex !== -1) {
        let row = pictureArrayData.slice(offset, findIndex);
        pictureData.push(row);
        offset = findIndex + 1;
        findIndex = pictureArrayData.indexOf(END_OF_PICTURE_ROW, offset);
      }

      return {
        width : width,
        height : height,
        picture : pictureData,
      }
    }
  }

  let getMapData = (chunk:Uint8Array, tileSize:number) => {
    const tileLength = LENGTH_OF_EDGE / tileSize;
    let map:number[][] = Array(tileLength).fill(Array(tileLength));
    for (let y = 0; y < tileLength; ++y) {
      for (let x = 0; x < tileLength; ++x) {
        map[x][y] = getCurrentByteValue(chunk, y * tileLength + x);
      }
    }
    return map;
  }

  let getCurrentByteValue = (chunk:Uint8Array, pos:number) => {
    return new DataView(chunk.slice(pos, pos + 1).buffer).getUint8(0);
  };

  function getChunkName (buffer:Uint8Array):string {
    const chunkList = [
      'CNAM', 'ALTM', 'XBIT', 'XBLD', 'XTER', 'XTXT', 'XMIC',
      'XZON', 'XUND', 'XLAB', 'MISC', 'XPLC', 'XFIR', 'TMPL',
      'XPOP', 'XROG', 'XPLT', 'XCRM', 'XVAL', 'XTRF', 'XTHG',
      'XGRP', 'TEXT', 'PICT', 'SCEN', 'SCDH', 'FORM',
    ];

    if (buffer.byteLength === 4) {
      const text = buffer.reduce(
        (prev, current) => {
          return prev + String.fromCharCode(current)
        },
        ''
      );
      if (chunkList.indexOf(text) === -1) {
        return '';
      }
      else {
        return text;
      }
    }
    return '';
  }

  function getChuckSize(buffer:Uint8Array):number {
    if (buffer.byteLength === 4) {
      let size = new DataView(buffer.buffer).getUint32(0);
      if (size > 0) {
        return size;
      }
      else {
        return -1;
      }
    }
    return -1;
  }

  function decompressChunkData(chunkData:Uint8Array, chunkName:string):Uint8Array {
    const decompressedChunkSize = {
      MISC: 4800,
      XTER: 16384,
      XBLD: 16384,
      XZON: 16384,
      XUND: 16384,
      XTXT: 16384,
      XLAB: 6400,
      XMIC: 1200,
      XTHG: 480,
      XBIT: 16384,
      XTRF: 4096,
      XPLT: 4096,
      XVAL: 4096,
      XCRM: 4096,
      XPLC: 1024,
      XFIR: 1024,
      XPOP: 1024,
      XROG: 1024,
      XGRP: 3328,
    }

    let decompressedChunkData = new Uint8Array(decompressedChunkSize[chunkName]);
    for (let i = 0, lastOffset = 0, length = chunkData.byteLength; i < length; ++i) {
      let j = 0;
      let currentValue = getCurrentByteValue(chunkData, i);
      if (currentValue > 128) {
        let length = currentValue - 127;
        ++i;
        decompressedChunkData.set([].fill(getCurrentByteValue(chunkData, i), 0, length), lastOffset);
      }
      else {
        let count = currentValue;
        for (j; j < count; ++j, ++lastOffset) {
          ++i;
          decompressedChunkData.set([getCurrentByteValue(chunkData, i)], lastOffset);
        }
      }
    }
    return decompressedChunkData;
  }

  function getChunkType(name:string) {
    const SCENARIO_CHUNK_LIST = ['TMPL', 'PICT', 'TEXT', 'SCEN'];
    const STATISTIC_CHUNK_LIST = [
      'XPLC', 'XFIR', 'XPOP', 'XROG', 'XPLT', 'XCRM', 'XVAL', 'XTRF',
    ];
    const MAP_TILE_CHUNK_LIST = [
      'ALTM', 'XBIT', 'XBLD', 'XTER', 'XTXT', 'XZON', 'XUND'
    ];

    if (STATISTIC_CHUNK_LIST.indexOf(name) !== -1) {
      return 'statistic';
    }
    else if (MAP_TILE_CHUNK_LIST.indexOf(name) !== -1) {
      return 'tile';
    }
    else if (SCENARIO_CHUNK_LIST.indexOf(name) !== -1) {
      return 'scenario';
    }
    else {
      return 'city';
    }
  }

  function getSurfaceMap(tileDatas) {
    let surfaceMap:string[][] = Array(LENGTH_OF_EDGE).fill(Array(LENGTH_OF_EDGE));
    for (let y = 0; y < LENGTH_OF_EDGE; ++y) {
      for (let x = 0; x < LENGTH_OF_EDGE; ++x) {
        if (tileDatas.xbld[x][y] !== 0) {
          surfaceMap[x][y] = 'building';
        }
        else if (tileDatas.xzon[x][y] !== 0 && tileDatas.xzon[x][y] < 15) {
          surfaceMap[x][y] = 'zone';
        }
        else {
          surfaceMap[x][y] = 'terrain';
        }
      }
    }
    return surfaceMap;
  }

  function chunkSpecificProc(chunkData:Uint8Array, chunkName:string) {
    let chunkList = Object.getOwnPropertyNames(chunkSpecificHandler);
    if (chunkList.indexOf(chunkName) === -1) {
      return;
    }
    else {
      return chunkSpecificHandler[chunkName](chunkData);
    }
  }

  function getChunkBinaryData(data:Uint8Array, start, size):Uint8Array {
    return data.slice(start, start + size);
  }

  function analyzeData(data:ArrayBuffer) {
    const UNCOMPRESSED_CHUNK_LIST = ['CNAM', 'ALTM', 'TMPL', 'SCEN', 'TEXT', 'PICT'];

    let i:number, x:number, y:number, cnt:number;
    let cityData:any = {
      'scenario' : {},
      'tile' : {},
      'statistic' : {},
      'city' : {},
    };
    let offset = 0;
  
    let uint8CityData = new Uint8Array(data);
    
    let flag = true;
    while(flag) {
      let chunkName = getChunkName(uint8CityData.slice(offset, offset + CHUNK_NAME_LENGTH));
      if (chunkName === '') {
        flag = false;
        continue
      }
      else if(chunkName === 'SCDH') {
        offset += CHUNK_NAME_LENGTH;
      }
      else if(chunkName === 'FORM'){
        offset += 8;
      }
      else {
        offset += CHUNK_NAME_LENGTH;
        let chunkSize = getChuckSize(uint8CityData.slice(offset, offset + CHUNK_SIZE_LENGTH));

        if (chunkSize === -1) {
          flag = false;
          continue;
        }
        offset += CHUNK_SIZE_LENGTH
        let chunkData = getChunkBinaryData(uint8CityData, offset, chunkSize);

        if (chunkData.byteLength === 0) {
          flag = false;
          continue;
        }

        offset += chunkSize;
        if (UNCOMPRESSED_CHUNK_LIST.indexOf(chunkName) === -1) {
          chunkData = decompressChunkData(chunkData, chunkName);
        }
        let result = chunkSpecificProc(chunkData, chunkName);
        let chunkType = getChunkType(chunkName);
        if (chunkType === 'scenario' && chunkName === 'TEXT') {
          cityData[chunkType][`${result.textType}Text`] = result;
        }
        else {
          cityData[chunkType][chunkName.toLowerCase()] = result;
        }
      }
    }

    if (cityData.tile) {
      cityData.tile.surface = getSurfaceMap(cityData.tile);
    }
    else {
      return null;
    }
    cityData.fileSize = uint8CityData.byteLength;
    return JSON.stringify(cityData);
  }

  let _Sc2toJSON = {
    analyzeData: analyzeData,
  }

  if (isNode) {
    module.exports = _Sc2toJSON;
  }
  global.Sc2toJSON = _Sc2toJSON;

})((this || 0).self || global);