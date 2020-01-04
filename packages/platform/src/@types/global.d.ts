import { GlobalReactant } from '@reactant/types';

declare global {
  interface Window {
    __REACTANT__: GlobalReactant;
  }
}
