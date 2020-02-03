import execa, { Options as ExecaOptions, ExecaReturnValue } from 'execa';
import path from 'path';
import pkgDir from 'pkg-dir';
import { Context } from '@reactant/types';

export default class Helpers {
  constructor(public context: Context) {}

  async spawn(
    bin: string | string[],
    args: string[] = [],
    options?: ExecaOptions
  ): Promise<ExecaReturnValue<string>> {
    let pkg: string | null = null;
    if (Array.isArray(bin)) {
      if (bin.length < 2) {
        throw new Error('missing pkg and bin');
      }
      pkg = bin[0];
      bin = bin[1];
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
            path.resolve(
              (await pkgDir(__dirname)) || __dirname,
              'node_modules'
            ),
            path.resolve(this.context.paths.root, 'node_modules')
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
      const whereCommand = await this.where(command);
      if (!whereCommand) throw new Error(`command '${command}' not found`);
      command = whereCommand;
    }
    return execa(command, args, options);
  }

  async where(
    program: string,
    unixCommand?: string,
    PATH = process.env.PATH
  ): Promise<string | null> {
    if (!unixCommand) {
      const splitChar = process.platform === 'win32' ? ';' : ':';
      process.env.PATH = process.env.PATH?.split(splitChar)
        .reduce((envPaths: string[], envPath: string) => {
          if (envPath.indexOf('node_modules/.bin') > -1) return envPaths;
          envPaths.push(envPath);
          return envPaths;
        }, [])
        .join(splitChar);
    }
    const command =
      process.platform === 'win32' ? 'whereis' : unixCommand || 'where';
    let result = null;
    try {
      const ps = await execa(command, [program], { stdio: 'pipe' });
      if (ps.exitCode === 0) result = ps.stdout;
    } catch (err) {
      if (process.platform !== 'win32' && !unixCommand) {
        return this.where(program, 'which', PATH);
      }
    }
    process.env.PATH = PATH;
    if (typeof result === 'string') {
      result = result.split(' ').pop() || null;
      if (!result?.length) result = null;
    }
    return result;
  }
}
