const webpack = require('webpack');
// const debug = process.env.NODE_ENV !== 'production'

module.exports = {

  entry: './src/client/client.js',

  output: {
    filename: './src/static/bundle.js' // path: path.resolve(__dirname, 'dist')
  },

  devServer: {
    inline: true,
    port: 8080
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({

      // Eliminate comments
      comments: false,

      // Compression specific options
      compress: {
        // remove warnings
        warnings: false,

        // Drop console statements
        drop_console: true
      },
    })
  ],

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',

        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  }

}
