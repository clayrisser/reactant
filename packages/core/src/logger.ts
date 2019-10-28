import ora from 'ora';
import { Logger } from '@reactant/types';

export default {
  debug: console.debug,
  error: console.error,
  info: console.info,
  silly: console.log,
  spinner: ora(),
  warn: console.warn
} as Logger;
