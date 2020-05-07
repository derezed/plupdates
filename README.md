# Plupdates (Plugin Updates)

Node and Puppeteer driven tool to check your sites plugins for updates.

This tool will *not* update your plugins. It will only check for udpates.

## Requirements

- Node 8+
- Puppeteer
- An internet connection
  - Currently supported SMTP connections (require OAuth2 configuration):
    - Gmail
- A user in your CMS with access to plugins panel

## Currently supported CMS's

- WordPress
- Craft 3

## Set Up

- Run `npm i` to install depencendies
- Rename the following files
  - `config.example.json` -> `config.json`
  - `emailConfig.example.json` -> `emailConfig.json`
- In `config.json` add values to the key/value pairs based on the Config Options table below.
- In `emailConfig.json` add values to the key/value pairs based on the Email Config Options table below.

### Config Options

| Key                  | Description                                       | Example
|:---------------------|:--------------------------------------------------|:--------------------------------------|
| `name`               | Name of the site                                  | "Foo"
| `type`               | CMS Type                                          | "WordPress"
| `loginUrl`           | Url to login page                                 | "https://foo.com/wp-login.php"
| `user`               | CMS user name                                     | "fooAdmin"
| `password`           | CMS user password                                 | "hunter2"
| `pluginsUrl`         | Url to plugins page                               | "https://foo.com/wp-admin/plugins.php"
| `loginButton`        | CSS selector of submit button on login page       | "#wp-submit"
| `updatesElement`     | CSS selector of update text row on plugins page   | ".plugin-update .update-message"
| `recipient`          | Who to send the email to                          | "user@foo.com"

### Email Config Options

| Key               | Description                        | Example
|:------------------|:-----------------------------------|:----------------|
| `service`         | SMTP email service                 | "gmail"
| `user`            | SMTP email user                    | "bar@foo.com"
| `clientId`        | Client ID from SMTP api            | 
| `clientSecret`    | Client secret from SMTP api        | 
| `refreshToken`    | Refresh token for OAuth2           | 
| `accessToken`     | Access token for OAuth2            | 

## Running

To run Plupdates simply run `node plupdates.js` from a terminal in the root directory of the Plupdates project.