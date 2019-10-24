import createExpoWebpackConfigAsync from '@expo/webpack-config';
import fs from 'fs-extra';
import path from 'path';
import pkgDir from 'pkg-dir';

(async () => {
  const config = await createExpoWebpackConfigAsync(
    {
      projectRoot: pkgDir.sync(process.cwd()) || process.cwd()
    },
    process.argv
  );
  await fs.writeJson(
    path.resolve(__dirname, './_createWebpack.interface.json'),
    config
  );
})();
