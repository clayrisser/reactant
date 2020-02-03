import Sigar from 'node-sigar';
import fs from 'fs-extra';
import path from 'path';
import pkgDir from 'pkg-dir';
import psTree, { ProcNode } from 'node-pstree';
import { parse, stringify } from 'flatted';

const rootPath = pkgDir.sync(process.cwd()) || process.cwd();
const sigar = new Sigar();

export default class State<
  T = {
    [key: string]: any;
  }
> {
  _isMaster: boolean;

  _masterPid: number;

  _parentMasterPid: number | null;

  _state: T;

  currentProcStarted = false;

  projectName = 'reactant';

  statePath: string;

  stateDir: string;

  constructor(public name = 'state', public postprocess = (state: T) => state) {
    process.on('SIGINT', () => this.finish());
    process.on('SIGTERM', () => this.finish());
    this.stateDir = path.resolve(
      rootPath,
      'node_modules/.tmp',
      this.projectName,
      this.masterPid.toString()
    );
    this.statePath = path.resolve(this.stateDir, 'state.json');
    if (this.currentProcStarted) return this;
    this.currentProcStarted = true;
    if (this.isStarted) return this;
    fs.mkdirsSync(this.stateDir);
    fs.writeFile(this.statePath, stringify({ master: { pid: process.pid } }));
  }

  getParentMasterPid(): number | null {
    if (typeof this._parentMasterPid !== 'undefined')
      return this._parentMasterPid;
    this._parentMasterPid =
      psTree(process.pid)?.parents.find((procNode: ProcNode) => {
        return procNode.args.find((arg: string) => {
          return arg.indexOf('@reactant/cli/bin.js') > -1;
        });
      })?.pid || null;
    return this._parentMasterPid;
  }

  get masterPid(): number {
    if (typeof this._masterPid !== 'undefined') return this._masterPid;
    const masterPid = this.getParentMasterPid();
    this._masterPid = typeof masterPid === 'number' ? masterPid : process.pid;
    return this._masterPid;
  }

  get isMaster(): boolean {
    if (typeof this._isMaster !== 'undefined') return this._isMaster;
    this._isMaster = typeof this.getParentMasterPid() !== 'number';
    return this._isMaster;
  }

  get isStarted() {
    return fs.existsSync(this.statePath) && this.processAlive(this.masterPid);
  }

  get state(): T | undefined {
    if (this.isMaster) return this._state;
    if (!fs.pathExistsSync(this.statePath)) return undefined;
    return this.postprocess(
      parse(fs.readFileSync(this.statePath).toString()).state
    );
  }

  set state(state: T | undefined) {
    if (this.isStarted && !this.isMaster) {
      throw new Error('must be master to set state');
    }
    if (typeof this._state === 'undefined') this._state = {} as T;
    Object.keys(this._state).forEach((key: string) => {
      // @ts-ignore
      delete this._state[key];
    });
    Object.assign(this._state, state);
    if (typeof state === 'undefined') {
      fs.unlinkSync(this.statePath);
    } else {
      fs.writeFileSync(this.statePath, stringify({ state }));
    }
  }

  processAlive(pid: number) {
    return sigar.procList.includes(pid);
  }

  finish() {
    try {
      fs.removeSync(this.statePath);
      // eslint-disable-next-line no-empty
    } catch (err) {}
  }
}
