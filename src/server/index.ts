/*
 * embed webpack-dev-server
 */
let webpack, webpackDevMiddleware, webpackHotMiddleware, webpackConfig
if (process.env.NODE_ENV !== 'production') {
    webpack = require('webpack')
    webpackDevMiddleware = require('webpack-dev-middleware')
    webpackConfig = require('../../webpack.config')
    webpackHotMiddleware = require('webpack-hot-middleware')
}

import { Server } from 'colyseus'
import http from 'http'
import express from 'express'
import path from 'path'
import basicAuth from 'express-basic-auth'
import socialRoutes from '@colyseus/social/express'
import { monitor } from '@colyseus/monitor'

// import { WaveRunnerRoom } from '../network/rooms/waverunnerroom/WaveRunnerRoom'
import { PVPRoom } from '../network/rooms/pvproom/PVPRoom'

export const port = Number(process.env.PORT || 8080)
export const endpoint = 'localhost'

export let STATIC_DIR: string

const app = express()
const gameServer = new Server({
  server: http.createServer(app),
  express: app
})

gameServer.define('GameRoom', PVPRoom)

if (process.env.NODE_ENV !== 'production') {
    const webpackCompiler = webpack(webpackConfig({}))
    app.use(webpackDevMiddleware(webpackCompiler, {}))
    app.use(webpackHotMiddleware(webpackCompiler))

    // on development, use '../../' as static root
    STATIC_DIR = path.resolve(__dirname, '..', '..')

} else {
    // on production, use ./public as static root
    STATIC_DIR = path.resolve(__dirname, 'public')
}

app.use('/', express.static(STATIC_DIR))

// @colyseus/social routes
app.use('/', socialRoutes)

// add colyseus monitor
const auth = basicAuth({ users: { 'admin': 'admin' }, challenge: true })
app.use('/colyseus', auth, monitor())

gameServer.listen(port)
console.log(`Listening on http://${endpoint}:${port}`)
