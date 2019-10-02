import path from 'path';
import { Config, PlatformApi } from '@reactant/types';
import clean from './clean';

export default async function build(
  config: Config,
  logger: any,
  platformApi: PlatformApi
): Promise<any> {
  await clean(config, logger, platformApi);
  logger.spinner.start('preparing build');
  const { paths } = config;
  await platformApi.prepare(config);
  await platformApi.templateCracoConfig(config);
  logger.spinner.succeed('prepared build');
  await platformApi.spawn('@craco/craco', 'craco', ['build'], {
    cwd: paths.build
  });
  logger.spinner.start('copying dist');
  await platformApi.copyDist(path.resolve(paths.build, 'build'), config);
  logger.spinner.succeed('copied dist');
}
