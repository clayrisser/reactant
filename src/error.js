import _ from 'lodash';
import log from './log';

export default function error(err) {
  if (err.isJoi) err.code = 400;
  if (err.originalError) err = err.originalError;
  if (err.statusCode) err.code = err.statusCode;
  if (err.output) err.code = _.get(err, 'output.statusCode');
  let code = 500;
  const statusCode = Number(err.code);
  if (statusCode && (100 <= statusCode && statusCode < 600)) code = statusCode;
  log.transports.console.label = code;
  if (code >= 500) {
    log.error(err);
  } else if (process.env.NODE_ENV !== 'production') {
    log.warn(err.message);
  }
  log.transports.label = null;
  const response = { message: err.message };
  if (err.data) response.payload = err.data;
  return response;
}
