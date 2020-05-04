const Dotenv = require('dotenv-webpack')

module.exports = function(context, options) {
  const activeEnv = process.env.ACTIVE_ENV || process.env.NODE_ENV || 'development'
  return {
    name: 'docusaurus-plugin-dotenv',
    configureWebpack(config, isServer, utils) {
      if(isServer) {
        console.log(`Using environment config: '${activeEnv}'`)
      }

      return ({
        plugins: [
          new Dotenv({
            path: `.env.${activeEnv}`,
          })
        ]
      })
    }
  }
}
