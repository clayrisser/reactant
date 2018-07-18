module.exports = {
  title: 'Reaction',
  initialState: {
    messages: [],
    loading: [],
    tmp: {},
    todos: [
      {
        name: 'Clean the kitchen',
        id: 'clean-the-kitchen',
        done: false
      }
    ]
  },
  webpack: function(config, webpack) {
    return webpack;
  }
};
