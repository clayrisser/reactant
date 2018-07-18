import _ from 'lodash';
import { ADD_TODO, DEL_TODO, TOGGLE_TODO } from '~/store/types';

export default function updateTmp(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          name: action.payload,
          id: `${_.snakeCase(action.payload)}_${_.now()}`,
          done: false
        }
      ];
    case DEL_TODO:
      return _.filter(state, todo => action.payload !== todo.id);
    case TOGGLE_TODO: {
      const cloned = { ...state };
      const todo = _.find(state, todo => action.payload !== todo.id);
      todo.done = !todo.done;
      return cloned;
    }
  }
  return state;
}
