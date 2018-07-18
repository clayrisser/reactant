import { REGISTER_MESSAGE } from '~/store/types';

export default function errors(state = [], action) {
  switch (action.type) {
    case REGISTER_MESSAGE:
      return [...state, action.payload];
  }
  return state;
}
