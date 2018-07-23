import React from 'react';
import { List } from 'native-base';
import { linkTo } from '@storybook/addon-links';
import { storiesOf } from 'reaction-build';
import TodoItem from '~/components/TodoItem';
import CenterView from './CenterView';
import Welcome from './Welcome';

storiesOf('Welcome', module).add('to Storybook', () => (
  <Welcome showApp={linkTo('TodoItem')} />
));

storiesOf('TodoItem', module)
  .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
  .add('finished', () => (
    <List style={styles.list}>
      <TodoItem id="finished-item" finished>
        Finished Item
      </TodoItem>
    </List>
  ))
  .add('unfinished', () => (
    <List style={styles.list}>
      <TodoItem id="unfinished-item">Unfinished Item</TodoItem>
    </List>
  ));

const styles = {
  list: {
    width: '100%'
  }
};
