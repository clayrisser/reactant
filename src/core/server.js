import App from '~/App';
import assets from 'reaction/assets';
import cheerio from 'cheerio';
import config from 'reaction/config';
import express from 'express';
import indexHtml from '~/core/index.html';
import { AppRegistry } from 'react-native';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';

const app = express();

app.disable('x-powered-by');
app.use(express.static(config.paths.distPublic));

app.get('/*', async (req, res, next) => {
  AppRegistry.registerComponent('App', () => App);
  const { element, getStyleElement } = AppRegistry.getApplication('App', {});
  const appHtml = renderToString(element);
  const appCss = renderToStaticMarkup(getStyleElement());
  try {
    const $ = cheerio.load(indexHtml);
    $('title').text(config.title);
    $('head').append(appCss);
    $('#app').append(appHtml);
    $('body').append(
      `<script src="${assets.client.js}" defer${
        config.environment === 'production' ? ' crossorigin' : ''
      }></script>`
    );
    return res.send($.html());
  } catch (err) {
    return next(err);
  }
});

export default app;
