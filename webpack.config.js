const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
entry: {
  index: './src/index.js',
},
output: {
  publicPath: '/'
},
devServer: {
  historyApiFallback: true,
},
optimization: {
  splitChunks: {
    chunks: 'all',
    minSize: 50000,
    // maxSize: 245760,
    // maxSize: 2000000
  },
},
module: {
  rules: [
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader"
      }
    },
    {
      test: /\.html$/,
      use: [
        {
          loader: "html-loader"
        }
      ]
    },
    {
      test: /\.s[ac]ss$/i,
      use: [
        // Creates `style` nodes from JS strings
        'style-loader',
        // Translates CSS into CommonJS
        'css-loader',
        // Compiles Sass to CSS
        'sass-loader',
      ],
    },
    {
      test: /\.(png|jpe?g|gif)$/i,
      loader: 'file-loader',
      options: {
        publicPath: '',
        name: 'images/[hash]-[name].[ext]'
      }
    },
    {
      test: /\.svg/,
      use: {
        loader: 'svg-url-loader',
        options: {}
      }
    }
  ]
},
plugins: [
  new CleanWebpackPlugin(),
  new HtmlWebPackPlugin({
    template: "./src/index.html",
    filename: "./index.html"
  })
]
};