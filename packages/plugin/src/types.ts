export interface Plugin {
  defaultOptions?: Partial<PluginOptions>;
  name?: string;
}

export type PluginOption = any;

export interface PluginOptions {
  [key: string]: PluginOption;
}

export interface Plugins<TPlugin = Plugin> {
  [key: string]: TPlugin;
}

export interface CalculatedPlugin extends Plugin {
  moduleName: string;
  name: string;
  options: PluginOptions;
}

export type CalculatedPlugins = Plugins<CalculatedPlugin>;
