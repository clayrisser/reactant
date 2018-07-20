import Cookies from 'cookies';
import _ from 'lodash';
import cheerio from 'cheerio';
import express from 'express';
import ignoreWarnings from 'ignore-warnings';
import { AppRegistry } from 'react-native';
import { NodeCookiesWrapper } from 'redux-persist-cookie-storage';
import { persistStore } from 'redux-persist';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import ServerApp from '../../../web/ServerApp';
import indexHtml from '../../../web/index.html';
import { config, assets } from '..';
import { createWebStore } from '../createStore';
import { setLevel } from '../log';

export default function server(initialProps, app = express()) {
  ignoreWarnings(config.ignore.warnings || []);
  ignoreWarnings('error', config.ignore.errors || []);
  if (
    config.options.verbose ||
    config.options.debug ||
    config.level === 'trace'
  ) {
    setLevel('trace');
  } else if (config.env === 'development') {
    setLevel('debug');
  } else {
    setLevel(config.level);
  }
  if (!global.window) global.window = {};
  if (config !== 'production') {
    const reaction = { config };
    global.window.reaction = reaction;
    global.reaction = reaction;
  }
  app.use(express.static(config.paths.distPublic));
  app.use(Cookies.express());
  app.get('/*', async (req, res, next) => {
    let context = {};
    try {
      context = await createWebStore({
        cookieJar: new NodeCookiesWrapper(new Cookies(req, res))
      });
      context.persistor = await new Promise(resolve => {
        const { store } = context;
        const persistor = persistStore(store, config.initialState, () => {
          return resolve(persistor);
        });
      });
      initialProps.context = context;
      initialProps.location = req.url;
      AppRegistry.registerComponent('App', () => ServerApp);
      const { element, getStyleElement } = AppRegistry.getApplication('App', {
        initialProps
      });
      const appHtml = renderToString(element);
      const appCss = renderToStaticMarkup(getStyleElement());
      const $ = cheerio.load(indexHtml);
      $('title').text(config.title);
      $('head').append(appCss);
      $('#app').append(appHtml);
      _.map(assets, asset => {
        if (asset.js) {
          $('body').append(
            `<script src="${asset.js}" defer${
              config.environment === 'production' ? ' crossorigin' : ''
            }></script>`
          );
        }
      });
      await context.persistor.flush();
      res.removeHeader('Set-Cookie');
      if (context.url) return res.redirect(301, context.url);
      return res.send($.html());
    } catch (err) {
      if (context.persistor) {
        await context.persistor.flush();
        res.removeHeader('Set-Cookie');
      }
      return next(err);
    }
  });
  return { app, initialProps, config };
}
