# Mailgunner

Send batch emails from the command line, powered by [Mailgun batches](https://documentation.mailgun.com/en/latest/user_manual.html#batch-sending).

## Installation

Just clone the repo.

## Usage

### Setup
  * Create and configure `.env.json` with your Mailgun API key (Copy `.example.env.json` and customize)
  * Create a `data` directory in project root

### On every run:
1. In `./data`, add:
  * A CSV file `emails.csv` containing the columns `firstName`, `lastName`, `email`
  * Plaintext email: `template.txt` 
  * HTML email: `template.html`
2. `npm run send`

All emails will be sent!

> 💡 You can test without sending real email by engaging [Mailgun test mode](https://documentation.mailgun.com/en/latest/user_manual.html#sending-in-test-mode): Set the env var `MAILGUN_ENABLE_TEST_MODE` to `true`

> 📝 I recommend the phenomenal [MJML.app](https://mjmlio.github.io/mjml-app/) for designing and creating HTML emails.