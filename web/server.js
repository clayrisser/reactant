import Cookies from 'cookies';
import cheerio from 'cheerio';
import express from 'express';
import { AppRegistry } from 'react-native';
import { config, assets } from 'reaction-base';
import { persistStore } from 'redux-persist';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import {
  CookieStorage,
  NodeCookiesWrapper
} from 'redux-persist-cookie-storage';
import createStore from '../src/store/create';
import indexHtml from './index.html';
import initialState from '../src/store/initialState';

const app = express();
const context = {};

app.use(express.static(config.paths.distPublic));
app.use(Cookies.express());
app.get('/*', async (req, res, next) => {
  try {
    context.cookieJar = new NodeCookiesWrapper(new Cookies(req, res));
    context.store = await createStore(context);
    context.persistor = await new Promise(resolve => {
      const persistor = persistStore(context.store, initialState, () => {
        return resolve(persistor);
      });
    });
    const ServerApp = require('./ServerApp').default;
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
    await context.persistor.flush();
    res.removeHeader('Set-Cookie');
    return res.send($.html());
  } catch (err) {
    return next(err);
  }
});

export default app;
