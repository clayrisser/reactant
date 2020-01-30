import fs from 'fs-extra';
import path from 'path';
import { Context, Logger } from '@reactant/types';
import { finish } from '@reactant/context/node';

export default function cleanup(context: Context, _logger: Logger) {
  if (
    fs.pathExistsSync(
      path.resolve(__dirname, '../../../../pnpm-workspace.yaml')
    )
  ) {
    fs.removeSync(path.resolve(__dirname, '../../../../../.tmp'));
    fs.removeSync(
      path.resolve(__dirname, '../../../../packages/.tmp/reactant')
    );
    fs.removeSync(
      path.resolve(__dirname, '../../../../packages/redux/.tmp/reactant')
    );
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
