import { Config, CracoConfig, PlatformOptions } from '../types';

export function mapCraco(config: Config): CracoConfig {
  return {
    ...(config.reactScriptsVersion
      ? { reactScriptsVersion: config.reactScriptsVersion }
      : {}),
    ...(config.style ? { style: config.style } : {}),
    ...(config.babel ? { babel: config.babel } : {}),
    ...(config.eslint ? { eslint: config.eslint } : {}),
    ...(config.jest ? { jest: config.jest } : {}),
    ...(config.typescript ? { typescript: config.typescript } : {}),
    ...(config.webpack ? { webpack: config.webpack } : {}),
    ...(config.devServer ? { devServer: config.devServer } : {}),
    ...(config.cracoPlugins ? { plugins: config.cracoPlugins } : {})
  };
}

export function mapPlatform(config: Config): PlatformOptions {
  return config.platform;
}
