import _ from 'lodash';

export default function(config) {
  return {
    ...config,
    styledComponents: {
      ...(config.styledComponents || {}),
      theme: { ..._.get(config, 'styledComponents.theme', {}) },
      themeName: 'base'
    }
  };
}
