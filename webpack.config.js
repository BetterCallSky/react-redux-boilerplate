/* eslint no-param-reassign: 0 */

const _ = require('lodash');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const argv = require('yargs').argv;

const __DEV__ = process.env.NODE_ENV === 'development';
const __PROD__ = process.env.NODE_ENV === 'production';

const fixStyleLoader = (loader) => {
  if (!__DEV__) {
    const first = loader.loaders[0];
    const rest = loader.loaders.slice(1);
    loader.loader = ExtractTextPlugin.extract(first, rest.join('!'));
    delete loader.loaders;
  }
  return loader;
};

const getEnvPlugins = () => {
  if (__DEV__) {
    return [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
    ];
  }
  if (__PROD__) {
    return [
      new ExtractTextPlugin('[name].[contenthash].css', { allChunks: true }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          unused: true,
          dead_code: true,
          warnings: false,
        },
      }),
    ];
  }
  return [
    new ExtractTextPlugin('[name].[contenthash].css', { allChunks: true }),
  ];
};

module.exports = {
  name: 'client',
  target: 'web',
  devtool: 'source-map',
  resolve: {
    root: './src',
    extensions: ['', '.js', '.jsx', '.json'],
    fallback: [
      './src/styles/img',
    ],
  },
  entry: {
    app: _.compact([
      'babel-polyfill',
      __DEV__ && 'webpack-hot-middleware/client',
      './src/styles/style.scss',
      './src/main.jsx',
    ]),
    // add common vendors that are used in all routes
    vendor: [
      'react',
      'react-redux',
      'react-router',
      'redux',
      'redux-actions',
      'redux-connect',
      'lodash',
      'react-bootstrap',
    ],
  },
  output: {
    filename: '[name].[hash].js',
    path: './dist',
    publicPath: '/',
  },
  plugins: [
    new webpack.DefinePlugin({
      '__COVERAGE__' : !argv.watch && process.env.NODE_ENV === 'test',
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      hash: false,
      filename: 'index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: false,
      },
    }),
    ...getEnvPlugins(),
  ],
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          plugins: ['transform-runtime'],
          presets: ['es2015', 'react', 'stage-0'],
        },
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      fixStyleLoader({
        test: /\.scss$/,
        exclude: /styles/,
        loaders: [
          'style',
          'css?sourceMap&-minimize&modules&importLoaders=2&localIdentName=[name]__[local]___[hash:base64:5]',
          'postcss',
          'sass?sourceMap',
        ],
      }),
      fixStyleLoader({
        test: /\.scss$/,
        include: /styles/,
        loaders: [
          'style',
          'css?sourceMap&-minimize',
          'postcss',
          'sass?sourceMap',
        ],
      }),
      {
        test: /\.woff(\?.*)?$/,
        loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.woff2(\?.*)?$/,
        loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2',
      },
      {
        test: /\.otf(\?.*)?$/,
        loader: 'file?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype',
      },
      {
        test: /\.ttf(\?.*)?$/,
        loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream',
      },
      { test: /\.eot(\?.*)?$/, loader: 'file?prefix=fonts/&name=[path][name].[ext]' },
      { test: /\.svg(\?.*)?$/, loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml' },
      { test: /\.(png|jpg)$/, loader: 'url?limit=8192' },
    ],
  },
  postcss: [
    require('postcss-flexboxfixer'),
    require('autoprefixer')({
      browsers: ['last 2 versions'],
    }),
  ],
  sassLoader: {
    includePaths: './src/styles',
  },
};
