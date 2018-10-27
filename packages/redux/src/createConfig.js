import _ from 'lodash';

export default function(config) {
  return {
    ...config,
    redux: {
      ...(config.redux || {}),
      blacklist: [..._.get(config, 'redux.blacklist', [])],
      initialState: { ..._.get(config, 'redux.initialState', {}) },
      persist: true,
      whitelist: [..._.get(config, 'redux.whitelist', [])]
    }
  };
}
