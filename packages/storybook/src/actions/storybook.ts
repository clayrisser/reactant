import fs from 'fs-extra';
import path from 'path';
import { ActionResult, Context, Logger, TPluginApi } from '@reactant/plugin';

export default async function(
  context: Context,
  logger: Logger,
  pluginApi: TPluginApi
): Promise<ActionResult> {
  logger.spinner.start('preparing storybook');
  const storybookPath = path.resolve(context.paths.tmp, 'storybook');
  await fs.copy(path.resolve(__dirname, '../storybook'), storybookPath);
  logger.spinner.succeed('prepared storybook');
  await pluginApi.spawn(
    ['@storybook/react', 'start-storybook'],
    [...(context.debug ? ['--debug-webpack'] : []), '-c', storybookPath]
  );
  return null;
}
