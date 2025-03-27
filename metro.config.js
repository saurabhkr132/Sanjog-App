const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname)

config.resolver = config.resolver || {};
config.resolver.assetExts = config.resolver.assetExts || [];
config.resolver.assetExts.push('cjs');

module.exports = withNativeWind(config, { input: './app/global.css' });