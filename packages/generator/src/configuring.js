import execa from 'execa';
import fs from 'fs-extra';
import path from 'path';
import pkgDir from 'pkg-dir';

export default async function configuring(yo) {
  yo.destinationRoot(yo.answers.destination);
  if (yo.answers.platform.includes('web')) {
    const modulePath = pkgDir.sync(require.resolve('create-react-app'));
    const templatePath = path.resolve(
      modulePath,
      'generators/app/templates/template/web'
    );
    const tmpPath = path.resolve(modulePath, '.tmp');
    await fs.remove(templatePath);
    await fs.remove(tmpPath);
    await fs.mkdirs(tmpPath);
    await execa(
      'node',
      [path.resolve(modulePath, 'index.js'), yo.answers.name, '--typescript'],
      {
        cwd: tmpPath
      }
    );
    await fs.rename(path.resolve(tmpPath, yo.answers.name), templatePath);
  }
}
