import React from 'react';
import assets from 'reaction/assets';
import cheerio from 'cheerio';
import config from 'reaction/config';
import express from 'express';
import { renderToString } from 'react-dom/server';
import App from '../App';
import indexHtml from './index.html';

const app = express();

app.disable('x-powered-by');
app.use(express.static(config.paths.distPublic));

app.get('/*', async (req, res, next) => {
  const appHtml = renderToString(<App />);
  try {
    const $ = cheerio.load(indexHtml);
    console.log(config.title);
    $('title').text(config.title);
    $('#app').append(appHtml);
    $('body').append(
      `<script src="${assets.client.js}" defer crossorigin></script>`
    );
    return res.send($.html());
  } catch (err) {
    return next(err);
  }
});

export default app;
