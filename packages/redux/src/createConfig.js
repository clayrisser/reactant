export default function(config) {
  return {
    ...config,
    redux: {
      ...(config.redux || {}),
      blacklist: config?.redux?.blacklist || [],
      initialState: config?.redux?.initialState || {},
      persist: true,
      whitelist: config?.redux?.whitelist || []
    }
  };
}
