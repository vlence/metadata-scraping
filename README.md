# Metadata Scraper

A simple application that can scrape a URL and return some basic metadata.

## Getting started

- Clone this repo
- Run `npm install`

## How it works

- You send post request to `https://3r6ri5avxe.execute-api.us-east-1.amazonaws.com/dev/` with this JSON body
    ```json
    {
      "url": "https://www.example.com/"
    }
    ```

- Application gets HTML of the URL using puppeteer

- After extracting title, description and image sources, open graph parameters are extracted using `open-graph-scraper`

- All metadata is combined and returned as JSON