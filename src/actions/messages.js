import { REGISTER_MESSAGE } from '~/store/types';

export function registerMessage(message) {
  return {
    type: REGISTER_MESSAGE,
    payload: {
      type: 'info',
      message
    }
  };
}

export function registerError(err) {
  let { message } = err;
  if (!message) message = err.toString();
  return {
    type: REGISTER_MESSAGE,
    payload: {
      type: 'error',
      message
    }
  };
}

export function registerWarning(err) {
  let { message } = err;
  if (!message) message = err.toString();
  return {
    type: REGISTER_MESSAGE,
    payload: {
      type: 'warning',
      message
    }
  };
}

export default { registerMessage, registerError, registerWarning };
