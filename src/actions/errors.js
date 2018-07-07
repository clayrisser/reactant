import { REGISTER_ERROR } from '~/store/types';

export function registerError(err) {
  return {
    type: REGISTER_ERROR,
    payload: err
  };
}

export default { registerError };
