import React from 'react';
import { linkTo } from '@storybook/addon-links';
import { storiesOf } from 'reaction-build';
import Welcome from './Welcome';

storiesOf('Welcome', module).add('to Storybook', () => (
  <Welcome showApp={linkTo('TodoItem')} />
));
