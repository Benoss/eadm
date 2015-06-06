var path = require('path')
var webpack = require('webpack')

var BOOTSTRAP_INCLUDE_PATH ="includePaths[]=" +
        path.resolve(__dirname, './bower_components/bootstrap-sass-official/assets/stylesheets')
var SCSS_LOADER = "style-loader!css-loader!sass-loader?"+BOOTSTRAP_INCLUDE_PATH;

module.exports = {
  cache: true
, debug: true
, devtool: 'source-map'
, entry: {
    app: ['webpack/hot/dev-server', './src/css/styles.scss', './src/js/app.jsx']
  }
, devServer: {
    contentBase: './src'
  }
, output: {
    path: process.env.NODE_ENV === 'production' ? './src/dist' : './build'
  , publicPath: '/dist'
  , filename: '[name].js'
  , chunkFilename: '[chunkhash].js'
  , sourceMapFilename: 'debugging/[file].map'
  , hotUpdateChunkFilename: 'hot/[id].[hash].hot-update.js'
  , hotUpdateMainFilename: 'hot/[hash].hot-update.json'
  }
, module: {
    loaders: [
      {test: /\.js$/, exclude:[/node_modules/, /public\/components/, /build/,], loader: 'babel-loader?optional=runtime'}
    , {test: /\.jsx$/, exclude:[/node_modules/, /public\/components/, /build/], loaders: [ 'react-hot', 'babel-loader?optional=runtime']}
    ,{ test: /\.scss$/, exclude:[/node_modules/, /public\/components/, /build/], loader: SCSS_LOADER }
      ,      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&minetype=application/font-woff&"+BOOTSTRAP_INCLUDE_PATH },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,  loader: "url?limit=10000&minetype=application/font-woff&"+BOOTSTRAP_INCLUDE_PATH },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&minetype=application/octet-stream&"+BOOTSTRAP_INCLUDE_PATH },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: "file?"+BOOTSTRAP_INCLUDE_PATH },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&minetype=image/svg+xml&"+BOOTSTRAP_INCLUDE_PATH }
        ]
  , noParse: /\.min\.js/
  }
, resolve: {
    modulesDirectories: ['bower_components', 'node_modules']
  , extensions: ['', '.js', '.jsx', '.json']
  }
, plugins: [
    function() {
      this.plugin("done", function(stats) {
        stats = stats.toJson();
        console.error(JSON.stringify({
          assetsByChunkName: stats.assetsByChunkName
        }));
      });
    }
  ]
}
