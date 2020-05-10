import { ExecaReturnValue, Options as ExecaOptions } from 'execa';
import { Context, Logger, CreateConfigOptions } from '.';

export interface Api {
  context: Context;
  logger: Logger;
  prepareLocal(): Promise<void>;
  createWebpackConfig(options?: CreateConfigOptions): Promise<void>;
  createBabelConfig(options?: CreateConfigOptions): Promise<void>;
  spawn(
    bin: string | string[],
    args?: string[],
    options?: ExecaOptions
  ): Promise<ExecaReturnValue<string>>;
  where(program: string): Promise<string | null>;
}
