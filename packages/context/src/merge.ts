import clone from 'lodash.clone';
import mergeWith from 'lodash.mergewith';
import uniq from 'lodash.uniq';

export interface MergeOptions {
  _level: number;
  concat: boolean;
  dedup: boolean;
  level: number;
  mergeModifierFunction: boolean;
}

export type MergeModifier = <Config>(
  config: Partial<Config>,
  ...args: any[]
) => Partial<Config>;

export default function merge<Config>(
  config: Config,
  modifier: Partial<Config> | MergeModifier,
  partialOptions: Partial<MergeOptions> = {},
  ...args: any[]
): Config {
  const options: MergeOptions = {
    _level: 0,
    concat: true,
    dedup: true,
    level: 1,
    mergeModifierFunction: false,
    ...partialOptions
  };
  if (config === null) return (modifier as unknown) as Config;
  if (modifier === null) return (config as unknown) as Config;
  config = clone(config);
  if (typeof modifier === 'function') {
    if (options._level > options.level) return (modifier as unknown) as Config;
    const modifiedConfig = modifier<Config>(config || {}, ...args);
    if (options.mergeModifierFunction) {
      return merge<Config>(config, modifiedConfig, options, ...args);
    }
    return modifiedConfig as Config;
  }
  if (
    Array.isArray(config) || Array.isArray(modifier)
      ? Array.isArray(config) !== Array.isArray(modifier)
      : typeof config !== typeof modifier
  ) {
    return (modifier as unknown) as Config;
  }
  if (Array.isArray(config)) {
    if (options.concat) {
      const configArray = config.concat(modifier);
      if (options.dedup) return (uniq(configArray) as unknown) as Config;
      return (configArray as unknown) as Config;
    }
    return (modifier as unknown) as Config;
  }
  if (typeof config === 'object') {
    return mergeWith(config, modifier, (oldValue: any, newValue: any): any => {
      return merge(
        oldValue,
        newValue,
        {
          ...options,
          _level: ++options._level
        },
        ...args
      );
    });
  }
  return (modifier as unknown) as Config;
}
