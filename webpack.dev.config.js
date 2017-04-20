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
  plugins: [definePlugin]
}
