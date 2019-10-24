import fs from 'fs-extra';
import path from 'path';
import { Config, Logger, PlatformApi } from '@reactant/platform';

export default async function start(
  config: Config,
  logger: Logger,
  platformApi: PlatformApi
): Promise<any> {
  logger.spinner.start('preparing start');
  await platformApi.prepareLocal(config);
  await platformApi.createWebpackConfig(
    path.resolve(config.rootPath, 'webpack.config.js'),
    config
  );
  await fs.copy(
    path.resolve(__dirname, '../templates/craco.config.js'),
    path.resolve(config.rootPath, 'craco.config.js')
  );
  await fs.copy(
    path.resolve(__dirname, '../templates/env.js'),
    path.resolve(config.rootPath, 'node_modules/expo/config/env.js')
  );
  await fs.copy(
    path.resolve(__dirname, '../templates/paths.js'),
    path.resolve(config.rootPath, 'node_modules/expo/config/paths.js')
  );
  await fs.copy(
    path.resolve(__dirname, '../templates/createWebpack.js'),
    path.resolve(config.rootPath, 'node_modules/expo/config/createWebpack.js')
  );
  await fs.copy(
    path.resolve(__dirname, '../templates/webpack.config.prod.js'),
    path.resolve(
      config.rootPath,
      'node_modules/expo/config/webpack.config.prod.js'
    )
  );
  logger.spinner.succeed('prepared start');
  await fs.copy(
    path.resolve(config.rootPath, config.platformName, 'index.js'),
    path.resolve(config.rootPath, 'node_modules/expo/AppEntry.js')
  );
  return platformApi.spawn('expo-cli', 'expo', [
    'start',
    '--config',
    path.resolve(config.rootPath, config.platformName, 'app.json'),
    '--web',
    '--clear'
  ]);
}
