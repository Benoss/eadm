var webpack = require('webpack');
var path = require('path')
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  target: 'web',
  debug: false,
  devServer: {
    contentBase: './src'
  },
  entry: {
    app: [
      './src/init.less',
      './src/index.html',
      './src/favicon.ico',
      './src/init'
    ]
  },
  output: {
    path: path.join(__dirname, '..', 'build'),
    publicPath: '/',
    filename: '[name].js'
  },
  jshint: {
    esnext: true,
    asi: true
  },
  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      { test: /\.jsx$/, exclude: /node_modules/, loader: 'babel-loader?optional=runtime' },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?optional=runtime' },
      { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader","css-loader")},
      //{ test: /\.less$/, loader: "style!css!less"},
      { test: /\.less$/, loader: ExtractTextPlugin.extract("style-loader", "css!less")},
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      { test: /\.png(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      { test: /\.jpg(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      { test: /\.gif(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      { test: /\.ico(\?v=\d+\.\d+\.\d+)?$/, loader: "file?name=[path][name].[ext]&context=src" },
      { test: /\.html(\?v=\d+\.\d+\.\d+)?$/, exclude: /node_modules/, loader: "file?name=[path][name].[ext]&context=src" }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify('production')
    }),
    new ExtractTextPlugin("style.css", {
            allChunks: true
        }),
    //new webpack.optimize.UglifyJsPlugin({minimize: true})
  ]
};
