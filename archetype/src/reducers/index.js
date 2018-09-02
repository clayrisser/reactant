import { combineReducers } from 'redux';
import loading from './loading';
import messages from './messages';
import tmp from './tmp';
import todos from './todos';

export default combineReducers({
  loading,
  messages,
  tmp,
  todos
});
