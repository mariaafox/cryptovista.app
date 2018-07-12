/**
 * Setup and run the development server for Hot-Module-Replacement
 * https://webpack.github.io/docs/hot-module-replacement-with-webpack.html
 */

const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const childProcess = require('child_process')
const config = require('./webpack.config')

const argv = require('minimist')(process.argv.slice(2))
const logger = console

const app = express()
const compiler = webpack(config)
const PORT = process.env.PORT || 3002

const wdm = webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  hot: true,
  stats: {
    colors: true
  }
})

app.use(wdm)

app.use(webpackHotMiddleware(compiler))

const server = app.listen(PORT, 'localhost', (serverError) => {
  if (serverError) {
    return console.error(serverError)
  }
  logger.log(`Listening at http://localhost:${PORT}`)
})

process.on('SIGTERM', () => {
  logger.log('Stopping dev server')
  wdm.close()
  server.close(() => {
    process.exit(0)
  })
})
