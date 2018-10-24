import Promise from 'bluebird';
import _ from 'lodash';
import { log, config } from '.';
import { setLevel } from './log';

export default class ReactantApp {
  plugins = [];

  constructor(Root, options = {}) {
    const { props = {} } = options;
    this.Root = Root;
    this.props = props;
    this.config = config;
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
    if (typeof global.window === 'undefined') global.window = {};
    if (config !== 'production') {
      window.reactant = { config };
      global.reactant = { config };
    }
  }

  async register(Plugin, options = {}) {
    const plugin = new Plugin(this.Root, options);
    log.silly(`registering plugin '${plugin.name}'`);
    this.plugins.push(plugin);
  }

  async getRoot() {
    let { Root } = this;
    await Promise.mapSeries(this.plugins, async plugin => {
      if (plugin.getRoot && _.isFunction(plugin.getRoot)) {
        Root = await plugin.getRoot();
      } else {
        ({ Root } = plugin);
      }
    });
    return Root;
  }

  async init() {
    log.silly(`initializing platform '${this.config.platform}'`);
    this.Root = await this.getRoot();
    return this;
  }
}
