module.exports = function(context, options) {
  // ...
  return {
    name: 'docusaurus-plugin-yaml-loader',
    configureWebpack(config, isServer, utils) {
      return ({
        module: {
          rules: [
            {
              test: /\.ya?ml$/,
              type: 'json',
              use: 'yaml-loader'
            }
          ]
        }
      })
    }
  }
}
