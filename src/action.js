import boom from 'boom';
import commander from 'commander';
import buildAndroid from './actions/build/android';
import buildExpo from './actions/build/expo';
import buildIos from './actions/build/ios';
import buildWeb from './actions/build/web';
import clean from './actions/clean';
import publishAndroid from './actions/publish/android';
import publishExpo from './actions/publish/expo';
import publishIos from './actions/publish/ios';
import publishWeb from './actions/publish/web';
import setup from './actions/setup';
import startAndroid from './actions/start/android';
import startExpo from './actions/start/expo';
import startIos from './actions/start/ios';
import storybookWeb from './actions/storybook/web';
import startWeb from './actions/start/web';
import validate from './validate';
import { setLevel } from './log';

export default async function action(cmd, options) {
  if (options.verbose) setLevel('verbose');
  if (options.debug) setLevel('debug');
  await validate(cmd, options);
  switch (cmd) {
    case 'build':
      if (options.platform === 'android') return buildAndroid(options);
      if (options.platform === 'expo') return buildExpo(options);
      if (options.platform === 'ios') return buildIos(options);
      if (options.platform === 'web') return buildWeb(options);
      break;
    case 'clean':
      return clean(options);
    case 'setup':
      return setup(options);
    case 'start':
      if (options.platform === 'android') return startAndroid(options);
      if (options.platform === 'expo') return startExpo(options);
      if (options.platform === 'ios') return startIos(options);
      if (options.platform === 'web') return startWeb(options);
      break;
    case 'publish':
      if (options.platform === 'android') return publishAndroid(options);
      if (options.platform === 'expo') return publishExpo(options);
      if (options.platform === 'ios') return publishIos(options);
      if (options.platform === 'web') return publishWeb(options);
      break;
    case 'storybook':
      if (options.platform === 'web') return storybookWeb(options);
      break;
    default:
      return commander.help();
  }
  throw boom.badRequest('invalid platform');
}
