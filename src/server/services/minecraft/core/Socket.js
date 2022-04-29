import { verify } from '../../jwt'

module.exports = function Socket () {
  const server = this
  server.linkedClients = []

  const capcon = require('capture-console')

  const stderr = capcon.captureStderr(function scope () {
    // whatever is done in here has stderr captured,
    // the return value is a string containing stderr
  })

  const stdout = capcon.captureStdout(function scope () {
    // whatever is done in here has stdout captured,
    // the return value is a string containing stdout
  })

  server.io.on('connection', (client) => {
    console.info('[S]: Client established connection: ' + client.id)

    client.on('auth', (message) => {
      const token = message.token
      if (message.user === undefined) { return }
      const user = message.user.toString()
      if (token !== 'false') {
        console.info('[S]: Client has token: ' + token + ' with name: ' + user)
        if (verify(token.split(' ')[1])) {
          client.join(user)
          server.socket.linkSocketId(client.id, token, user)
          server.UserDb.findOne({ username: user })
            .then((dbUser) => {
              server.io.to(user).emit('init_xp', { exp: dbUser.xp })
              server.io.to(user).emit('init_user', {
                isOnline: dbUser.online,
                username: user,
                bountyStatus: dbUser.bounty,
                currentTeam: dbUser.team
              })
              server.item.initStockFor(user)
              server.market.getRecentMarketItems(user)
            })
            .catch((error) => {
              console.error(error)
            })
        } else { console.info('[S]: Token invalid.') }
      } else { console.info('[S]: No Token.') }
    })

    client.on('disconnect', () => {
      console.log(
        '[S]: Client ' +
          server.socket.getUsernameFromId(client.id) +
          ' lost connection: ' +
          client.id
      )
      server.socket.unlinkSocketId(client.id)
    })
  })

  server.socket = {
    linkSocketId (id, token, username) {
      for (let i = 0; i < server.linkedClients.length; i++) {
        if (server.linkedClients[i].id === id) {
          server.linkedClients.splice(i, 1)
        }
      }
      const SocketUser = {
        username,
        token,
        id
      }
      server.linkedClients.push(SocketUser)
      server.socket.getAllLinkedSocketIds()
    },
    unlinkSocketId (id) {
      for (let i = 0; i < server.linkedClients.length; i++) {
        if (server.linkedClients[i].id === id) {
          server.linkedClients.splice(i, 1)
        }
      }
      server.socket.getAllLinkedSocketIds()
    },
    getAllLinkedSocketIds () {
      server.linkedClients.forEach((client) => {
        console.log(client)
      })
    },
    getIdFromUsername (username) {
      for (let i = 0; i < server.linkedClients.length; i++) {
        if (server.linkedClients[i].username === username) {
          return server.linkedClients[i].id
        }
      }
    },
    getTokenFromUsername (username) {
      for (let i = 0; i < server.linkedClients.length; i++) {
        if (server.linkedClients[i].username === username) {
          return server.linkedClients[i].id
        }
      }
    },
    getUsernameFromId (id) {
      for (let i = 0; i < server.linkedClients.length; i++) {
        if (server.linkedClients[i].id === id) {
          return server.linkedClients[i].username
        }
      }
    }
  }
}
