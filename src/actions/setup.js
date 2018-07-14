import boom from 'boom';
import easycp, { silentcp } from 'easycp';
import ora from 'ora';
import { log } from 'reaction-base';
import createConfig from '../createConfig';

export default async function setup(options, config) {
  if (!config) {
    config = await createConfig({ action: 'setup', options });
    log.debug('options', options);
    log.debug('config', config);
  }
  if (options.inotify) {
    if (!(process.getuid && process.getuid() === 0)) {
      throw boom.badRequest('requires root privileges');
    }
    const spinner = ora('increasing inotify').start();
    let cp = silentcp;
    if (options.debug) cp = easycp;
    await cp('sh', [
      '-c',
      'echo fs.inotify.max_user_instances=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p'
    ]);
    await cp('sh', [
      '-c',
      'echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p'
    ]);
    await cp('sh', [
      '-c',
      'echo fs.inotify.max_queued_events=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p'
    ]);
    spinner.succeed('increased inotify');
  }
}
