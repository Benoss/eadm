var webpack = require('webpack');
var path = require('path')
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  target: 'web',
  debug: false,
  devServer: {
    contentBase: './'
  },
  entry: {
    app: [
      './src/init.less',
      './index.html',
      './src/favicon.ico',
      './src/init'
    ]
  },
  output: {
    path: path.join(__dirname, '..', 'dist'),
    publicPath: './',
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
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "file?name=[name].[ext]&context=." },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "file?name=[name].[ext]&context=." },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "file?name=[name].[ext]&context=." },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "file?name=[name].[ext]&context=." },
      { test: /\.png(\?v=\d+\.\d+\.\d+)?$/, loader: "file?name=[name].[ext]&context=." },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file?name=[name].[ext]&context=." },
      { test: /\.jpg(\?v=\d+\.\d+\.\d+)?$/, loader: "file?name=[name].[ext]&context=." },
      { test: /\.gif(\?v=\d+\.\d+\.\d+)?$/, loader: "file?name=[name].[ext]&context=." },
      { test: /\.ico(\?v=\d+\.\d+\.\d+)?$/, loader: "file?name=[name].[ext]&context=." },
      { test: /\.html(\?v=\d+\.\d+\.\d+)?$/, exclude: /node_modules/, loader: "file?name=[name].[ext]&context=." }
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
