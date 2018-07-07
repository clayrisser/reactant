import { ADD_LOADING, DEL_LOADING } from '~/store/types';
import _ from 'lodash';

export default function loading(state = [], action) {
  switch (action.type) {
    case ADD_LOADING:
      return [...state, action.payload];
    case DEL_LOADING:
      return _.filter(state, item => action.payload !== item);
  }
  return state;
}
