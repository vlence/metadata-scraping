const { test, expect } = require('@jest/globals');
const fs = require('fs').promises;
const path = require('path');
const getMetadata = require('./get_metadata');

test('parse metadata of html file', async () => {
  const html = await fs.readFile(path.resolve(__dirname, 'basic_metadata.html'));
  const metadata = await getMetadata(html.toString());

  expect(metadata).toMatchObject({
    title: 'Test',
    description: 'This is a test',
    images: [
      'testimg1.jpg',
      'testimg2.jpg'
    ]
  });
});

test('missing metadata returns valid object', async () => {
  const html = await fs.readFile(path.resolve(__dirname, 'blank.html'));
  const metadata = await getMetadata(html.toString());

  expect(metadata).toMatchObject({
    title: '',
    description: '',
    images: []
  });
});

test('skip images with empty src', async () => {
  const html = await fs.readFile(path.resolve(__dirname, 'bad_images.html'));
  const metadata = await getMetadata(html.toString());

  expect(metadata).toMatchObject({
    images: [
      'ok.jpg'
    ]
  });
});

test('returns basic open graph parameters', async () => {
  const html = await fs.readFile(path.resolve(__dirname, 'basic_og.html'));
  const metadata = await getMetadata(html.toString());

  expect(metadata).toMatchObject({
    ogTitle: 'Test',
    ogType: 'website',
    ogDescription: 'This is a test'
  });
});