import execa from 'execa';
import fs from 'fs-extra';
import path from 'path';
import pkgDir from 'pkg-dir';

export default async function configuring(yo) {
  yo.destinationRoot(yo.context.destination);
  if (yo.context.platforms.includes('web')) {
    const modulePath = path.resolve(__dirname, '../..');
    const templatePath = path.resolve(
      modulePath,
      'generators/app/templates/template/web'
    );
    const tmpPath = path.resolve(modulePath, '.tmp');
    await fs.remove(templatePath);
    await fs.remove(tmpPath);
    await fs.mkdirs(tmpPath);
    await execa(
      'sh',
      [
        '-c',
        `alias npm=true && yarn=true && node ${path.resolve(
          pkgDir.sync(require.resolve('create-react-app')),
          'index.js'
        )} ${yo.context.name} --typescript`
      ],
      {
        cwd: tmpPath,
        stdio: 'inherit'
      }
    );
    await fs.rename(path.resolve(tmpPath, yo.context.name), templatePath);
  }
}
