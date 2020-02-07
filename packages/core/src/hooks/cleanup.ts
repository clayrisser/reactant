import Sigar from 'node-sigar';
import fs from 'fs-extra';
import path from 'path';
import psTree, { ProcNode } from 'node-pstree';
import { Context, Logger } from '@reactant/types';
import { finish } from '@reactant/context/node';

const sigar = new Sigar();

export function killOrphanedProcesses(pid = process.pid) {
  try {
    (psTree(pid)?.children || []).forEach((procNode: ProcNode) => {
      try {
        killOrphanedProcesses(procNode.pid);
        if (sigar.procList.includes(procNode.pid)) {
          process.kill(procNode.pid, 'SIGKILL');
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(`failed to kill pid '${procNode.pid}'`);
      }
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('failed to kill orphaned processes');
  }
}

export default function cleanup(context: Context, _logger: Logger) {
  killOrphanedProcesses();
  if (!context.debug) {
    fs.removeSync(path.resolve(context.paths.root, context.paths.tmp));
    if (
      fs.pathExistsSync(
        path.resolve(__dirname, '../../../../pnpm-workspace.yaml')
      )
    ) {
      fs.removeSync(path.resolve(__dirname, '../../../../.tmp'));
    }
    try {
      fs.removeSync(context.paths.tmp);
      // eslint-disable-next-line no-empty
    } catch (err) {}
  }
  finish();
  process.exit();
}
