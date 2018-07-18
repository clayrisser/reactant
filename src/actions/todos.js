import { ADD_TODO, DEL_TODO, TOGGLE_TODO } from '~/store/types';

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
