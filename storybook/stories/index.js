import React from 'react';
import { linkTo } from '@storybook/addon-links';
import { storiesOf } from 'reaction-build';
import TodoItem from '~/components/TodoItem';
import CenterView from './CenterView';
import Welcome from './Welcome';

storiesOf('Welcome', module).add('to Storybook', () => (
  <Welcome showApp={linkTo('TodoItem')} />
));

storiesOf('TodoItem', module)
  .addDecorator(getStory => (
    <CenterView>
      {getStory()}
    </CenterView>
))
  .add('finished', () => (
    <TodoItem finished>
Finished Item
    </TodoItem>
))
  .add('unfinished', () => (
    <TodoItem>
Unfinished Item
    </TodoItem>
));
