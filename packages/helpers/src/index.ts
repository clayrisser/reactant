import { Context } from '@reactant/types';
import { Options as ExecaOptions, ExecaReturnValue } from 'execa';
import mapSeries from './mapSeries';
import spawn from './spawn';
import where from './where';

export default class Helpers {
  constructor(public context: Context) {}

  async spawn(
    bin: string | string[],
    args: string[] = [],
    options?: ExecaOptions
  ): Promise<ExecaReturnValue<string>> {
    return spawn(this.context.paths.root, bin, args, options);
  }

  async mapSeries<V = any, R = V>(
    values: Array<V>,
    iterator: (value: V, i?: number, length?: number) => Promise<R>
  ): Promise<R[]> {
    return mapSeries<V, R>(values, iterator);
  }

  async where(
    program: string,
    unixCommand?: string,
    PATH = process.env.PATH
  ): Promise<string | null> {
    return where(program, unixCommand, PATH);
  }
}

export { mapSeries, spawn, where };
