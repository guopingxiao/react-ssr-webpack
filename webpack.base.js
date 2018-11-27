module.exports = {
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['react', 'stage-0', ['env', { //设置env，兼容最近两个版本浏览器
            targets: {
              browsers: ['last 2 versions']
            }
          }]], // babel-preset-react
        }
      }
    ]
  }
};
