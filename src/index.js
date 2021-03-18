
const { readTextFile, readJsonFile, readCsvFile, loadEnvVars, validateEnvVars, parseBoolean } = require("./util.js");
const { sendBatchEmail } = require("./sendEmail");

const REQUIRED_ENV_VARS = [
  "DATA_DIRECTORY"
]

loadEnvVars("../.env.json");
validateEnvVars(REQUIRED_ENV_VARS);

const DATA_DIRECTORY = "../" + process.env.DATA_DIRECTORY;
const EMAIL_RECIPIENT_FILE_PATH = DATA_DIRECTORY + "emails.csv";
const HTML_TEMPLATE_PATH = DATA_DIRECTORY + "template.html";
const TEXT_TEMPLATE_PATH = DATA_DIRECTORY + "template.txt";

// Runtime
async function main() {
  console.log("\n🏎 Start!");
  
  const textTemplate = readTextFile(TEXT_TEMPLATE_PATH);
  const htmlTemplate = readTextFile(HTML_TEMPLATE_PATH);
  const emailRecipients = readEmailRecipientFile();

  await sendBatchEmail({
    emailRecipients, 
    emailPlainText: textTemplate, 
    emailHtml: htmlTemplate
  })

  console.log("🌙 That's all, folks!");
}

function readEmailRecipientFile() {
  console.log(`🌀 Reading email recipient CSV file (${EMAIL_RECIPIENT_FILE_PATH})`);
  const {data: emailRecipients} = readCsvFile(EMAIL_RECIPIENT_FILE_PATH);
  console.log(`📂 Found ${emailRecipients.length} recipients`);
  return emailRecipients.map(({firstName, lastName, email}) => {
    return {firstName, lastName, email}
  })
}

main();