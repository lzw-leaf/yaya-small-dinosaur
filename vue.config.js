module.exports = {
  publicPath: './',
  outputDir: 'docs',
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // eslint-disable-next-line @typescript-eslint/camelcase
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  }
}
