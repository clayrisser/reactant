import { START_LOADING, STOP_LOADING } from '~/store/types';
import _ from 'lodash';

export default function loading(state = [], action) {
  switch (action.type) {
    case START_LOADING:
      return [...state, action.payload];
    case STOP_LOADING:
      return _.filter(state, item => action.payload !== item);
  }
  return state;
}
