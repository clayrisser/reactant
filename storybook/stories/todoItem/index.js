import React from 'react';
import { List } from 'native-base';
import { StorybookView, storiesOf } from 'reaction-build';
import TodoItem from '~/components/TodoItem';

const todoItem = storiesOf('TodoItem', module);
todoItem.addDecorator(getStory => <StorybookView>{getStory()}</StorybookView>);

todoItem.add('finished', () => (
  <List style={styles.list}>
    <TodoItem id="finished-item" finished>
      Finished Item
    </TodoItem>
  </List>
));

todoItem.add('unfinished', () => (
  <List style={styles.list}>
    <TodoItem id="unfinished-item">Unfinished Item</TodoItem>
  </List>
));

const styles = {
  list: {
    width: '100%'
  }
};
