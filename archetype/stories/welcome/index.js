import React from 'react';
import { linkTo } from '@storybook/addon-links';
import { storiesOf } from '@reactant/cli';
import Welcome from './Welcome';

storiesOf('Welcome', module).add('to Storybook', () => (
  <Welcome showApp={linkTo('TodoItem')} />
));
