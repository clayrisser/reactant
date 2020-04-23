import execa, { Options as ExecaOptions, ExecaReturnValue } from 'execa';
import path from 'path';
import pkgDir from 'pkg-dir';
import where from './where';

export default async function spawn(
  rootPath = process.cwd(),
  bin: string | string[],
  args: string[] = [],
  options?: ExecaOptions
): Promise<ExecaReturnValue<string>> {
  let pkg: string | null = null;
  if (Array.isArray(bin)) {
    if (bin.length < 2) {
      throw new Error('missing pkg and bin');
    }
    [pkg, bin] = bin;
  }
  options = {
    stdio: 'inherit',
    env: process.env,
    ...(options || {})
  };
  let command = bin;
  if (pkg) {
    const pkgPath = await pkgDir(
      // eslint-disable-next-line import/no-dynamic-require,global-require
      require.resolve(pkg, {
        paths: [
          path.resolve((await pkgDir(__dirname)) || __dirname, 'node_modules'),
          path.resolve(rootPath, 'node_modules')
        ]
      })
    );
    if (!pkgPath) throw new Error(`package '${pkg}' not found`);
    command = path.resolve(
      pkgPath,
      // eslint-disable-next-line import/no-dynamic-require,global-require
      require(path.resolve(pkgPath, 'package.json')).bin[bin]
    );
  } else if (process.platform !== 'win32') {
    const whereCommand = await where(command);
    if (!whereCommand) throw new Error(`command '${command}' not found`);
    command = whereCommand;
  }
  return execa(command, args, options);
}
