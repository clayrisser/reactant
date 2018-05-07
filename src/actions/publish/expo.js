import _ from 'lodash';
import boom from 'boom';
import easycp, { readcp } from 'easycp';
import ora from 'ora';
import createConfig from '../../createConfig';
import log from '../../log';

export default async function publishExpo(options, config) {
  if (!config) {
    config = await createConfig({ defaultEnv: 'production', options });
    log.debug('options', options);
    log.debug('config', config);
  }
  const spinner = ora('publishing expo\n').start();
  if (!(await readcp('which exp')).length) {
    spinner.stop();
    throw boom.badRequest('exp not installed');
  }
  await easycp('exp publish');
  if (_.get(config, 'publish.expo')) {
    await Promise.mapSeries(config.publish.expo, async script => {
      await easycp(script);
    });
  }
  spinner.succeed('published expo');
}
