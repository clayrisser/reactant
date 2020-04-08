import execa from 'execa';
import fs from 'fs-extra';
import path from 'path';

export default async function configuring(yo) {
  yo.destinationRoot(yo.answers.destination);
  if (yo.answers.platform === 'web') {
    const templatePath = path.resolve(
      __dirname,
      '../generators/app/templates/template/web'
    );
    const tmpPath = path.resolve(__dirname, '../.tmp');
    await fs.remove(templatePath);
    await fs.remove(tmpPath);
    await fs.mkdirs(tmpPath);
    await execa(
      'node',
      [
        path.resolve(__dirname, '../node_modules/.bin/create-react-app'),
        yo.anwers.name,
        '--typescript',
      ],
      {
        cwd: tmpPath,
      }
    );
    await fs.rename(path.resolve(tmpPath, yo.answers.name), templatePath);
  }
}
