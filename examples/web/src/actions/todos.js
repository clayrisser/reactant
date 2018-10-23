export const ADD_TODO = 'ADD_TODO';
export const DEL_TODO = 'DEL_TODO';
export const TOGGLE_TODO = 'TOGGLE_TODO';

export function addTodo(name) {
  return {
    type: ADD_TODO,
    payload: name
  };
}

export function delTodo(todoId) {
  return {
    type: DEL_TODO,
    payload: todoId
  };
}

export function toggleTodo(todoId) {
  return {
    type: TOGGLE_TODO,
    payload: todoId
  };
}
