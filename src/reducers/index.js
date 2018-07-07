import { combineReducers } from 'redux';
import errors from './errors';
import loading from './loading';
import tmp from './tmp';

export default combineReducers({
  errors,
  loading,
  tmp
});
