var path = require('path')

module.exports = {
  entry: './client/client.js',

  output: {
    filename: './client/bundle.js',
    //path: path.resolve(__dirname, 'dist')
  },

  devServer: {
    inline: true,
    port: 8080
  },

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

