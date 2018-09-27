export const START_LOADING = 'START_LOADING';
export const STOP_LOADING = 'STOP_LOADING';

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
