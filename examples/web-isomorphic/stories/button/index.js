import React from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { Button } from '~/components';

storiesOf('Button', module).add('Default Button', () => (
  <Button onClick={action('Hello, world!')}>Hello, world!</Button>
));
