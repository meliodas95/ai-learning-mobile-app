const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Force all @tanstack/react-query imports to a single entry point.
// The package has conflicting "react-native" (src/index.ts) and "exports"
// (build/modern/index.js) fields, causing Metro to create duplicate
// React contexts — one for the provider, another for useQuery hooks.
const reactQueryBuilt = path.resolve(
  __dirname,
  'node_modules/@tanstack/react-query/build/modern/index.js',
);

const origResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@tanstack/react-query') {
    return { type: 'sourceFile', filePath: reactQueryBuilt };
  }
  if (origResolveRequest) {
    return origResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
