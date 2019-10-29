import crossSpawn from 'cross-spawn';
import path from 'path';
import pkgDir from 'pkg-dir';
import { Context, Logger, TPlatformApi } from '@reactant/types';
import { SpawnOptions, ChildProcess } from 'child_process';

export default class PlatformApi implements TPlatformApi {
  constructor(public context: Context, public logger: Logger) {}

  async spawn(
    pkg: string,
    bin: string,
    args: string[] = [],
    options?: SpawnOptions
  ): Promise<string | ChildProcess> {
    options = {
      stdio: 'inherit',
      shell: true,
      env: process.env,
      ...(options || {})
    };
    const pkgPath = await pkgDir(
      // eslint-disable-next-line import/no-dynamic-require,global-require
      require.resolve(pkg, {
        paths: [
          path.resolve((await pkgDir(__dirname)) || __dirname, 'node_modules'),
          path.resolve(this.context.paths.root, 'node_modules')
        ]
      })
    );
    if (!pkgPath) throw new Error(`package '${pkg}' not found`);
    const command = path.resolve(
      pkgPath,
      // eslint-disable-next-line import/no-dynamic-require,global-require
      require(path.resolve(pkgPath, 'package.json')).bin[bin]
    );
    return new Promise((resolve, reject) => {
      const ps = crossSpawn(command, args, options);
      let result: string | ChildProcess = ps;
      if (ps.stdout && ps.stderr) {
        result = '';
        ps.stdout.on('data', data => (result += data.toString()));
        ps.stderr.on('data', data => (result += data.toString()));
      }
      ps.on('close', () => resolve(result));
      ps.on('error', (err: Error) => reject(err));
    });
  }
}
