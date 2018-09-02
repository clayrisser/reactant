import { REGISTER_MESSAGE } from '~/actions/messages';

export default function messages(state = [], action) {
  switch (action.type) {
    case REGISTER_MESSAGE:
      return [...state, action.payload];
  }
  return state;
}
