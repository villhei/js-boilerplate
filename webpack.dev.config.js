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
    rules: [
      {
        test: /\.js$/,
        include: /(client|server)/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: ['es2015', 'stage-2', 'react'],
          plugins: ['transform-flow-strip-types']
        }
      },
      {
        test: /\.svg/,
        use: 'svg-url-loader'
      },
      {
        test: /\.(styl|css)$/,
        include: /client/,
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
  plugins: [definePlugin]
}
