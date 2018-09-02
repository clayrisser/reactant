import { UPDATE_TMP } from '~/actions/tmp';

export default function tmp(state = {}, action) {
  switch (action.type) {
    case UPDATE_TMP:
      return {
        ...state,
        [action.payload.key]: action.payload.data
      };
  }
  return state;
}
