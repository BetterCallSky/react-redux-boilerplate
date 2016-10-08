const webpackConfig = require('./webpack.config');
const _ = require('lodash');
const argv = require('yargs').argv;

const karmaConfig = {
  basePath: './', // project root in relation to bin/karma.js
  files: [
    {
      pattern: './tests/test-bundler.js',
      watched: false,
      served: true,
      included: true,
    },
  ],
  singleRun: !argv.watch,
  frameworks: ['mocha'],
  reporters: ['mocha'],
  preprocessors: {
    './tests/test-bundler.js': ['webpack'],
  },
  browsers: ['PhantomJS'],
  webpack: {
    devtool: 'cheap-module-source-map',
    resolve: _.assignIn({},
      webpackConfig.resolve,
      {
        alias: {
          sinon: 'sinon/pkg/sinon.js',
        },
      }
    ),
    plugins: webpackConfig.plugins,
    module: {
      noParse: [
        /\/sinon\.js/,
      ],
      loaders: webpackConfig.module.loaders.concat([
        {
          test: /sinon(\\|\/)pkg(\\|\/)sinon\.js/,
          loader: 'imports?define=>false,require=>false',
        },
      ]),
    },
    // Enzyme fix, see:
    // https://github.com/airbnb/enzyme/issues/47
    externals: {
      'react/addons': true,
      'react/lib/ExecutionEnvironment': true,
      'react/lib/ReactContext': 'window',
    },
    sassLoader: webpackConfig.sassLoader,
  },
  webpackMiddleware: {
    noInfo: true,
  },
  coverageReporter: [
    { type: 'text-summary' },
    { type: 'lcov', dir: 'coverage' },
  ],
};

if (!argv.watch) {
  karmaConfig.reporters.push('coverage');
  karmaConfig.webpack.module.preLoaders = [{
    test: /\.(js|jsx)$/,
    include: new RegExp('src'),
    loader: 'isparta',
    exclude: /node_modules/,
  }];
}

// cannot use `export default` because of Karma.
module.exports = (cfg) => cfg.set(karmaConfig);
