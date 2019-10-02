import Err from 'err';
import { Logger } from './types';

let _logger: Logger;

export function setLogger(logger: Logger): Logger {
  _logger = logger;
  return _logger;
}

export function getLogger(): Logger {
  if (!_logger) throw new Err('cannot get logger before it is set');
  return _logger;
}
