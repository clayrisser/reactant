import { Actions } from '@reactant/platform';
import build from './build';
import clean from './clean';
import start from './start';
import test from './test';

// @ts-ignore
export default { build, start, test, clean } as Actions;
