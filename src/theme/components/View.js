import variable from '~/theme/variables/platform';

export default (variables = variable) => {
  const viewTheme = {
    '.padder': {
      padding: variables.contentPadding
    }
  };
  return viewTheme;
};
