module.exports = {

  presets: ['module:@react-native/babel-preset'],

  plugins: ['react-native-reanimated/plugin'],
  // plugins: ['react-native-worklets/plugin'],
  env: {
    production: {
      // plugins: ['transform-remove-console'], //removing consoles.log from app during release (production) versions
    },
  },
};
