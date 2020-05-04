import fs from 'fs-extra';
import path from 'path';
import { Context, Logger, Api } from '@reactant/platform';
import createCracoConfig from '../createCracoConfig';

export default async function test(
  context: Context,
  logger: Logger,
  api: Api
): Promise<any> {
  logger.spinner.start('preparing test');
  const cracoConfigPath = await createCracoConfig(context);
  const pkgPath = path.resolve(context.paths.root, 'package.json');
  const pkg = await fs.readJson(pkgPath);
  pkg.cracoConfig = cracoConfigPath.substr(context.paths.root.length + 1);
  await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  delete pkg.cracoConfig;
  logger.spinner.succeed('prepared test');
  logger.spinner.succeed('tested');
  await api.spawn(['@craco/craco', 'craco'], ['test']);
  await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  return null;
}
