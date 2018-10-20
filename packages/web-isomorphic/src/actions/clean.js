import fs from 'fs-extra';

export default async function clean(config, { spinner }) {
  const { paths } = config;
  fs.removeSync(paths.reactant);
  return spinner.succeed();
}
