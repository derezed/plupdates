const puppeteer = require("puppeteer");
const delay = require("@trendyminds/delay");
const nodemailer = require("nodemailer");
const CONFIG = require("./config/config.json");
const emailConfig = require("./config/emailConfig");

this.browser = null;
this.page = null;
this.currentSite = null;

async function notifyOfUpdates(preppedArray = null) {
  let updatesList = "";

  preppedArray.forEach((update)=> {
    updatesList += `<li>${update}</li>`;
  })
  
  const date = new Date().toJSON().slice(0,10).replace(/-/g,'/');

  const emailMarkup = `
  <p>The following items have updates on ${this.currentSite.name} as of: ${date}.</p>
  <ul>
  ${updatesList}
  </ul>
  <p>This is an automated email. You can respond to it, but why would you do that to me?</>
  `;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: emailConfig.user,
      clientId: emailConfig.clientId,
      clientSecret: emailConfig.clientSecret,
      refreshToken: emailConfig.refreshToken,
      accessToken: emailConfig.accessToken
    }
  });

  const mailOptions = {
    from: this.emailConfig.user,
    to: this.currentSite.recipient,
    subject: `${this.currentSite.name} has updates availiable.`,
    html: emailMarkup
  }

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });

  await this.browser.close();
}

async function prepUpdatesArray(availableUpdates) {
  const preppedArray = [];

  availableUpdates.forEach((update) => {
    if (this.currentSite.type.toLowerCase() === "wordpress") {
      let pluginName = update.split("version of ")[1];
      pluginName = pluginName.split(" available.")[0];
      preppedArray.push(pluginName);
    } else if (this.currentSite.type.toLowerCase() === "craft 3") {
      preppedArray.push(update);
    }
  });

  await notifyOfUpdates(preppedArray);
}

async function queryForUpdates() {
  await delay(5000);
  const sel = this.currentSite.updatesElement;

  const availableUpdates = await this.page.evaluate((sel) => {
    let elements = Array.from(document.querySelectorAll(sel));
    let updates = elements.map(element => {
        return element.textContent
    });

    return updates;
  }, sel);
  await prepUpdatesArray(availableUpdates);
}

async function navigateToPlugins() {
  await this.page.goto(this.currentSite.pluginsUrl);
  await queryForUpdates();
}

async function login() {
  await delay(500);

  if (this.currentSite.type.toLowerCase() === "wordpress") {
    await this.page.type("#user_login", this.currentSite.user);
    await delay(500);
    await this.page.type("#user_pass", this.currentSite.password);
    await delay(500);
  } else if (this.currentSite.type.toLowerCase() === "craft 3") {
    await this.page.type("#loginName", this.currentSite.user);
    await delay(500);
    await this.page.type("#password", this.currentSite.password);
    await delay(500);
  }

  await this.page.click(this.currentSite.loginButton);

  await this.page.waitForNavigation();
  await navigateToPlugins();
}

async function init() {
  for (let i = 0; i < CONFIG.length; i++) {
    this.currentSite = CONFIG[i].site;
    
    this.browser = await puppeteer.launch({headless: false});
    this.page = await this.browser.newPage();
    await page.goto(this.currentSite.loginUrl);

    await login();
  }
}

init();