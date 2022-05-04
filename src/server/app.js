/* eslint-disable no-console */
// import slowDown from 'express-slow-down'
import betterLogging from 'better-logging'
// eslint-disable-next-line import/named,no-unused-vars
import { env, mongo, port, ip, apiRoot } from './config'
import mongoose from './services/mongoose'
import express from './services/express'
import api from './api'

import Minecraft from './services/minecraft'

const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')

const config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

betterLogging(console)

const app = express(apiRoot, api)

async function start () {
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 4000
  } = nuxt.options.server

  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  const server = require('http').createServer(app)
  const io = require('socket.io')(server)

  app.use(nuxt.render)

  mongoose
    .connect(
      mongo.uri,
      { useNewUrlParser: true }
    )
    .then(() => {})
    .catch((error) => {
      console.log(error)
    })

  mongoose.Promise = Promise
  mongoose.set('debug', config.dev)
  // mongoose.set('useCreateIndex', true)

  server.listen(port, host)
  consola.ready({
    message: `[EX]: Server listening on http://${host}:${port}`,
    badge: true
  })

  const settings = {
    options: {
      server_path: process.env.SERVER_PATH || '/root/minecraft-server',
      server_ram: process.env.SERVER_RAM || 4096,
      server_locked: process.env.SERVER_LOCKED || false,
      game_debug: process.env.GAME_DEBUG || true,
      server_host: process.env.SERVER_HOST || '0.0.0.0',
      server_rcon_pw: process.env.SERVER_RCON_PW || 'password',
      server_name: process.env.SERVER_NAME || 'creaftOS',
      server_modt: process.env.SERVER_MODT || 'Our World is a Simulation',
      mapcrafter_path: process.env.MAPCRAFTER_PATH || '/root/mapcrafter',
      mapcrafter_config_path: process.env.MAPCRAFTER_CONFIG_PATH || '/root/mapcrafter/config.json'
    }
  }

  // const Creaft = new Minecraft(settings, io)
  //
  // // auto restart server
  // Creaft.on('exit', () => {
  //   consola.info('[EX]: Server closed')
  //   Creaft.stop()
  //   Creaft.start()
  // })
  //
  // Creaft.sanityCheck()
}

start().then()

export default app
