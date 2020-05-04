import fs from 'fs-extra';
import path from 'path';
import { ActionResult, Context, Logger, Api } from '@reactant/plugin';

export default async function (
  context: Context,
  logger: Logger,
  api: Api
): Promise<ActionResult> {
  logger.spinner.start('preparing storybook');
  if (context.platformName === 'expo') {
    const platformReactantPath = path.resolve(
      context.platform?.path!,
      'lib/Reactant.js'
    );
    const platformReactantPathBackup = path.resolve(
      context.platform?.path!,
      'lib/Reactant.backup.js'
    );
    if (!(await fs.pathExists(platformReactantPathBackup))) {
      await fs.rename(platformReactantPath, platformReactantPathBackup);
    }
    await fs.copy(
      path.resolve(__dirname, '../reactNative/Reactant.js'),
      platformReactantPath
    );
    await fs.mkdirs(context.paths.tmp);
    await api.createBabelConfig({ rootPath: true });
    await fs.copy(
      path.resolve(context.paths.root, context.platformName, 'index.js'),
      path.resolve(context.paths.root, 'node_modules/expo/AppEntry.js')
    );
    logger.spinner.succeed('prepared storybook');
    logger.spinner.succeed('started');
    await api.spawn(
      ['expo', 'expo'],
      [
        'start',
        '--config',
        path.resolve(context.paths.root, context.platformName, 'app.json'),
        // '--web',
        '--clear'
      ]
    );
    return null;
  }
  const storybookPath = path.resolve(context.paths.tmp, 'storybook');
  await fs.copy(path.resolve(__dirname, '../storybook'), storybookPath);
  logger.spinner.succeed('prepared storybook');
  await api.spawn(
    ['@storybook/react', 'start-storybook'],
    [...(context.debug ? ['--debug-webpack'] : []), '-c', storybookPath]
  );

  return null;
}
