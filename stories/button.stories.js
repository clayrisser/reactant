import React from 'react';
import { storiesOf } from '@storybook/react';
import Popup from '~/components/Popup';

const buttonStories = storiesOf('Button', module);
buttonStories.add('with text', () => (
  <Popup title="Hello Button" message="I am a popup" />
));
