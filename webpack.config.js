const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');

const config = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      }
    ]
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['ts', 'tsx'],
      fix: true,
    }),
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.config().parsed) // it will automatically pick up key values from .env file
    }),
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    return {
      ...config,
      devtool: 'inline-source-map',
      devServer: {
        contentBase: './dist',
      },
    };
  }

  return config;
};
