import _ from 'lodash';
import commander from 'commander';
import ora from 'ora';
import action from './action';
import { handleError, ERR_NO_ACTION, ERR_NO_PLATFORM } from './errors';
import { createConfig } from './config';
import { version } from '../package';
import { loadReactantPlatform, getReactantPlatforms } from './platform';

const spinner = ora('loading config').start();

let isAction = false;

function getCliInfo() {
  const config = createConfig({});
  let actions = [];
  let options = [];
  _.each(getReactantPlatforms(config), platformName => {
    const platform = loadReactantPlatform(config, platformName);
    _.each(_.keys(platform.actions), action => {
      actions = _.uniq([...actions, action]);
    });
    _.each(platform.options, (description, key) => {
      options = _.uniqBy([...options, { key, description }], 'key');
    });
  });
  return { actions, options };
}

const cliInfo = getCliInfo();

_.each(cliInfo.actions, action => {
  commander.command(action);
});
commander.version(version);
commander.option('--clean', 'clean');
commander.option('-c --config [config]', 'config');
commander.option('-d --debug', 'debug logging');
commander.option('-p --platform [name]', 'platform name');
commander.option('-v --verbose', 'verbose logging');
_.each(cliInfo.options, option => {
  commander.option(option.key, option.description);
});
commander.action((cmd, options) => {
  try {
    isAction = true;
    if (!options) throw ERR_NO_ACTION;
    if (!options.platform) throw ERR_NO_PLATFORM;
    return action(cmd, options, spinner).catch(handleError);
  } catch (err) {
    return handleError(err);
  }
});
commander.parse(process.argv);

if (!isAction) {
  handleError(ERR_NO_ACTION);
}
