import commander = require('commander');
import fs = require('fs');
const packageInfo = JSON.parse(fs.readFileSync(`./package.json`).toString());
const sc2tojson = <SC2toJSONStatic>require('../index');

const fileAccessCheck = (inputFile: string) => {
  return new Promise(
    (resolve, reject) => {
      let isfileReadable: number;
      if (typeof fs.constants === 'undefined') {
        // for Node 4.x
        isfileReadable = fs.R_OK;
      }
      else {
        isfileReadable = fs.constants.R_OK;
      }
      fs.access(
        inputFile,
        isfileReadable,
        (error) => {
          error ? reject(error) : resolve(inputFile);
        }
      );
    }
  );
}

const fileFormatCheck = (inputfile: string) => {
  return new Promise(
    (resolve, reject) => {
      const file = fs.readFileSync(inputfile);
      const uint8arr = new Uint8Array(file);
      try {
        const sc2Data = sc2tojson.outputJSONText(uint8arr.buffer);
        resolve(sc2Data);
      }
      catch (error) {
        reject(error);
      }
    }
  );
}

const outputJSON = (JSONtext:string, options: any) => {
  return new Promise(
    (resolve, reject) => {
      const outputFile = options.output;
      if (outputFile) {
        fs.writeFile(
          outputFile,
          JSONtext,
          (error) => {
            error ? reject(error) : resolve(outputFile);
          }
        )
      }
      else {
        process.stdout.write(JSONtext);
        resolve();
      }
    }
  )
}

const convertSC2toJSON = (inputSC2File: string, options: any) => {
  fileAccessCheck(inputSC2File)
    .then(
    fileFormatCheck,
    (error) => {
      console.error('Cannot Read File.');
      process.stderr.write(`${error.errno} : ${error.message}\n`);
      process.exit(error.errno);
    }
    ).then(
    (json:string) => outputJSON(json, options),
    (error: SyntaxError) => {
      console.error('This is wrong SC2K file.');
      console.error(error);
      process.stderr.write(`${error.name} : ${error.message}\n`);
      process.exit(1);
    }
    ).then(
    (outputFile) => {
      outputFile ? process.stdout.write(`${outputFile} was created successfully.\n`) : null;
    },
    (error) => {
      console.error('Cannot write a JSON file.');
      process.stderr.write(`${error.errno} : ${error.message}\n`);
      process.exit(error.errno);
    }
    );
}

commander.version(packageInfo.version)
  .command('<inputFile>', 'Path to a SC2K .sc2 or .scn file')
  .option('-o, --output <outputFile>', 'Output JSON file')
  .description('Output JSON File from a SC2K city or scenario file')
  .usage('[options] <inputFile>')
  .action(convertSC2toJSON)
  .parse(process.argv);