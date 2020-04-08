import execa from 'execa';
import fs from 'fs-extra';
import mergeDirs from 'merge-dirs';
import path from 'path';

export default async function install(yo) {
  const tmpPath = yo.destinationPath('.tmp');
  const appPath = path.resolve(tmpPath, yo.answers.name);
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
  mergeDirs(appPath, yo.destinationPath(''), 'overwrite');
  var mergeTrees = new MergeTrees([, 'scripts'], 'output-dir', {
    overwrite: true,
  });
  const installChar = yo.options.install
    ? yo.options.install[0].toLowerCase()
    : 'y';
  if (!yo.answers.install || installChar === 'n' || installChar === 'f')
    return false;
  return yo.installDependencies({
    npm: true,
    bower: false,
    yarn: false,
  });
}
