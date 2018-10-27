import _ from 'lodash';
import Promise from 'bluebird';
import log from './log';

export async function callLifecycle(name, app, ...args) {
  log.silly(`lifecylce '${name}' called`);
  await Promise.mapSeries(_.keys(app.plugins), async key => {
    const plugin = app.plugins[key];
    if (plugin[name]) {
      await plugin[name](app, ...args);
    }
  });
}

export default { callLifecycle };
