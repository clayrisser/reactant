import fs from 'fs-extra';
import path from 'path';
import webpack from 'webpack';
import { createWebpackConfig } from '../webpack';

export default async function build(
  config,
  { spinner, log, webpackConfig, platform, socket }
) {
  const { paths } = config;
  webpackConfig = createWebpackConfig(config, { platform, webpackConfig });
  log.write('webpackConfig', webpackConfig);
  fs.mkdirsSync(path.resolve(paths.dist));
  fs.mkdirsSync(path.resolve(paths.src, 'public'));
  fs.copySync(path.resolve(__dirname, '../public'), paths.dist);
  fs.copySync(path.resolve(paths.src, 'public'), paths.dist);
  const stats = await compile(webpackConfig);
  spinner.succeed();
  socket.stop();
  return { stats };
}

async function compile(config) {
  return new Promise((resolve, reject) => {
    try {
      return webpack(config).run((err, stats) => {
        if (err) return reject(err);
        return resolve(stats);
      });
    } catch (err) {
      return reject(err);
    }
  });
}
