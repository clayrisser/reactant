import CircularJSON from 'circular-json';
import crossSpawn from 'cross-spawn';
import fs from 'fs-extra';
import path from 'path';
import pkgDir from 'pkg-dir';

const rootPath = pkgDir.sync(process.cwd()) || process.cwd();

export interface Context {
  [key: string]: any;
}

export default class State {
  _context: Context = {};

  currentProcStarted = false;

  isMaster = false;

  contextPath: string;

  constructor(public name = 'reactant') {
    this.contextPath = path.resolve(rootPath, '.tmp', this.name, 'context');
    if (this.currentProcStarted) return;
    this.currentProcStarted = true;
    if (this.isStarted) return;
    const contextPath = `${this.contextPath}.json`;
    // TODO: ?
    fs.mkdirsSync(this.contextPath);
    fs.removeSync(`${this.contextPath}.json`);
    fs.removeSync(this.contextPath);
    this.isMaster = true;
    fs.writeFile(
      contextPath,
      CircularJSON.stringify({ master: { pid: process.pid } })
    );
  }

  get isStarted() {
    const contextPath = `${this.contextPath}.json`;
    const payload = JSON.parse(fs.readFileSync(contextPath).toString());
    if (
      fs.existsSync(contextPath) &&
      this.processAlive(
        // TODO: oc
        payload && payload.master && payload.master.pid
          ? payload.master.pid
          : null
      )
    ) {
      return true;
    }
    return false;
  }

  get context() {
    if (this.isMaster) return this._context || null;
    const contextPath = path.resolve(this.contextPath, `${this.name}.json`);
    if (!fs.pathExistsSync(contextPath)) return null;
    return JSON.parse(fs.readFileSync(contextPath).toString()).context;
  }

  set context(context: any) {
    if (this.isStarted && !this.isMaster) {
      throw new Error('must be master to set context');
    }
    Object.keys(this._context).forEach(key => {
      delete this._context[key];
    });
    Object.assign(this._context, context);
    const contextPath = path.resolve(this.contextPath, `${this.name}.json`);
    fs.mkdirsSync(this.contextPath);
    fs.writeFileSync(
      contextPath,
      CircularJSON.stringify({ context, master: { pid: process.pid } })
    );
  }

  processAlive(pid: number) {
    const { stdout } = crossSpawn.sync('find-process', [pid.toString()], {
      stdio: 'pipe'
    });
    return !/No process found/.test(stdout ? stdout.toString() : '');
  }

  finish() {
    fs.removeSync(`${this.contextPath}.json`);
    fs.removeSync(this.contextPath);
  }
}
