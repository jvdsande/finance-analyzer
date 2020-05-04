const path = require('path')
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin')

const resolvableExtensions = () => [".ts", ".tsx", ".js", ".jsx"]

module.exports = function(context, options) {
  // ...
  return {
    name: 'docusaurus-plugin-tsconfig-paths',
    configureWebpack(config, isServer, utils) {
      const defaultOptions = {
        configFile: path.join(process.cwd(), 'tsconfig.json'),
        extensions: resolvableExtensions(),
      }

      // Compile the loader options.  If additional options are included
      // by the end user, then override the defaults with them.
      const pluginOptions = Object.assign(
        {},
        defaultOptions,
        options,
      );

      return ({
        resolve: {
          plugins: [
            new TsconfigPathsPlugin(pluginOptions),
          ],
        },
      })
    }
  }
}
