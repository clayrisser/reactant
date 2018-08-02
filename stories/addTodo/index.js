import React from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from 'reaction-build';
import AddTodo from '~/components/AddTodo';

const addTodo = storiesOf('AddTodo', module);

addTodo.add('default', () => <AddTodo onPress={action('handle press')} />);
