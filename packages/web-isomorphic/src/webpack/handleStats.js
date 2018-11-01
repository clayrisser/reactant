import _ from 'lodash';
import chalk from 'chalk';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import newRegExp from 'newregexp';
import { log } from '@reactant/core';

const { env } = process;

export default function handleStats(stats, config) {
  const { ignore, options } = config;
  let messages = {};
  if (options.debug) {
    messages = stats.toJson({}, true);
  } else {
    messages = formatWebpackMessages(stats.toJson('verbose'));
  }
  const warnings = filterMessages(messages.warnings, ignore.warnings, config);
  if (warnings.length) {
    if (env.CI && env.CI.toLowerCase() !== 'false') {
      log.info(
        chalk.yellow(
          '\ntreating warnings as errors because `CI = true`\n' +
            'most CI servers set it automatically'
        )
      );
      log.error(`\n${warnings.join('\n\n')}\n`);
    } else {
      log.warn(`\n${warnings.join('\n\n')}\n`);
    }
  }
  const errors = filterMessages(messages.errors, ignore.errors, config);
  if (errors.length) log.error(`\n${errors.join('\n\n')}\n`);
  return {
    errors,
    messages,
    warnings
  };
}

function filterMessages(messages, ignore = [], config) {
  const { options } = config;
  if (options.debug) return messages;
  return _.filter(messages, message => {
    let filter = false;
    ignore.forEach(ignoreItem => {
      if (/^\/.*\/[a-z]*$/.test(ignoreItem)) {
        const regex = newRegExp(ignoreItem);
        if (regex.test(message)) filter = true;
      } else if (message.indexOf(ignoreItem) > -1) {
        filter = true;
      }
      return !filter;
    });
    return !filter;
  });
}
