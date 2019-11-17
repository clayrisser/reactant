import { Config } from '@reactant/types';

declare class GlobalReactant {
  config?: Config;
}

declare global {
  interface Window {
    __REACTANT__: GlobalReactant;
  }
}
