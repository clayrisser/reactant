import execa from 'execa';

export default async function install(yo) {
  await execa('git', ['init'], {
    cwd: yo.destinationPath('')
  });
  const installChar = yo.options.install
    ? yo.options.install[0].toLowerCase()
    : 'y';
  if (!yo.answers.install || installChar === 'n' || installChar === 'f') {
    return false;
  }
  await execa('reactant', ['install'], {
    cwd: yo.destinationPath(''),
    stdio: 'inherit'
  });
}
