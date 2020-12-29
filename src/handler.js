'use strict';

const chromium = require('chrome-aws-lambda');
const getMetadata = require('./get_metadata');


module.exports.getMetadata = async (event, context) => {
  // don't wait for empty event loop because
  // we don't want to waste cycles launching
  // a new browser for every request
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    // using puppeteer to visit url because
    // otherwise websites might flag traffic
    // as a bot and we'll instead get a captcha
    // page
    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const body = JSON.parse(event.body);
    const url = body.url;
    const page = await browser.newPage();
    await page.goto(url);

    const html = await page.content();
    const metadata = await getMetadata(html);

    await browser.close();

    return {
      statusCode: 200,
      body: JSON.stringify(metadata)
    };
  }
  catch (e) {
    console.error(e);

    return {
      statusCode: 500,
      body: JSON.stringify(e.message)
    }
  }
};
