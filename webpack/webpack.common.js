const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: {
    popup: path.join(__dirname, '../src/popup.tsx'),
    background: path.join(__dirname, '../src/background.ts'),
    content_script: path.join(__dirname, '../src/content_script.tsx'),
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@': path.resolve(__dirname, '../src/'),
    },
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'public', to: '.' }],
    }),
    new Dotenv(),
  ],
}; 