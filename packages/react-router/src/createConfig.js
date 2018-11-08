import _ from 'lodash';

export default function(config) {
  return {
    ...config,
    ignore: {
      ...config.ignore,
      errors: [...config.ignore.errors]
    },
    reactRouter: {
      ...(config.reactRouter || {}),
      bindRedux: null
    },
    redux: {
      ...(config.redux || {}),
      blacklist: [..._.get(config, 'redux.blacklist', []), 'router']
    }
  };
}
