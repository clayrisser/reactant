import { log, config } from '.';
import { setLevel } from './log';

export default class ReactantApp {
  constructor(Root) {
    this.Root = Root;
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

  register(Plugin, options = {}) {
    const plugin = new Plugin(this.Root, options);
    log.silly(`registering plugin '${plugin.name}'`);
    this.Root = plugin.Root;
  }

  init() {
    log.silly(`initializing platform '${this.config.platform}'`);
  }
}
