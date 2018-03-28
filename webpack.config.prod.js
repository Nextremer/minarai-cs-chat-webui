const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const autoprefixer = require('autoprefixer');

module.exports = {
  entry: [ 'babel-polyfill', __dirname + '/src/js/app.js' ],
  output: {
    path: __dirname + '/www/',
    // publicPath: '/',
    filename: 'main.js'
  },
  resolve: {
    extensions: ['', '.js'],
    root:[ path.resolve( __dirname, './src/js' ) ],
  },
  cache: true,
  module: {
    loaders: [
    {
      test: /\.js$/,
      include: path.resolve(__dirname, './src/js'),
      exclude: /(node_modules|bower_components)/,
      loader: 'babel?cacheDirectory=true'
    },
    {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style-loader', [ 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]&minimize&-autoprefixer', 'postcss' ])
    },
    {
      test: /\.png$/,
      loader: 'url-loader?limit=100000'
    },
    {
      test: /\.jpg$/,
      loader: 'url-loader?mimetype=image/jpg'
    },
    {
      test: /\.svg$/,
      loader: 'file?name=assets/images/[name].[ext]',
    },
    ]
  },
  postcss: [
    require('postcss-mixins'),
    require('postcss-nested'),
    require('postcss-simple-vars'),
    require('postcss-color-hex-alpha'),
    autoprefixer({ browsers: [ 'last 2 versions', 'ios 8' ] })
  ],
  plugins: [
    new ExtractTextPlugin('main.css', { allChunks: true }),
    new webpack.ProvidePlugin({
      'React': 'react',
      'ReactDOM': 'react-dom',
      'CSSModules': 'react-css-modules',
      'axios': 'axios',
      'moment': 'moment',
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ],
  externals: []
}
