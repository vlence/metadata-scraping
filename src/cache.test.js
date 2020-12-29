const cache = require('./cache');

test('cache should work', async () => {
  const url = 'some url';
  const response = {title: 'some response'};
  const ttl = 0;

  const cached = await cache.put(url, response, ttl)
    .then(() => cache.get(url));

  expect(cached.response.S).toEqual(JSON.stringify(response));
});