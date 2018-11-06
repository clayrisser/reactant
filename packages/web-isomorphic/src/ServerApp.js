import CircularJSON from 'circular-json';
import React from 'react';
import autobind from 'autobind-decorator';
import cheerio from 'cheerio';
import express from 'express';
import fs from 'fs-extra';
import ignoreWarnings from 'ignore-warnings';
import indexHtml from '@reactant/web-isomorphic/index.html';
import path from 'path';
import { ReactantApp, config, assets, log } from '@reactant/core';
import { callLifecycle } from '@reactant/core/plugin';
import { renderToString /* , renderToStaticMarkup */ } from 'react-dom/server';
import Reactant from './Reactant';

@autobind
export default class ServerApp extends ReactantApp {
  constructor(BaseRoot = Reactant, options = {}) {
    super(...arguments);
    const { app = express() } = options;
    this.BaseRoot = BaseRoot;
    this.app = app;
    if (!config.options.debug) {
      ignoreWarnings(config.ignore.warnings || []);
      ignoreWarnings('error', config.ignore.errors || []);
    }
  }

  async handle(req, res, next) {
    const { paths } = config;
    try {
      if (global.reactant) req.reactant = global.reactant;
      log.silly('url:', req.url);
      req.props = { ...this.props };
      await callLifecycle('willRender', this, { req, res });
      req.props.location = req.url;
      req.props.context = {
        ...req.props.context,
        location: req.props.location
      };
      const Root = await this.getRoot({ req, res });
      const { props } = req;
      if (req.reactant) req.reactant.context = props.context;
      const appHtml = renderToString(<Root {...props} />);
      const $ = cheerio.load(indexHtml);
      $('title').text(config.title);
      $('#app').append(appHtml);
      $('body').append(
        `<script src="${assets.client.js}" defer${
          config.environment === 'production' ? ' crossorigin' : ''
        }></script>`
      );
      req.$ = $;
      await callLifecycle('didRender', this, { req, res });
      if (req.reactant) {
        fs.mkdirsSync(paths.debug);
        fs.writeFileSync(
          path.resolve(paths.debug, 'reactant.json'),
          CircularJSON.stringify(req.reactant, null, 2)
        );
      }
      res.sent = true;
      return res.send(req.$.html());
    } catch (err) {
      return next(err);
    }
  }

  async init() {
    await super.init();
    const { paths } = config;
    this.app.use(express.static(path.resolve(paths.dist, 'public')));
    this.app.get('/*', this.handle);
    return this;
  }
}
