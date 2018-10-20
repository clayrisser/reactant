import Cookies from 'cookies';
import React from 'react';
import _ from 'lodash';
import cheerio from 'cheerio';
import express from 'express';
import ignoreWarnings from 'ignore-warnings';
import { NodeCookiesWrapper } from 'redux-persist-cookie-storage';
import { ReactantApp } from '@reactant/core';
import { config, assets } from '@reactant/core';
import { persistStore } from 'redux-persist';
import { renderToString /* , renderToStaticMarkup */ } from 'react-dom/server';
import Reactant from './Reactant';
import indexHtml from '~/../web/index.html';

const { document } = window;

export default class ServerApp extends ReactantApp {
  constructor(Root = Reactant, options = {}) {
    super(...arguments);
    const { props = {}, app = express() } = options;
    this.Root = Root;
    this.app = app;
    this.props = props;
    if (!this.config.options.debug) {
      ignoreWarnings(this.config.ignore.warnings || []);
      ignoreWarnings('error', this.config.ignore.errors || []);
    }
    this.listen();
  }

  async handle(req, res, next) {
    try {
      const { Root } = this;
      const css = new Set();
      this.props.location = req.url;
      this.props.context = {
        ...this.props.context,
        cookieJar: new NodeCookiesWrapper(new Cookies(req, res)),
        insertCss: (...styles) => {
          return styles.forEach(style => css.add(style._getCss()));
        },
        location: this.props.location
      };
      const appHtml = renderToString(<Root {...this.props} />);
      const $ = cheerio.load(indexHtml);
      $('title').text(config.title);
      $('head').append(`<style type="text/css">${[...css].join('')}</style>`);
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
      return res.send($.html());
    } catch (err) {
      return next(err);
    }
  }

  init() {
    super.init();
    this.app.use(express.static(config.paths.distWebPublic));
    this.app.use(Cookies.express());
    this.app.get('/*', this.handle);
  }
}
