/*
  Name: Boot-Module (Boot.js)
  Description: Bootstraps the server and handles data-inserts / server-upgrades
               / server-management from the web / configurations and so on.
  Author: Janis Jendraß
 */
import fs from 'fs'
import https from 'https'
import axios from 'axios'

module.exports = function Boot() {
  const server = this
  const rawData = this.items

  server.on('version', (event) => {
    // todo: implement running server version & event
  })

  server.io.on('connection', (client) => {
    client.on('start-server', () => {
      // todo: implement start-server-socket-event
    })
    client.on('stop-server', () => {
      // todo: implement stop-server-socket-event
    })
    client.on('restart-server', () => {
      // todo: implement restart-server-socket-event
    })
    client.on('get-server-update', () => {
      // todo: implement get-server-update-socket-event
    })
    client.on('get-server-config', () => {
      // todo: implement get-server-config-socket-event
    })
    client.on('set-server-config', () => {
      // todo: implement set-server-config-socket-event
    })
    client.on('run-mapper', () => {
      server.boot.runMapper()
    })
    // todo: more socket events
  })

  const SampleConfig = {
    version: null,
    autoUpdate: false
  }

  server.boot = {
    run() {
      console.info('[C/Boot]: Bootstrapping...')
      // this.checkForOrCreateConfig()
      this.insertData()
      this.cleanDatabase()
      // const version = this.loadConfig('version')
      // if (version) server.version.running = version
      // this.getUpdate()
      // if (this.loadConfig('autoUpdate')) {
      //    this.updateServer()
      // } else {
      //    server.start()
      // }
      server.locked = false
      server.start()
    },
    runMapper() {
      this.mapper.start()
    },
    resetAtMidnight() {
      const now = new Date()
      const night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // the next day, ...
        0, 0, 0 // ...at 00:00:00 hours
      )
      const msToMidnight = night.getTime() - now.getTime()

      setTimeout(function () {
        this.runAtMidnight()
        this.resetAtMidnight()
      }, msToMidnight)
    },
    runAtMidnight() {
      server.stats.noteAllUsersExp()
    },
    getUpdate() {
      console.info('[C/Boot]: Get newest Minecraft-Server-Version...')
      axios
        .get('http://launchermeta.mojang.com/mc/game/version_manifest.json')
        .then((response) => {
          const version = response.data.latest.release
          console.info(
            '[C/Boot]: Newest Minecraft-Server-Release is version: ' + version
          )
          server.version.newest = version
        })
        .catch(function (error) {
          console.error(error)
        })
    },
    updateServer() {
      server.stop()
      console.info('[C/Boot]: Get newest Minecraft-Server-Version...')
      axios
        .get('http://launchermeta.mojang.com/mc/game/version_manifest.json')
        .then((response) => {
          const version = response.data.latest.release
          console.info(
            '[C/Boot]: Updating Minecraft-Server to Release-Version: ' + version
          )
          const serverUrl =
            'https://s3.amazonaws.com/Minecraft.Download/versions/' +
            version +
            '/minecraft_server.' +
            version +
            '.jar'
          const serverFile = fs.createWriteStream(
            server.config.options.server_path + '/server.jar'
          )
          https
            .get(serverUrl, (response) => {
              response.pipe(serverFile)
              console.info(
                '[C/Boot]: Minecraft-Server updated to version: ' + version
              )
              server.start()
            })
        })
        .catch(function (error) {
          console.error(
            '[C/Boot]: An error occured while updating the server.jar...'
          )
          console.error(error)
        })
    },
    insertData() {
      server.DataDb.find({}).then((result) => {
        if (result.length === 0) {
          console.info('[C/Boot]: DataDB is empty! Items will be inserted...')
          let count = 0
          rawData.forEach(function (item) {
            item.item = item.item.toLowerCase()
            const newData = new server.DataDb(item)
            newData.save()
            count++
          })
          console.info('[C/Boot]: ' + count + ' have been imported to DataDB.')
        }
      })
    },
    cleanDatabase() {
      server.UserDb.updateMany({}, { $set: { online: false } }).then(() => {
        console.info('[C/Boot]: All players have set to be offline')
      })
    },
    checkForOrCreateConfig() {
      const path = server.config.options.server_path + '/config.json'
      if (!fs.access(path)) {
        fs.writeFile(path, SampleConfig)
      }
    },
    loadConfig(attr) {
      return readJson(server.config.options.server_path + '/config.json')
        .then(data => attr ? data[attr] : data)
    },
    saveConfig(attr, value) {
      return readJson(server.config.options.server_path + '/config.json')
        .then((data) => {
          data[attr] = value
          return writeJson(server.config.options.server_path, data)
        })
    },
    loadMcConfig(prop) {
      // todo: implement server.properties loading
    },
    saveMcConfig(prop) {
      // todo: implement server.properties saving
    }
  }
}

function readJson(path) {
  return new Promise((resolve) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        resolve({})
      } else {
        resolve(JSON.parse(data))
      }
    })
  })
}

function writeJson(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, JSON.stringify(data, null, 4), (err) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

function readProp(path, prop) {
  // todo: implement server.properties reading
}

function writeProp(path, prop) {
  // todo: implement server.properties writing
}
