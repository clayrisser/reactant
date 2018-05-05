import 'babel-polyfill';
import app from '~/../web/server';
// eslint-disable-next-line import/no-unresolved
import config from 'reaction/config';
import { createServer } from 'http';
// eslint-disable-next-line import/no-unresolved
import log from 'reaction/log';

app.use((err, req, res, next) => {
  if (err) {
    log.error(err);
    if (config.environment === 'production') {
      return res.status(500).send('Server error');
    }
    const prettyError = JSON.stringify(err.stack)
      .replace(/\s/g, '&nbsp;')
      .replace(/\\n/g, '<br />');
    return res
      .status(500)
      .send(
        `Restart your sever after fixing the following error . . .<br /><br />${prettyError.substr(
          1,
          prettyError.length - 2
        )}`
      );
  }
  return next();
});

const server = createServer(app);

server.listen(config.port, err => {
  if (err) throw err;
  log.info(`listening on port ${config.port}`);
  if (module.hot) {
    module.hot.accept('~/../web/server.js', () => {
      log.info('[HMR] updating HMR . . .');
    });
    log.info('[HMR] server HMR enabled');
  }
});

export default app;
