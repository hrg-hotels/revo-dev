const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  entry: './assets/js/src/main.js',
  output: {
    path: path.resolve(__dirname, 'assets/js/dist'),
    filename: 'jobportal.bundle.js',
    clean: true
  },
  devtool: process.env.NODE_ENV === 'development' ? 'source-map' : false,
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            sourceType: 'unambiguous',
            presets: [['@babel/preset-env', { useBuiltIns: 'usage', corejs: 3 }]]
            // alternativ statt presets: configFile: path.resolve(__dirname, 'babel.config.json')
          }
        }
      }
    ]
  },
  externals: { jquery: 'jQuery' }
};
