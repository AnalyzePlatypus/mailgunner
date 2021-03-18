const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

const fs = require('fs');
const get = require('lodash.get');

async function sendBatchEmail({emailConfigs, emailPlainText, emailHtml, mocks}) {
  console.log("🌀 Enqueuing email to Mailgun...");

  const from = `${process.env.EMAIL_TEMPLATE_FROM_NAME} <${process.env.EMAIL_TEMPLATE_FROM_ADDRESS}>`;
  const recipients = emailConfigs.map(e => `${e.firstName} ${e.lastName} ${e.email}`)

  const recipientVariables = Object.fromEntries(emailConfigs.map(e => [e.email, e]));

  const request = {
    from,
    to: recipients,
    subject: process.env.EMAIL_TEMPLATE_SUBJECT,
    text: emailPlainText,
    html: emailHtml,
    'recipient-variables': JSON.stringify(recipientVariables),
    "o:dkim": process.env.MAILGUN_ENABLE_DKIM || 'yes',
    "o:tracking": process.env.MAILGUN_ENABLE_TRACKING || 'yes',
    'o:testmode': 'yes',
    "h:Reply-To": process.env.EMAIL_TEMPLATE_REPLY_TO_EMAIL
  }
  console.log("Email request:");
  console.log(request);
  

  try {
    const response = await mailgunSend(request)
    console.log(response);
  } catch(error) {
    console.error(error);
  } 
}


async function mailgunSend(request) {
  const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY
  });
  
  return new Promise((resolve, reject) =>{
    mg.messages.create(process.env.MAILGUN_DOMAIN, request).
    then(resolve)
    .catch(reject);
  })
}

exports.sendBatchEmail = sendBatchEmail;