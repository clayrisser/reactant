export default function(config) {
  return {
    ...config,
    styledComponents: {
      ...config.styledComponents,
      theme: {},
      themeName: 'base'
    }
  };
}
