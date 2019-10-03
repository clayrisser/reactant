declare interface Options {
  concat: boolean;
  dedup: boolean;
  level: number;
  mergeModifierFunction: boolean;
}

declare type Modifier<Config> =
  | ((config: Partial<Config>) => Config)
  | Partial<Config>;

declare function mergeConfiguration<Config>(
  config: Partial<Config>,
  modifier: Modifier<Config>,
  options?: Options,
  ...args: any[]
): Config;

declare module 'merge-configuration' {
  export = mergeConfiguration;
}
