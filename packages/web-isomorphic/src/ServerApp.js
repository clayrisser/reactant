import Promise from 'bluebird';
import React from 'react';
import _ from 'lodash';
import autobind from 'autobind-decorator';
import cheerio from 'cheerio';
import express from 'express';
import ignoreWarnings from 'ignore-warnings';
import path from 'path';
import { ReactantApp, config, assets, log } from '@reactant/core';
import { renderToString /* , renderToStaticMarkup */ } from 'react-dom/server';
import Reactant from './Reactant';
import indexHtml from '~/../web/index.html';

@autobind
export default class ServerApp extends ReactantApp {
  constructor(Root = Reactant, options = {}) {
    super(...arguments);
    const { app = express() } = options;
    this.Root = Root;
    this.app = app;
    if (!this.config.options.debug) {
      ignoreWarnings(this.config.ignore.warnings || []);
      ignoreWarnings('error', this.config.ignore.errors || []);
    }
  }

  async handle(req, res, next) {
    try {
      log.silly('url:', req.url);
      const css = new Set();
      await Promise.mapSeries(_.keys(this.plugins), async key => {
        const plugin = this.plugins[key];
        if (plugin.willRender) {
          await plugin.willRender(this, { req, res });
        }
      });
      this.props.location = req.url;
      this.props.context = {
        ...this.props.context,
        insertCss: (...styles) => {
          return styles.forEach(style => css.add(style._getCss()));
        },
        location: this.props.location
      };
      this.Root = await this.getRoot({ req, res });
      const { Root } = this;
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
      this.$ = $;
      await Promise.mapSeries(_.keys(this.plugins), async key => {
        const plugin = this.plugins[key];
        if (plugin.didRender) {
          await plugin.didRender(this, { req, res });
        }
      });
      return res.send(this.$.html());
    } catch (err) {
      return next(err);
    }
  }

  async init() {
    await super.init();
    const { paths } = this.config;
    this.app.use(express.static(path.resolve(paths.dist, 'public')));
    this.app.get('/*', this.handle);
    return this;
  }
}
