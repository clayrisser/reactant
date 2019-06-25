declare function mergeConfiguration<Config>(
  oldConfig: Config,
  newConfig: Config
): Config;

declare module 'merge-configuration' {
  export = mergeConfiguration;
}
