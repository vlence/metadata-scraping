'use strict';

const chromium = require('chrome-aws-lambda');
const cacheControl = require('@tusbar/cache-control');
const cache = require('./cache');
const getMetadata = require('./get_metadata');

module.exports.getMetadata = async (event, context) => {
  try {
    // get and return cached response if it exists
    // and isn't stale
    const body = JSON.parse(event.body);
    const url = body.url;
    const now = Date.now();
    const cached = await cache.get(url);

    if (cached && now < cached.ttl.N) {
      return {
        statusCode: 200,
        body: cached.response.S
      };
    }

    // if we're here it means there was no cached
    // response
    let ttl = null;

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

    const page = await browser.newPage();
    // use cache-control header to decide how
    // long to cache response. cache for 5 mins
    // by default.
    page.on('response', response => {
      const headers = response.headers();
      const parsed = cacheControl.parse(headers['cache-control']);
      
      if (page.url() == 'about:blank') {
        // the response event is fired for all responses
        // including css and js. we are only interested
        // in the first request. the easiest way to detect
        // that is when the page url is about:blank
        ttl = parsed.maxAge || 300;
      }
    });

    const metadata = await page.goto(url)
      .then(() => page.content())
      .then(getMetadata);

    // close browser and cache the response
    await Promise.all([browser.close(), cache.put(url, metadata, ttl)]);

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
