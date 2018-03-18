import ReactDOMServer from 'react-dom/server';
import express from 'express';
import { AppRegistry } from 'react-native';
import App from '../App';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
const app = express();

app.disable('x-powered-by');
app.use(express.static(process.env.RAZZLE_PUBLIC_DIR));
app.get('/*', (req, res) => {
  AppRegistry.registerComponent('App', () => App);
  const { element, getStyleElement } = AppRegistry.getApplication('App', {});
  const html = ReactDOMServer.renderToString(element);
  const css = ReactDOMServer.renderToStaticMarkup(getStyleElement());
  res.send(`<!doctype html>
<html lang="">
<head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta charSet='utf-8' />
  <title>Welcome to Razzle</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${css}
  ${
    process.env.NODE_ENV === 'production'
      ? `<script src="${assets.client.js}" defer></script>`
      : `<script src="${assets.client.js}" defer crossorigin></script>`
  }
  </head>
  <body>
    <div id="root">${html}</div>
  </body>
</html>`);
});

export default app;
