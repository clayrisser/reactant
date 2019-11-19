import { combineReducers } from '@reactant/redux';

const reducers = combineReducers({
  hello: (f = {}) => f
});

export default reducers;
