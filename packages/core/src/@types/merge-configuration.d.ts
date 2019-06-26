declare function mergeConfiguration<Config>(
  oldConfig: Partial<Config>,
  newConfig: Partial<Config>
): Config;

declare module 'merge-configuration' {
  export = mergeConfiguration;
}
