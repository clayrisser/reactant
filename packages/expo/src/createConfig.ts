import createExpoWebpackConfigAsync from '@expo/webpack-config';
import deasync from 'deasync';
// import mergeConfiguration from 'merge-configuration';
import pkgDir from 'pkg-dir';
import { Config, WebpackConfig } from '@reactant/platform';
// import expoWebpackConfig from './webpack';

export default function createConfig(config: Config): Config {
  if (!config.webpack) config.webpack = {};
  config.webpack.configure = (_webpackConfig: WebpackConfig): WebpackConfig => {
    // const wp = mergeConfiguration(webpackConfig, expoWebpackConfig);
    const createExpoWebpackConfigSync = deasync(createExpoWebpackConfigAsync);
    const wp = createExpoWebpackConfigSync(
      {
        projectRoot: pkgDir.sync(process.cwd()) || process.cwd()
      },
      process.argv
    );
    console.log('WPP', wp);
    return wp;
  };
  return config;
}
