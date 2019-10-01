import { Config, Logger, PlatformApi } from '@reactant/platform';

export default async function build(
  config: Config,
  logger: Logger,
  platformApi: PlatformApi
): Promise<any> {
  logger.spinner.start('preparing build');
  const { paths } = config;
  await platformApi.prepare(config);
  await platformApi.templateCracoConfig(config);
  logger.spinner.succeed('prepared build');
  return platformApi.spawn('@craco/craco', 'craco', ['build'], {
    cwd: paths.build
  });
}
