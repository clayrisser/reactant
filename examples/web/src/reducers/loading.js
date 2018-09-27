import _ from 'lodash';
import { START_LOADING, STOP_LOADING } from '~/actions/loading';

export default function loading(state = [], action) {
  switch (action.type) {
    case START_LOADING:
      return [...state, action.payload];
    case STOP_LOADING:
      return _.filter(state, item => action.payload !== item);
  }
  return state;
}
