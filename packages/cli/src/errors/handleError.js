import _ from 'lodash';
import { log } from '@reactant/core';

export default function handleError(err) {
  err = sanitizeErr(err);
  if (!err.code || !_.isNumber(err.code)) err.code = 500;
  const statusCode = err.code.toString();
  if (statusCode.length && statusCode[0] === '4') {
    log.warn(err.message);
  } else {
    log.error(err.stack);
  }
  process.exit(1);
}

function sanitizeErr(err) {
  if (err.isJoi) err.code = 400;
  if (err.originalError) err = err.originalError;
  if (err.statusCode) err.code = err.statusCode;
  if (err?.output?.statusCode) err.code = err.output.statusCode;
  return err;
}
