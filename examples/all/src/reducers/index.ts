import { combineReducers } from 'redux';

const reducers = combineReducers({
  hello: (f = {}) => f
});

export default reducers;
