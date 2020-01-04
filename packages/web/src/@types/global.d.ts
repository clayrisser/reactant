import { GlobalReactant } from '@reactant/platform';

declare global {
  interface Window {
    __REACTANT__: GlobalReactant;
  }
}
