import path from 'path';
import fs from 'fs-extra';
import { Context, Logger, Api } from '@reactant/platform';

export default async function build(
  context: Context,
  logger: Logger,
  api: Api
): Promise<any> {
  logger.spinner.start('preparing build');
  await api.createBabelConfig({ rootPath: true });
  logger.spinner.succeed('prepared build');
  await fs.copy(
    path.resolve(context.paths.root, context.platformName, 'index.js'),
    path.resolve(context.paths.root, 'node_modules/expo/AppEntry.js')
  );
  logger.spinner.succeed('builded');
  await api.spawn(
    ['expo', 'expo'],
    [
      'build',
      '--config',
      path.resolve(context.paths.root, context.platformName, 'app.json'),
      '--clear'
    ]
  );
  logger.spinner.start('finishing build');
  await fs.rename(
    path.resolve(context.paths.root, context.paths.build),
    path.resolve(context.paths.root, context.paths.dist)
  );
  logger.spinner.succeed('finished build');
}
