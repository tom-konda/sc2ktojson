## About
This JavaScript library converts from .sc2 (SC2K city file) or .scn (SC2K scenario file) file to JSON.

## Support Browsers
* Firefox, Google Chrome
* MS Edge, Safari works probabry.

## Usage
### CLI
```bash
$ sc2ktojson [options] <inputFile>
```

Options

```bash
    -h, --help                 output usage information
    -V, --version              output the version number
    -o, --output <outputFile>  Output JSON file
```

### Library
#### Browser (Legacy Style)

```html:browser.html
<!DOCTYPE html>
<html>
  <head>
    <title>Demo</title>
    <script src="../../lib/sc2ktojson.js"></script>
    <script>
      'use strict';
      let xhr = new win.XMLHttpRequest();
      const sc2fileURL = './sc2ktojsonTest.sc2';

      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          let cityData = sc2ktojson.analyze(xhr.response);
        }
      }

      xhr.open('GET', sc2fileURL);
      xhr.responseType = 'arraybuffer';
      xhr.send();
    </script>
  </head>
</html>
```

#### Browser (ES Modules)

```html:es_modules.html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import sc2ktojson from './sc2ktojson.js';
    
    fetch('./sc2ktojsonTest.sc2')
    .then(
      (result) => {
        return result.arrayBuffer();
      }
    ).then(
      (buffer) => {
        const cityData = sc2ktojson.analyze(buffer);
      }
    );
  </script>
</head>
</html>
```

#### Web worker

```js:worker.js
importScripts('../../lib/sc2ktojson.js');

self.addEventListener(
    'message',
    function(event){
        let cityData = event.data;
        self.postMessage(self.sc2ktojson.analyze(cityData));
        self.close();
    },
    false
);
```

#### Node.js

```js:node.js
const sc2ktojson = require('../../sc2ktojson');

let file = fs.readFileSync(`PATH_TO_SCNFILE/test.scn`);

// Convert from buffer to Uint8Array
let uint8arr = new Uint8Array(file);
let json = sc2ktojson.analyze(uint8arr.buffer);
```

## Output Format

```
{
  scenario : {
    tmpl : [0-255, 0-255, ...], // optional, arbitrary items
    text : {
      opening : [0-255, 0-255, ...], // scenario opening text. arbitrary items
      selection : [0-255, 0-255, ...], // scenario selection text. arbitrary items
    },
    scen : {
      disaster : integer,
      disasterCoordinate : {
        x : integer,
        y : integer,
      },
      limit : integer,
      condPop : integer,
      condRPop : integer,
      condCPop : integer,
      condIPop : integer,
      condFund : integer,
      condVal : integer,
      condEdu : integer,
      condPol : integer,
      condCri : integer,
      condTra : integer,
      condBld1ID : integer,
      condBld2ID : integer,
      condBld1Tiles : integer,
      condBld2Tiles : integer,
    },
    pict : {
      width : integer,
      height : integer,
      picture : [
        [0-255, 0-255, ...], // same as width
      ], // same as height
    }
  }, // optional, .scn file only
  tile : {
    altm : [
      [
        {
          isWater : 0-1,
          height : 0-31,
          binaryText: string,
        }, ...
      ], // 128 items
    ], // 128 items
    xter : [
      [0-255, 0-255, ...], // 128 items
    ], // 128 items
    xbld : [
      [0-255, 0-255, ...], // 128 items
    ], // 128 items
    xzon : [
      [
        {
          zone: 0-15,
          binaryText: string,
        },
      ], // 128 items
    ], // 128 items,
    xund : [
      [0-255, 0-255, ...], // 128 items
    ], // 128 items
    xtxt : [
      [0-255, 0-255, ...], // 128 items
    ], // 128 items
    xbit : [
      [
        {
          isSalty : boolean,
          isWaterCovered : boolean,
          isWaterProvided : boolean,
          isPiped : boolean,
          isPowered : boolean,
          binaryText: string,
        }, ...
      ], // 128 items
    ], // 128 items
    surface : [
      [
        "xbld" | "xzon" | "xter", ... // 128 items
      ], // 128 items
    ],
  },
  statistic : {
    xtrf : 2x2AreaFormat, // Traffic map data
    xplt : 2x2AreaFormat, // Pollution map data
    xval : 2x2AreaFormat, // Value map data
    xcrm : 2x2AreaFormat, // Crime map data
    xplc : 4x4AreaFormat, // Police coverage map data
    xfir : 4x4AreaFormat, // Fire coverage map data
    xpop : 4x4AreaFormat, // Population density map data
    xrog : 4x4AreaFormat, // Rate of growth map data 
    xgrp : {
      citySize : GraphFormat,
      residents : GraphFormat,
      commerce : GraphFormat,
      industry : GraphFormat,
      traffic : GraphFormat,
      pollution : GraphFormat,
      value : GraphFormat,
      crime : GraphFormat,
      power : GraphFormat,
      water : GraphFormat,
      health : GraphFormat,
      education : GraphFormat,
      unemployment : GraphFormat,
      GNP : GraphFormat,
      nationalPop : GraphFormat,
      fedRate : GraphFormat,
    },
  }
  city : {
    cnam : [0-255, 0-255, ...], // 32 items
    misc : [
      [0-255, 0-255, ...], // 4 items
      [],
    ], // 1200 items
    xlab : [
      {
        length : integer,
        label: [0-255, 0-255, ...] // 24 items
      }
    ],
    xmic : [
      {
        tileNum : 0-255,
        microsim : [0-255, 0-255, ...] // 6 items
      }, ... // 150 items
    ],
    xthg : [0-255, 0-255, ...], // 480 items
  },
  fileSize : integer
}
```

### 2x2AreaFormat

```
[
  [0-255, 0-255, ...], // 64 items
], // 64 items
```

### 4x4AreaFormat

```
[
  [0-255, 0-255, ...], // 32 items
], // 32 items
```

### GraphFormat

```
{
  year : [integer, integer, ...] // 12 items
  decade : [integer, integer, ...] // 20 items
  century : [integer, integer, ...] // 20 items
}
```

## How to build

1. Clone the repo from github `git clone https://github.com/tom-konda/sc2ktojson.git` 
2. Change current directory `cd sc2ktojson` 
3. Run `npm install`
4. Run `npm run build`

## License
Licensed under the MIT

## Acknowledgement

- [SIMCITY 2000 FILE FORMAT (MS-DOS VERSION)](http://djm.cc/simcity-2000-info.txt) for help to understand .sc2 file format. (in English)
- [シムシティ2000 調査研究室 「その6 シナリオデータの構造」](http://sc2.s27.xrea.com/sc2/research/06.html) for help to understand .scn file format. (in Japanese)