import commander = require('commander');
import fs = require('fs');
import { promisify } from 'util';
const packageInfo = JSON.parse(fs.readFileSync(`${__dirname}/../package.json`).toString());
const sc2ktojson = <SC2KtoJSONStatic>require('../index');

const fileAccessCheck = (inputFile: string) => {
  return promisify(fs.access)(
    inputFile,
    fs.constants.R_OK
  );
}

const fileFormatCheck = (inputFile: Buffer) => {
  const uint8arr = new Uint8Array(inputFile);
  try {
    const sc2kData = sc2ktojson.outputJSONText(uint8arr.buffer as ArrayBuffer);
    return Promise.resolve(sc2kData);
  }
  catch (error) {
    return Promise.reject(error);
  }
}

const convertSC2KtoJSON = async (inputSC2File: string, options: any) => {
  try {
    await fileAccessCheck(inputSC2File);
    const file = await promisify(fs.readFile)(inputSC2File);
    const JSONText = await fileFormatCheck(file);
    if (options.output) {
      await promisify(fs.writeFile)(options.output, JSONText);
      process.stdout.write(`${options.output} was created successfully.\n`);
    }
    else {
      process.stdout.write(JSONText);
    }
  }
  catch (error) {
    console.log(error);
    console.error('Cannot write a JSON file.');
    if(error instanceof RangeError) {
      process.stderr.write(`-1 : ${error.message}\n`);
      process.exit(-1);
    }
    else if (error as NodeJS.ErrnoException instanceof Error) {
      process.stderr.write(`${error.errno} : ${error.message}\n`);
      process.exit(error.errno);
    }
  }
};

commander.version(packageInfo.version)
  .command('<inputFile>', 'Path to a SC2K .sc2 or .scn file')
  .option('-o, --output <outputFile>', 'Output JSON file')
  .description('Output JSON File from a SC2K city or scenario file')
  .usage('[options] <inputFile>')
  .action(convertSC2KtoJSON)
  .parse(process.argv);