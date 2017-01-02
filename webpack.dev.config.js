import path from 'path'
import webpack from 'webpack'

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
    path: path.join(__dirname, '/client/public/'),
    filename: 'bundle.js',
    publicPath: ''
  },
  module: {
    preLoaders: [
      { test: /\.json$/, loader: 'json' }
    ],
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: [path.join(__dirname, 'client'), path.join(__dirname, 'server')]
      },
      {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader?resolve url',
        include: path.join(__dirname, 'client')
      },
      {
        test: /\.svg/, loader: 'svg-url-loader'
      },
      { test: /\.(woff|woff2|eot|ttf)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },
  plugins: [definePlugin]
}
