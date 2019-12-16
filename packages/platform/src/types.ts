import { ChildProcess } from 'child_process';

export interface ProcessMap {
  [key: number]: ChildProcess;
}
