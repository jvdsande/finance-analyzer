module.exports = function(context, options) {
  // ...
  return {
    name: 'docusaurus-plugin-socket-io',
    configureWebpack(config, isServer, utils) {
      if(isServer) {
        return ({
          module: {
            rules: [{
              test: /socket.io-client/,
              use: 'null-loader',
            }]
          }
        })
      }

      return {}
    }
  }
}
