import variable from '~/theme/variables/platform';

export default (variables = variable) => {
  const labelTheme = {
    '.focused': {
      width: 0
    },
    fontSize: 17
  };
  return labelTheme;
};
