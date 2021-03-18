const fs = require('fs');
var lockFile = require('lockfile');

const { readJsonFile, readCsvFile, loadEnvVars, validateEnvVars } = require("./util.js");
const { createProgressFileIfNotExists } = require("./emailProgressFile.js");
const { sendBatchEmail } = require("./sendEmail");

const REQUIRED_ENV_VARS = [
  "DATA_DIRECTORY"
]


// Helpers

// Runtime
async function main() {
  console.log("\n🏎 Start!");

  loadEnvVars("../.env.json");
  validateEnvVars(REQUIRED_ENV_VARS);

  const DATA_DIRECTORY = "../" + process.env.DATA_DIRECTORY;
  const CONFIG_FILE_PATH = DATA_DIRECTORY + "config.json";
  const EMAIL_RECIPIENT_FILE_PATH = DATA_DIRECTORY + "emails.csv";
  const PROGRESS_FILE_PATH = DATA_DIRECTORY + "progress.json"
  const HTML_TEMPLATE_PATH = DATA_DIRECTORY + "template.html";
  const TEXT_TEMPLATE_PATH = DATA_DIRECTORY + "template.txt";

  const config = readJsonFile(CONFIG_FILE_PATH);

  console.log(`🌀 Reading email recipient CSV file (${EMAIL_RECIPIENT_FILE_PATH})`);
  const {data: emailRecipients} = readCsvFile(EMAIL_RECIPIENT_FILE_PATH);
  console.log(`📂 Found ${emailRecipients.length} recipients`);


  
  const textTemplate = fs.readFileSync(TEXT_TEMPLATE_PATH).toString();
  const htmlTemplate = fs.readFileSync(HTML_TEMPLATE_PATH).toString();


  const emailConfigs = emailRecipients.map(({firstName, lastName, email}) => {
    return {firstName, lastName, email}
  })

  await sendBatchEmail({
    emailConfigs, 
    emailPlainText: textTemplate, 
    emailHtml: htmlTemplate
  })

  console.log("🌙 That's all, folks!");
}

main();