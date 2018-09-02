import _ from 'lodash';
import boom from 'boom';

export default async function validate(cmd, options) {
  const args = {};
  if (_.isString(options)) {
    throw boom.badRequest(`command '${options}' not allowed`);
  }
  return args;
}
