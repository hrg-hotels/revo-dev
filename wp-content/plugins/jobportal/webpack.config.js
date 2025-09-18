// webpack.config.js
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',

  // JS-Entry (CSS wird in main.js via import '../../css/src/index.css' eingesammelt)
  entry: './assets/js/src/main.js',

  output: {
    path: path.resolve(__dirname, 'assets/js/dist'),
    filename: 'jobportal.bundle.js',
    clean: true
  },

  devtool: process.env.NODE_ENV === 'development' ? 'source-map' : false,

  module: {
    rules: [
      // JS (Babel)
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            sourceType: 'unambiguous',
            presets: [
              ['@babel/preset-env', { useBuiltIns: 'usage', corejs: 3 }]
            ]
          }
        }
      },

      // CSS (Extract + PostCSS/Autoprefixer)
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader'
        ]
      },

      // Assets aus CSS/JS (Bilder, SVGs)
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          // relativ zu output.path (assets/js/dist) → schreibt nach assets/img/
          filename: '../../img/[name][ext]'
        }
      }
    ]
  },

  // jQuery nicht einbündeln – WP liefert es global
  externals: { jquery: 'jQuery' },

  plugins: [
    // $ / jQuery überall verfügbar machen, ohne in jedem Modul zu importieren
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),

    // gebündelte CSS-Datei
    new MiniCssExtractPlugin({
      // Pfad relativ zu output.path → ergibt assets/css/dist/jobportal.css
      filename: '../../css/dist/jobportal.css'
    })
  ],

  resolve: {
    extensions: ['.js', '.json']
    // Optional:
    // alias: { '@': path.resolve(__dirname, 'assets/js/src') }
  }
};
