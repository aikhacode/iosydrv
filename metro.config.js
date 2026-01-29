const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

const config = {
    transformer: {
        unstable_allowRequireContext: true, // optional but safe for RN 0.80
    },
};

const merged = mergeConfig(getDefaultConfig(__dirname), config);

module.exports = wrapWithReanimatedMetroConfig(merged);
