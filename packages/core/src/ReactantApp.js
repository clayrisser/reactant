import { log, config } from '.';
import { setLevel } from './log';

export default class ReactantApp {
  constructor() {
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

  register(pluginName) {
    log.trace(`registering plugin '${pluginName}'`);
  }

  render() {
    log.trace(`rendering to platform '${this.config.platform}'`);
  }
}
