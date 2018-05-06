import App from '~/App';
import cheerio from 'cheerio';
import express from 'express';
import indexHtml from './index.html';
import { AppRegistry } from 'react-native';
import { config, assets } from 'reaction';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';

const app = express();

app.disable('x-powered-by');
app.use(express.static(config.paths.distPublic));
app.get('/*', async (req, res, next) => {
  try {
    AppRegistry.registerComponent('App', () => App);
    const { element, getStyleElement } = AppRegistry.getApplication('App', {});
    const appHtml = renderToString(element);
    const appCss = renderToStaticMarkup(getStyleElement());
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
