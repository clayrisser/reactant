import { Context } from '@reactant/platform';

export default function getContext(): Context {
  return window.__REACTANT__.context!;
}
