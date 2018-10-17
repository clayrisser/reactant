import Err from 'err';
import handleError from './handleError';

export const ERR_NO_ACTION = new Err('No action specified', 400);
export const ERR_NO_PLATFORM = new Err('No platform specified', 400);

export { handleError };
export default {
  ERR_NO_ACTION,
  ERR_NO_PLATFORM,
  handleError
};
