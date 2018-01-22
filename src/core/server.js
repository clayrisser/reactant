import React from 'react';
import ReactDOMServer from 'react-dom/server';
import cheerio from 'cheerio';
import express from 'express';
import fs from 'fs';
import path from 'path';
import App from './App';
import config from '../config';

const context = { config };
const scripts = ['client.js'];
const app = express();

app.use('/public', express.static(path.resolve(__dirname, '../../public')));

app.get('/', (req, res) => {
  const markup = ReactDOMServer.renderToString(<App context={context} />);
  const template = cheerio.load(
    fs.readFileSync(path.resolve(__dirname, '../../public/index.html')).toString()
  );
  template('#app').html(markup);
  return res.send(template.html());
});

app.listen(config.port, (err) => {
  if (err) throw err;
  console.log(`listening on port ${config.port}`);
});
