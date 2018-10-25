export default function(config) {
  return {
    ...config,
    redux: {
      ...config.redux,
      blacklist: [],
      initialState: {},
      whitelist: []
    }
  };
}
