const fs = require("fs");
var lockFile = require('lockfile');

const SEND_STATUS = {
  "NOT_SENT": "NOT_SENT",
  "SUCCESS": "SUCCESS",
  "FAILED": "FAILED"
}


function createProgressFileIfNotExists({emailRecipients, path: PROGRESS_FILE_PATH}) {
  if(!fs.existsSync(PROGRESS_FILE_PATH)) {
    createEmailProgressFile({emailRecipients, path: PROGRESS_FILE_PATH});
  } else {
    console.log(`ℹ️ Using existing progress file (${PROGRESS_FILE_PATH})`);
  }
}

function createEmailProgressFile({emailRecipients, path}) {
  console.log(`🌀 Creating progress file for ${emailRecipients.length} recipients (${path})`);
  const fileContents = {};
  emailRecipients.forEach(row => {
    fileContents[row.email] = {
      status: SEND_STATUS.NOT_SENT,
      sentAt: null,
      meta: {}
    };
  })
  if(fs.existsSync(path)) throw `❗️ Cannot create new progress file. A progress file already exists (File: ${path})`
  fs.writeFileSync(path, JSON.stringify(fileContents));
  console.log(`✅ Created progress file`);
}

exports.createProgressFileIfNotExists = createProgressFileIfNotExists;