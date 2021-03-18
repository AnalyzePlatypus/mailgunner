const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

const { parseBoolean } = require("./util.js");

async function sendBatchEmail({emailRecipients, emailPlainText, emailHtml, mocks}) {
  console.log("🌀 Enqueuing email to Mailgun...");

  const sender = `${process.env.EMAIL_TEMPLATE_FROM_NAME} <${process.env.EMAIL_TEMPLATE_FROM_ADDRESS}>`;
  const recipients = emailRecipients.map(e => `${e.firstName} ${e.lastName} ${e.email}`)

  const recipientVariables = Object.fromEntries(emailRecipients.map(e => [e.email, e]));

  const request = {
    from: sender,
    to: recipients,
    subject: process.env.EMAIL_TEMPLATE_SUBJECT,
    text: emailPlainText,
    html: emailHtml,
    'recipient-variables': JSON.stringify(recipientVariables),
    "o:dkim": process.env.MAILGUN_ENABLE_DKIM || 'yes',
    "o:tracking": process.env.MAILGUN_ENABLE_TRACKING || 'no',
    "h:Reply-To": process.env.EMAIL_TEMPLATE_REPLY_TO_EMAIL
  }

  if(parseBoolean(process.env.MAILGUN_ENABLE_TEST_MODE)) {
    console.log(`🧪 Test mode engaged. Emails will be accepted by Mailgun but not actually sent.`);
    request['o:testmode'] = 'yes';
  }

  try {
    const response = await mailgunSend(request)
    console.log(response);
    console.log(`✅ Sent email to ${emailRecipients.length} recipients`);
  } catch(error) {
    console.error(error);
    throw error;
  } 
}


async function mailgunSend(request) {
  const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY
  });
  
  return new Promise((resolve, reject) =>{
    mg.messages.create(process.env.MAILGUN_DOMAIN, request).
    then(resolve).
    catch(reject);
  })
}

exports.sendBatchEmail = sendBatchEmail;