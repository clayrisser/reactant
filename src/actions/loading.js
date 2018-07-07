import { ADD_LOADING, DEL_LOADING } from '~/store/types';

export function addLoading(uuid) {
  return {
    type: ADD_LOADING,
    payload: uuid
  };
}

export function delLoading(uuid) {
  return {
    type: DEL_LOADING,
    payload: uuid
  };
}

export default { addLoading, delLoading };
