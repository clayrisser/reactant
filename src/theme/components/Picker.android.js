import variable from '~/theme/variables/platform';

export default (variables = variable) => {
  const pickerTheme = {
    '.note': {
      color: '#8F8E95'
    },
    marginRight: -4,
    flexGrow: 1
  };
  return pickerTheme;
};
