const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");


const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);
const resolveFilePath = filepath => path.resolve(process.cwd(), filepath)

const readJsonFile = pipe(
  resolveFilePath,
  fs.readFileSync,
  buffer => buffer.toString(),
  JSON.parse
)

function readCsvFile(path) {
  return Papa.parse(fs.readFileSync(path).toString(), {
    header: true,
    dynamicTyping: true
  });
}

// Import env vars from .env.json

function loadEnvVars(path) {
  const envVars = readJsonFile(path);
  Object.entries(envVars).forEach(([key, value])=>{
    process.env[key] = value;
  });
}

function validateEnvVars(envVars) {
  envVars.forEach(envVar => {
    if(!process.env[envVar]) throw `Missing required env var "${envVar}"`;
  })
}





exports.readJsonFile = readJsonFile;
exports.loadEnvVars = loadEnvVars;
exports.validateEnvVars = validateEnvVars;
exports.readCsvFile = readCsvFile;