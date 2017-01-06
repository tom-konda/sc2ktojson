#!/usr/bin/env node

import * as fs from 'fs';
import * as commander from 'commander';
const packageInfo = JSON.parse(fs.readFileSync('../package.json').toString());
// import sc2tojson from '../lib/sc2tojson';



commander.version(packageInfo.version)
  .command('<inputFile>', 'Path to a SC2K .sc2 or .scn file');