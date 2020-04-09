import execa from 'execa';

export default async function end(yo) {
  await execa('git', ['init'], {
    cwd: yo.destinationPath(''),
  });
  return yo;
}
