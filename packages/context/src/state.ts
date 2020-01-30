import { stringify } from 'flatted';
// import LibGTop from 'libgtop';
import crossSpawn from 'cross-spawn';
import fs from 'fs-extra';
import path from 'path';
import pkgDir from 'pkg-dir';

// const libGTop = new LibGTop();
const rootPath = pkgDir.sync(process.cwd()) || process.cwd();

export default class State<
  T = {
    [key: string]: any;
  }
> {
  _state: T;

  currentProcStarted = false;

  isMaster = false;

  statePath: string;

  projectName = 'reactant';

  constructor(public name = 'state', public postprocess = (state: T) => state) {
    process.on('SIGINT', () => this.finish());
    process.on('SIGTERM', () => this.finish());
    this.statePath = path.resolve(rootPath, '.tmp', this.projectName, 'state');
    if (this.currentProcStarted) return this;
    this.currentProcStarted = true;
    if (this.isStarted) return this;
    this.isMaster = true;
    const statePath = `${this.statePath}.json`;
    fs.mkdirsSync(this.statePath);
    fs.removeSync(statePath);
    fs.writeFile(statePath, stringify({ master: { pid: process.pid } }));
  }

  get isStarted() {
    const statePath = `${this.statePath}.json`;
    return (
      fs.existsSync(statePath) &&
      this.processAlive(
        // eslint-disable-next-line no-undef
        JSON.parse(fs.readFileSync(statePath).toString())?.master?.pid
      )
    );
  }

  get state(): T | void {
    if (this.isMaster) return this._state;
    const statePath = path.resolve(this.statePath, `${this.name}.json`);
    if (!fs.pathExistsSync(statePath)) return undefined;
    return this.postprocess(
      JSON.parse(fs.readFileSync(statePath).toString()).state
    );
  }

  set state(state: T | void) {
    if (this.isStarted && !this.isMaster) {
      throw new Error('must be master to set state');
    }
    if (typeof this._state === 'undefined') this._state = {} as T;
    Object.keys(this._state).forEach((key: string) => {
      // @ts-ignore
      delete this._state[key];
    });
    Object.assign(this._state, state);
    const statePath = path.resolve(this.statePath, `${this.name}.json`);
    if (typeof state === 'undefined') {
      fs.unlinkSync(statePath);
    } else {
      fs.mkdirsSync(this.statePath);
      fs.writeFileSync(
        statePath,
        stringify({ state, master: { pid: process.pid } })
      );
    }
  }

  processAlive(pid: number) {
    // try {
    //   return libGTop.proclist.includes(pid);
    // } catch (err) {
    //   // eslint-disable-next-line no-empty
    // }
    const pkgPath =
      pkgDir.sync(
        // eslint-disable-next-line import/no-dynamic-require,global-require
        require.resolve('find-process', {
          paths: [
            path.resolve(pkgDir.sync(__dirname) || __dirname, 'node_modules'),
            path.resolve(rootPath, 'node_modules')
          ]
        })
      ) || path.resolve(rootPath, 'node_modules');
    const bin = path.resolve(
      pkgPath,
      // eslint-disable-next-line import/no-dynamic-require,global-require
      require(path.resolve(pkgPath, 'package.json')).bin['find-process']
    );
    try {
      const pids = (
        crossSpawn.sync('ps', ['-A'], {
          stdio: 'pipe'
          // eslint-disable-next-line no-undef
        })?.stdout || ''
      )
        .toString()
        .split('\n')
        .reduce((pids: Set<number>, line: string) => {
          const match = Number(
            line.match(/(\d+) [^\s]+ +\d+:\d+(:\d+)? [^\s]+/)?.[1] || -1
          );
          if (match >= 0) pids.add(match);
          return pids;
        }, new Set());
      if (pids.has(pid)) return true;
    } catch (err) {
      // eslint-disable-next-line no-empty
    }
    if (
      !/No process found/.test(
        (
          crossSpawn.sync('node', [bin, pid.toString()], {
            stdio: 'pipe'
            // eslint-disable-next-line no-undef
          })?.stdout || ''
        ).toString()
      )
    ) {
      return true;
    }
    return false;
  }

  finish() {
    try {
      fs.removeSync(`${this.statePath}.json`);
      // eslint-disable-next-line no-empty
    } catch (err) {}
    try {
      fs.removeSync(this.statePath);
      // eslint-disable-next-line no-empty
    } catch (err) {}
  }
}
