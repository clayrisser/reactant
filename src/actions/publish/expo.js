import easycp from 'easycp';
import ora from 'ora';
import createConfig from '../../createConfig';
import log from '../../log';

export default async function publishExpo(options, config) {
  if (!config) {
    config = createConfig({ defaultEnv: 'production', options });
    log.debug('options', options);
    log.debug('config', config);
  }
  const spinner = ora('Publishing expo\n').start();
  await easycp('exp publish');
  spinner.succeed('Published expo');
}
