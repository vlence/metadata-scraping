const chromium = require('chrome-aws-lambda');
const cacheControl = require('@tusbar/cache-control');

(async function () {
  const browser = await chromium.puppeteer.launch();
  
  const page = await browser.newPage();
  // use cache-control header to decide how
  // long to cache response. cache for 5 mins
  // by default.
  page.on('response', async response => {
    const headers = response.headers();
    const parsed = cacheControl.parse(headers['cache-control']);

    // console.log(page.url());
    if (page.url() == 'about:blank') {
      console.log(headers);
      console.log(parsed);
    }
  });
  
  await page.goto('https://www.google.com')
  await browser.close();
})();