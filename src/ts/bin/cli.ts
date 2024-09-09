import { program } from 'commander';
import {constants as fsConstants, readFileSync} from 'node:fs';
import { access, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { outputJSONText } from '../lib/sc2ktojson';

const __dirname = dirname(fileURLToPath(import.meta.url));

const packageInfo = JSON.parse(readFileSync(`${__dirname}/../package.json`).toString());

const fileAccessCheck = (inputFile: string) => {
  return access(inputFile, fsConstants.R_OK);
}

const fileFormatCheck = (inputFile: Buffer) => {
  const uint8arr = new Uint8Array(inputFile);
  try {
    const sc2kData = outputJSONText(uint8arr.buffer as ArrayBuffer);
    return Promise.resolve(sc2kData);
  }
  catch (error) {
    return Promise.reject(error);
  }
}

const convertSC2KtoJSON = async(...args: [string, {output: string}]) => {
  const [inputSC2File, options] = args;
  try {
    await fileAccessCheck(inputSC2File);
    const file = await readFile(inputSC2File);
    const JSONText = await fileFormatCheck(file);
    if (options.output) {
      await writeFile(options.output, JSONText);
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
    else if (error instanceof Error) {
      process.stderr.write(`${(<NodeJS.ErrnoException>error).errno} : ${error.message}\n`);
      process.exit((<NodeJS.ErrnoException>error).errno);
    }
  }
};

async function main() {
  program.version(packageInfo.version, '-v, --version', 'Output the current version')
    .arguments('<inputFile>')
    .requiredOption('-o, --output <outputFile>', 'Output JSON file')
    .description('Output JSON File from a SC2K city or scenario file')
    .usage('[options] <inputFile>')
    .action(convertSC2KtoJSON)
  return await program.parseAsync();
}

main();