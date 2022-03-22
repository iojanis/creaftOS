import EventsEmitter from 'events'
import { spawn } from 'child_process'
import MapCrafter from '../mapcrafter'

class Minecraft extends EventsEmitter {
  constructor (config, io) {
    super()
    console.info('[C]: Minecraft-Server-Creator (Creaft) has been created')
    this.io = io
    this.config = config
    this.online = false
    this.locked = true
    this.version = {
      running: undefined,
      newest: undefined
    }
    this.mapper = new MapCrafter(this.config.options.mapcrafter_path, this.config.options.mapcrafter_config_path)
    this.setMaxListeners(50)
    this.modules = []
    this.load('Core-Modules', '/core')
    this.load('Gameplay-Modules', '/modules')
    console.info('[C]: Minecraft-Server-Creator (Creaft) has been initialized')
    this.boot.run()
  }

  sanityCheck () {
    console.info('[C]: SanityCheck...')
  }

  load (what, where) {
    const that = this
    console.info('[C]: Loading ' + what + '...')
    require('fs')
      .readdirSync(__dirname + where)
      .forEach(function (file) {
        if (file.match(/\.js$/) !== null && file !== 'index.js') {
          const module = require('.' + where + '/' + file)
          that.use(module)
        }
      })
  }

  use (module) {
    if (this.modules.filter(m => m === module).length === 0) {
      this.modules.push(module)
      module.call(this)
      console.info('[C]: Module loaded: ' + module.name)
    }
  }

  start (jar = 'server.jar', args = ['-Xmx' + this.config.options.server_ram + 'M']) {
    if (this.locked) {
      console.error('Server is locked! Cannot start Minecraft-Server')
      return new Error('server-locked')
    }
    args.push('-jar', jar, 'nogui')
    this.spawn = spawn('java', args, { cwd: this.config.options.server_path })
    console.info(
      '[C]: Minecraft-Server-Path is: ' + this.config.options.server_path
    )
    console.info('[C]: Minecraft-Server has been spawned')
    process.stdin.on('data', (l) => {
      if (this.spawn && this.online) { this.spawn.stdin.write(l) }
    })
    this.spawn.stdout.on('data', (l) => {
      l.toString()
        .split('\n')
        .forEach((c) => {
          if (c) { this.emit('console', c) }
        })
    })
    process.on('exit', () => {
      this.stop()
    })
    process.on('close', () => {
      this.stop()
    })
  }

  send (command, successRegex, failRegex) {
    return new Promise((resolve, reject) => {
      if (!this.spawn) { return reject(new Error('Server not started')) }
      this.spawn.stdin.write(`${command}\n`)
      if (!successRegex) { resolve() } else {
        const temp = (event) => {
          const success = event.match(successRegex)
          if (success) {
            resolve(success)
            this.removeListener('console', temp)
          } else if (failRegex) {
            const fail = event.match(failRegex)
            if (fail) {
              reject(fail)
              this.removeListener('console', temp)
            }
          }
        }
        this.on('console', temp)
        setTimeout(() => {
          reject(new Error('Timed out'))
          this.removeListener('console', temp)
        }, 2000)
      }
    })
  }

  cmdTo (command, target, args) {
    return this.send(`${command} ${target} ${args}`)
  }

  wait (time = 1, obj) {
    setTimeout(() => obj, time * 100)
  }

  stop () {
    if (this.spawn) {
      this.spawn.kill()
      this.spawn = null
      console.info('[C]: Minecraft-Server has been destroyed')
    }
  }
}

export default Minecraft
