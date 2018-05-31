import cheerio from 'cheerio';
import express from 'express';
import { AppRegistry } from 'react-native';
import { config, assets } from 'reaction';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import ServerApp from './ServerApp';
import indexHtml from './index.html';

const app = express();

app.use(express.static(config.paths.distPublic));
app.get('/*', async (req, res, next) => {
  try {
    const context = {};
    AppRegistry.registerComponent('App', () => ServerApp);
    const { element, getStyleElement } = AppRegistry.getApplication('App', {
      initialProps: {
        context,
        location: req.url
      }
    });
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
    if (context.url) return res.redirect(301, context.url);
    return res.send($.html());
  } catch (err) {
    return next(err);
  }
});

export default app;
