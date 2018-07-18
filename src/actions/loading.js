import { START_LOADING, STOP_LOADING } from '~/store/types';

export function startLoading(loadingId) {
  return {
    type: START_LOADING,
    payload: loadingId
  };
}

export function stopLoading(loadingId) {
  return {
    type: STOP_LOADING,
    payload: loadingId
  };
}

export default { startLoading, stopLoading };
