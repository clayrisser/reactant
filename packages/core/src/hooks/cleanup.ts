import execa from 'execa';
import fs from 'fs-extra';
import path from 'path';
import { Context, Logger } from '@reactant/types';
import { finish } from '@reactant/context/node';

export function killOrphanedProcesses(search: string) {
  try {
    execa
      .sync('ps', ['all', '-A'], { stdio: 'pipe' })
      .stdout.split('\n')
      .filter((result: string) => result.indexOf(search) > -1)
      .forEach((result: string) => {
        const pidItems = result
          .replace(/\s+/, ' ')
          .split(' ')
          .filter((pidItem: string) => pidItem.length);
        const pid = Number(pidItems?.[2]);
        try {
          process.kill(pid, 'SIGKILL');
        } catch (err) {
          console.warn(`failed to kill pid '${pid}'`);
        }
      });
  } catch (err) {
    console.warn('failed to kill orphaned processes');
  }
}

export default function cleanup(context: Context, _logger: Logger) {
  killOrphanedProcesses(path.resolve(context.paths.tmp, 'storybook'));
  killOrphanedProcesses(
    'node_modules/fork-ts-checker-webpack-plugin/lib/service.js'
  );
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
  try {
    fs.unlinkSync(path.resolve(context.paths.reactant, 'config.json'));
    // eslint-disable-next-line no-empty
  } catch (err) {}
  try {
    fs.unlinkSync(path.resolve(context.paths.reactant, 'context.json'));
    // eslint-disable-next-line no-empty
  } catch (err) {}
  try {
    fs.unlinkSync(path.resolve(context.paths.reactant, 'platform.json'));
    // eslint-disable-next-line no-empty
  } catch (err) {}
  try {
    fs.unlinkSync(path.resolve(context.paths.reactant, 'plugins.json'));
    // eslint-disable-next-line no-empty
  } catch (err) {}
  finish();
  process.exit();
}
