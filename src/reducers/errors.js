import { REGISTER_ERROR } from '~/store/types';

export default function errors(state = [], action) {
  switch (action.type) {
    case REGISTER_ERROR:
      return [...state, action.payload];
  }
  return state;
}
