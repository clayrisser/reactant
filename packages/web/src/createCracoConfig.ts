import fs from 'fs-extra';
import path from 'path';
import { CreateConfigOptions, Context } from '@reactant/platform';

export default async function createCracoConfig(
  context: Context,
  options: CreateConfigOptions = {}
): Promise<string> {
  options = {
    rootPath: false,
    ...options
  };
  const { paths } = context;
  const cracoConfigPath = path.resolve(
    options.rootPath ? paths.root : paths.tmp,
    'craco.config.js'
  );
  if (await fs.pathExists(cracoConfigPath)) {
    await fs.unlink(cracoConfigPath);
  }
  await fs.copy(
    path.resolve(__dirname, 'templates/craco.config.js'),
    cracoConfigPath
  );
  return cracoConfigPath;
}
