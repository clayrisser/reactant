import { Config, WebpackConfig } from '@reactant/platform';

export default function createConfig(config: Config): Config {
  if (!config.webpack) config.webpack = {};
  config.webpack.configure = (webpackConfig: WebpackConfig): WebpackConfig => {
    if (config.debug) {
      console.log(
        '\n\n======== START WEBPACK ========\n',
        webpackConfig,
        '\n========= END WEBPACK =========\n\n'
      );
    }
    return webpackConfig;
  };
  return config;
}
