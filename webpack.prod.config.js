import path from 'path'
import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'

const definePlugin = new webpack.DefinePlugin({
  'process.env': {
    'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }
})

export default {
  devtool: 'eval-source-map',
  entry: [
    './client/src/index'
  ],
  output: {
    path: path.join(__dirname, './build/client/public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /(client|server)/,
        use: 'babel-loader'
      },
      {
        test: /\.svg/,
        use: 'svg-url-loader'
      },
      {
        test: /\.(styl|css)$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'stylus-loader?resolve url'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        loader: 'file-loader'
      },
      {
        test: /\.(jpg|png|gif)$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [definePlugin,
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'common.js',
      minChunks: module => module.context && module.context.includes('node_modules')
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new ExtractTextPlugin('styles.css'),
    new OptimizeCssAssetsPlugin(),
    new CopyWebpackPlugin([
      {
        from: 'client/public/index.html'
      },
      {
        from: 'client/public/images/favicon.ico',
        to: 'images/[name].[ext]'
      }
    ])
  ]
}
