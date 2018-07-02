import variable from '~/theme/variables/platform';

export default (variables = variable) => {
  const leftTheme = {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'flex-start'
  };
  return leftTheme;
};
