import Promise from 'bluebird';
import _ from 'lodash';
import { log, config } from '.';
import { setLevel } from './log';

export default class ReactantApp {
  plugins = [];

  constructor(Root, options = {}) {
    const { props = {}, context = {} } = options;
    this.Root = Root;
    this.BaseRoot = Root;
    this.props = {
      ...props,
      context: {
        ...props.context,
        ...context
      }
    };
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

  async getRoot(...props) {
    let Root = this.BaseRoot;
    await Promise.mapSeries(this.plugins, async plugin => {
      if (plugin.getRoot && _.isFunction(plugin.getRoot)) {
        plugin.ChildRoot = Root;
        Root = await plugin.getRoot(this, ...props);
      } else {
        plugin.ChildRoot = Root;
        ({ Root } = plugin);
      }
    });
    return Root;
  }

  async init() {
    log.silly(`initializing platform '${config.platform}'`);
    this.Root = await this.getRoot({});
    await Promise.mapSeries(_.keys(this.plugins), async key => {
      const plugin = this.plugins[key];
      if (plugin.willInit) {
        await plugin.willInit(this);
      }
    });
    return this;
  }
}
