import React from 'react';
import { List } from 'native-base';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@reactant/storybook';
import TodoItem from '~/components/TodoItem';

const todoItem = storiesOf('TodoItem', module);

todoItem.add('finished', () => (
  <List style={styles.list}>
    <TodoItem
      id="finished-item"
      onToggle={action('handle toggle')}
      onDelete={action('handle delete')}
      finished
    >
      Finished Item
    </TodoItem>
  </List>
));

todoItem.add('unfinished', () => (
  <List style={styles.list}>
    <TodoItem
      id="unfinished-item"
      onToggle={action('handle toggle')}
      onDelete={action('handle delete')}
    >
      Unfinished Item
    </TodoItem>
  </List>
));

const styles = {
  list: {
    width: '100%'
  }
};
