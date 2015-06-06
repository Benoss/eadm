var webpack = require('webpack');
var webpackConfig = require('./webpack.development');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

webpackConfig.entry.app.unshift('webpack-dev-server/client?http://127.0.1:8080',
  'webpack/hot/dev-server');
webpackConfig.debug = true;
webpackConfig.devtool = 'source-map'
webpackConfig.output.chunkFilename= '[chunkhash].js';
webpackConfig.output.sourceMapFilename= 'debugging/[file].map';
webpackConfig.output.hotUpdateChunkFilename= 'hot/[id].[hash].hot-update.js';
webpackConfig.output.hotUpdateMainFilename= 'hot/[hash].hot-update.json';


webpackConfig.plugins = [
  new webpack.DefinePlugin({
    NODE_ENV: JSON.stringify('development')
  }),
  new webpack.NoErrorsPlugin(),
  new ExtractTextPlugin("style.css"),
];

webpackConfig.module.loaders[0] = { test: /\.jsx$/, exclude: /node_modules/, loaders: ['react-hot', 'babel-loader?optional=runtime'] };

module.exports = webpackConfig;
