// var path = require('path')

module.exports = {
  entry: './src/client/client.js',

  output: {
    filename: './src/static/bundle.js' // path: path.resolve(__dirname, 'dist')
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
