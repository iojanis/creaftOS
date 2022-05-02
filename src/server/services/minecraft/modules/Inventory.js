/* eslint-disable no-console */
import { RconConnection } from '@scriptserver/core'
import { useUtil } from '@scriptserver/util'

module.exports = function Inventory () {
  const server = this // other Methods can be called using their name like: server.user.someMethod()
  /*
    Every module consists of server-events, socket-events and methods.
   */

  server.on('done', (event) => {
    server.inventory.createRcon()
  })

  server.on('chat', (event) => {
    server.inventory.getCurrentInventory(event.player)
  })

  server.io.on('connection', (client) => {
    client.on('get-inventory', (eventMessage) => {
      console.info('[C/NewModule]: get-inventory ' + server.socket.getUsernameFromId(client.id))
      server.inventory.getCurrentInventory(server.socket.getUsernameFromId(client.id))
    })
  })

  server.inventory = {
    /*
      Methods are always inside their own Object.
     */

    createRcon() {
      console.log('Creating Rcon Connection with pw:' + server.config.options.server_rcon_pw)
      server.rcon = new RconConnection({
        rconConnection: {
          port: 25575,
          password: server.config.options.server_rcon_pw.toString()
        },
      })

      useUtil(server.rcon)

      server.rcon.connect()
    },

    getCurrentInventory(username) {
      console.log('[C/Inventory]: getCurrentInventory')
      server.rcon.util.getEntityData(username, 'Inventory')
        .then((data) => {
          console.log('[C/Inventory]: getCurrentInventory: ' + data)
          server.io.to(username).emit('update_inventory', data)
        })
        .catch((err) => {
          console.error('[C/Inventory]: getCurrentInventory: ' + err)
        })
    },
  }
}
