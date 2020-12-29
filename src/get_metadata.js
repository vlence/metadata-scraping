const ogs = require('open-graph-scraper');
const cheerio = require('cheerio');

module.exports = getMetadata;

/**
 * Returns the metadata, including og parameters if any,
 * of the given url.
 * 
 * @param {string} page The html page
 * 
 * @return {any}
 */
async function getMetadata(page) {
  const $ = cheerio.load(page);
  const title = $('title').text();
  const description = $('meta[name=description]').attr('content') || '';
  const images = $('img').map((_, elem) => $(elem)).toArray();
  const ogMetadata = await ogs({html: page}).then(data => data.result);

  // remove og metadata operation results
  delete ogMetadata.requestUrl;
  delete ogMetadata.success;

  const metadata = {
    title: title.trim(),
    description: description.trim(),
    images: [],
    ...ogMetadata
  };

  metadata.title = title.trim();
  metadata.description = description.trim();
  metadata.images = images.filter(img => img.attr('src') && img.attr('src').trim() !== '') // remove <img> with empty src
                          .map(img => img.attr('src').trim());
  
  return metadata;
}