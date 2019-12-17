import fs from 'fs-extra';
import path from 'path';
import { Context, Logger, PlatformApi } from '@reactant/platform';
import createCracoConfig from '../createCracoConfig';

export default async function build(
  context: Context,
  logger: Logger,
  platformApi: PlatformApi
): Promise<any> {
  logger.spinner.start('preparing build');
  if (context.options.docker) {
    const dockerPath = path.resolve(context.paths.tmp, 'docker');
    await fs.mkdirs(dockerPath);
    await fs.copy(
      path.resolve(__dirname, '../docker/entrypoint.sh'),
      path.resolve(dockerPath, 'entrypoint.sh')
    );
    await fs.copy(
      path.resolve(__dirname, '../docker/nginx.conf'),
      path.resolve(dockerPath, 'nginx.conf')
    );
    const pkg = await fs.readJson(
      path.resolve(context.paths.root, 'package.json')
    );
    const [major, minor, patch]: string[] = pkg.version.split('.');
    const maintainer =
      (!pkg.author || typeof pkg.author === 'string'
        ? pkg.author
        : `${pkg.author.name} <${pkg.author.email}>`) || '';
    logger.spinner.succeed('prepared build');
    await platformApi.spawn(
      null,
      'docker-compose',
      ['-f', path.resolve(__dirname, '../docker/docker-build.yaml'), 'build'],
      {
        env: {
          REACTANT_DOCKERFILE: path.resolve(__dirname, '../docker/Dockerfile'),
          REACTANT_IMAGE: pkg.name,
          REACTANT_MAINTAINER: maintainer,
          REACTANT_MAJOR: major,
          REACTANT_MINOR: minor,
          REACTANT_PATCH: patch,
          REACTANT_PLATFORM: context.platformName,
          REACTANT_ROOT: context.paths.root
        }
      }
    );
  } else {
    const cracoConfigPath = await createCracoConfig(context);
    await fs.mkdirs(context.paths.dist);
    await fs.remove(context.paths.dist);
    logger.spinner.succeed('prepared build');
    await platformApi.spawn('@craco/craco', 'craco', [
      'build',
      '--config',
      cracoConfigPath
    ]);
    logger.spinner.start('finalizing build');
    await fs.move(context.paths.build, context.paths.dist);
  }
  logger.spinner.succeed('built');
}
