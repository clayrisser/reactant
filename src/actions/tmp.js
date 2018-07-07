import { UPDATE_TMP } from '~/store/types';

export function updateTmp(key, data) {
  return {
    type: UPDATE_TMP,
    payload: { key, data }
  };
}

export default { updateTmp };
