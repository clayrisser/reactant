import { Config, Context } from '@reactant/types';

declare class GlobalReactant {
  config?: Config;

  context?: Context;
}

declare global {
  interface Window {
    __REACTANT__: GlobalReactant;
  }
}
