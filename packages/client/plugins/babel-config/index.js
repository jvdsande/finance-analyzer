const path = require('path')
const fs = require('fs')

function excludeJS(modulePath) {
  // always transpile client dir
  if (modulePath.startsWith(exports.clientDir)) {
    return false;
  }
  // Don't transpile node_modules except any docusaurus npm package
  return (/node_modules/.test(modulePath) &&
    !/(docusaurus)((?!node_modules).)*\.jsx?$/.test(modulePath));
}

module.exports = function(context, options) {
  // ...
  return {
    name: 'docusaurus-plugin-babel-config',
    configureWebpack(config, isServer, utils) {
      const babel = utils.getBabelLoader(isServer)

      const babelrc = JSON.parse(fs.readFileSync(path.join(process.cwd(), '.babelrc'), 'utf-8') || '{}')

      if(babelrc.plugins) {
        // Check if the plugin was previously registered. If it was, update the options.
        // If it was not, append
        babelrc.plugins.forEach(plugin => {
          const pluginName = Array.isArray(plugin) ? plugin[0] : plugin
          const originalIndex = babel.options.plugins.findIndex(p => p === pluginName || p[0] === pluginName)
          if(originalIndex > -1) {
            babel.options.plugins[originalIndex] = plugin
          } else {
            babel.options.plugins.push(plugin)
          }
        })
      }
      if(babelrc.presets) {
        // Check if the preset was previously registered. If it was, update the options.
        // If it was not, append
        babelrc.presets.forEach(preset => {
          const presetName = Array.isArray(preset) ? preset[0] : preset
          const originalIndex = babel.options.presets.findIndex(p => p === presetName || p[0] === presetName)
          if(originalIndex > -1) {
            babel.options.presets[originalIndex] = preset
          } else {
            babel.options.presets.push(preset)
          }
        })
      }

      const c = ({
        module: {
          rules: [
            {
              test: /\.(j|t)sx?$/,
              exclude: excludeJS,
              use: [utils.getCacheLoader(isServer), babel].filter(Boolean),
            },
          ]
        }
      })

      return c
    }
  }
}
