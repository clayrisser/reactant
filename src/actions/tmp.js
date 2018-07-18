export const UPDATE_TMP = 'UPDATE_TMP';

export function updateTmp(key, data) {
  return {
    type: UPDATE_TMP,
    payload: { key, data }
  };
}

export default { updateTmp };
