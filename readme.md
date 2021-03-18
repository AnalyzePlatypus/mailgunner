# Mailgunner

Send batch emails from the command line!

1. Drop a CSV containing the columns `firstName`, `lastName`, `email` into `/data`
2. Drop in `template.txt` and `template.html`
3. Uncomment `sendEmail` `'o:testmode': 'yes',`
4. `cd src` and `node index.js`

All emails will be sent!

