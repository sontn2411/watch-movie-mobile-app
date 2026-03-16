const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

const defaultConfig = getDefaultConfig(__dirname);
const {
  resolver: { sourceExts, assetExts },
} = defaultConfig;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-sass-transformer'),
  },
  resolver: {
    sourceExts: [...sourceExts, 'scss', 'sass'],
  },
};

module.exports = withNativeWind(mergeConfig(defaultConfig, config), {
  input: './src/styles/global.css',
});
