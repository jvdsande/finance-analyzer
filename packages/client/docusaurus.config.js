const path = require('path')

module.exports = {
  title: 'Finance Analyzer',
  tagline: 'Simple finance analyzer',
  url: 'https://finance.jvdsande.com/',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'jvdsande',
  projectName: 'finance-analyzer',
  presets: [
    ['@docusaurus/preset-classic'],
  ],
  plugins: [
    // Enable root resolution from dotenv
    "docusaurus-plugin-sass",
    [path.resolve(__dirname, './plugins/tsconfig-paths')],
    [path.resolve(__dirname, './plugins/babel-config')],
    [path.resolve(__dirname, './plugins/socket-io')],
    [path.resolve(__dirname, './plugins/dotenv')],
    [path.resolve(__dirname, './plugins/yaml-loader')],
  ],
}
