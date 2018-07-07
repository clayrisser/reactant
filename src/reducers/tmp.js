import { UPDATE_TMP } from '~/store/types';

export default function updateTmp(state = {}, action) {
  switch (action.type) {
    case UPDATE_TMP:
      return {
        ...state,
        [action.payload.key]: action.payload.data
      };
  }
  return state;
}
