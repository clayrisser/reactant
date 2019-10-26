import CircularJSON from 'circular-json';
import crossSpawn from 'cross-spawn';
import fs from 'fs-extra';
import path from 'path';
import pkgDir from 'pkg-dir';

const rootPath = pkgDir.sync(process.cwd()) || process.cwd();

export default class State<
  T = {
    [key: string]: any;
  }
> {
  _state: T = {} as T;

  currentProcStarted = false;

  isMaster = false;

  statePath: string;

  constructor(public name = 'state', public projectName = 'reactant') {
    this.statePath = path.resolve(rootPath, '.tmp', this.projectName, 'state');
    if (this.currentProcStarted) return this;
    this.currentProcStarted = true;
    if (this.isStarted) return this;
    this.isMaster = true;
    const statePath = `${this.statePath}.json`;
    fs.mkdirsSync(this.statePath);
    fs.removeSync(statePath);
    fs.writeFile(
      statePath,
      CircularJSON.stringify({ master: { pid: process.pid } })
    );
  }

  get isStarted() {
    const statePath = `${this.statePath}.json`;
    return (
      fs.existsSync(statePath) &&
      this.processAlive(
        // eslint-disable-next-line no-undef
        JSON.parse(fs.readFileSync(statePath).toString())?.master?.pid || null
      )
    );
  }

  get state(): T {
    if (this.isMaster) return this._state;
    const statePath = path.resolve(this.statePath, `${this.name}.json`);
    if (!fs.pathExistsSync(statePath)) throw new Error('failed to get state');
    return JSON.parse(fs.readFileSync(statePath).toString()).state;
  }

  set state(state: T) {
    if (this.isStarted && !this.isMaster) {
      throw new Error('must be master to set state');
    }
    Object.keys(this._state).forEach((key: string) => {
      // @ts-ignore
      delete this._state[key];
    });
    Object.assign(this._state, state);
    const statePath = path.resolve(this.statePath, `${this.name}.json`);
    fs.mkdirsSync(this.statePath);
    fs.writeFileSync(
      statePath,
      CircularJSON.stringify({ state, master: { pid: process.pid } })
    );
  }

  processAlive(pid: number) {
    return !/No process found/.test(
      (
        crossSpawn.sync('find-process', [pid.toString()], {
          stdio: 'pipe'
          // eslint-disable-next-line no-undef
        })?.stdout || ''
      ).toString()
    );
  }

  finish() {
    fs.removeSync(`${this.statePath}.json`);
    fs.removeSync(this.statePath);
  }
}
