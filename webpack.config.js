const path = require('path');

module.exports = (options) => {
  const appName = options.output.filename.startsWith('apps/admin/')
    ? 'admin'
    : 'api';
  const outputDirectory = path.dirname(options.output.filename);

  return {
    ...options,
    entry: {
      main: options.entry,
      instrumentation: path.resolve(
        __dirname,
        'apps',
        appName,
        'src',
        'instrumentation.mts',
      ),
    },
    module: {
      ...options.module,
      rules: options.module.rules.map((rule) =>
        rule.test?.toString() === '/.tsx?$/'
          ? { ...rule, test: /\.(?:tsx?|mts)$/ }
          : rule,
      ),
    },
    output: {
      ...options.output,
      filename: path.join(outputDirectory, '[name].js'),
    },
  };
};
