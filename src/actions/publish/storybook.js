import Promise from 'bluebird';
import _ from 'lodash';
import easycp from 'easycp';
import ora from 'ora';
import buildStorybook from '../build/storybook';
import createConfig from '../../createConfig';
import log from '../../log';

export default async function publishStorybook(options, config) {
  if (!config) {
    config = createConfig({ defaultEnv: 'production', options });
    log.debug('options', options);
    log.debug('config', config);
  }
  const spinner = ora('publishing storybook\n').start();
  await buildStorybook(options, config);
  if (_.get(config, 'publish.storybook')) {
    await Promise.mapSeries(config.publish.storybook, async script => {
      await easycp(script);
    });
  }
  spinner.succeed('published storybook');
}
