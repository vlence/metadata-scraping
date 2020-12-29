const aws = require('aws-sdk');

const isTest = process.env.JEST_WORKER_ID;
const config = {
  convertEmptyValues: true,
  ...(isTest && {
    endpoint: 'localhost:8000',
    sslEnabled: false,
    region: 'local-env',
  }),
};

// our dynamodb client automatically adapts
// to a test environment
const dynamodb = new aws.DynamoDB(config);

module.exports.get = get;
module.exports.put = put;

/**
 * Get the cached metadata for the given url.
 * 
 * @param {string} url The url
 * 
 * @return {Promise<any>}
 */
function get(url) {
  return dynamodb.getItem({
    TableName: 'cache',
    Key: {
      url: {
        S: url
      }
    }
  }).promise().then(data => data.Item);
}

/**
 * Cache the metadata for the given url.
 * 
 * @param {string} url The url
 * @param {any} metadata The metadata to cache
 * @param {number} ttl How long this should be cached, in seconds
 * 
 * @return {Promise<any>}
 */
function put(url, metadata, ttl = 300) {
  // ttl should be in unix epoch format
  ttl = Date.now() + (ttl * 1000);
  
  return dynamodb.putItem({
    TableName: 'cache',
    Item: {
      url: { S: url },
      response: { S: JSON.stringify(metadata) },
      ttl: { N: '' + ttl }
    }
  }).promise();
}