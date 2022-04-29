import EventsEmitter from 'events'
import { spawn } from 'child_process'
import fs from 'fs'

class MapCrafter extends EventsEmitter {
  constructor (procPath, confPath) {
    super()
    this._procPath = procPath
    this._confPath = confPath
    this.finished = false
    this.setMaxListeners(50)
    console.info('[C/MapCrafter]: Mapper has been initialized')
  }

  start (proc = 'mapcrafter', args = ['-c ' + this._confPath]) {
    try {
      if (fs.existsSync(this._confPath)) {
        this.spawn = spawn(proc, args, { cwd: this._procPath })
        console.info('[C/MapCrafter]: Mapper path is: ' + this._procPath)
        console.info('[C/MapCrafter]: Mapper will start mapping')
        process.stdin.on('data', (l) => {
          if (this.spawn) { this.spawn.stdin.write(l) }
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
          this.finished = true
          console.info('[C/MapCrafter]: Mapper has been finished')
        })
        process.on('close', () => {
          this.stop()
          console.info('[C/MapCrafter]: Mapper has been destroyed')
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  stop () {
    if (this.spawn) {
      this.spawn.kill()
      this.spawn = null
    }
  }
}

export default MapCrafter
