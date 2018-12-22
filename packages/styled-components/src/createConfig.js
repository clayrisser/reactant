export default function(config) {
  return {
    ...config,
    styledComponents: {
      ...(config?.styledComponents || {}),
      theme: config?.styledComponents?.them || {},
      themeName: 'base'
    }
  };
}
