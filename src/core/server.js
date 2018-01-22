import React from 'react';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import App from './App';
import Html from './Html';
import config from '../config';

const context = { config };
const app = express();

app.get('/', (req, res) => {
  const children = ReactDOMServer.renderToString(<App context={context} />);
  const html = ReactDOMServer.renderToStaticMarkup(<Html>
    {children}
  </Html>);
  return res.send(`<!doctype html>${html}`);
});

app.listen(config.port, (err) => {
  if (err) throw err;
  console.log(`listening on port ${config.port}`);
});
