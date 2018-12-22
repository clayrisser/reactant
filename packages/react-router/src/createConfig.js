import Err from 'err';
import _ from 'lodash';

export default function(config) {
  if (
    config?.redux?.bindRedux &&
    !_.includes(config.plugins, '@reactant/redux')
  ) {
    throw new Err(
      "config 'redux.bindRedux' depends on '@reactant/redux' plugin",
      400
    );
  }
  return {
    ...config,
    ignore: {
      ...(config.ignore || {}),
      errors: [...config.ignore.errors]
    },
    reactRouter: {
      ...(config.reactRouter || {}),
      bindRedux: null
    },
    redux: {
      ...(config.redux || {}),
      blacklist: [...(config?.redux?.blacklist || []), 'router']
    }
  };
}
