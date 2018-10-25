import _ from 'lodash';
import Promise from 'bluebird';

export async function callLifecycle(name, app, ...args) {
  await Promise.mapSeries(_.keys(app.plugins), async key => {
    const plugin = app.plugins[key];
    if (plugin[name]) {
      await plugin[name](app, ...args);
    }
  });
}

export default { callLifecycle };
