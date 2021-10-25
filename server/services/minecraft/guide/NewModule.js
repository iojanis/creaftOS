/* eslint-disable no-console */

module.exports = function NewModule() {
  const server = this // other Methods can be called using their name like: server.user.someMethod()

  /*
    Every module consists of server-events, socket-events and methods.
   */

  server.on('chat', () => {
    // available events can be found in core/events
    console.info('[C/NewModule]: Server emitted "done"')
    // todo: some event actions
  })

  server.io.on('connection', (client) => {
    client.on('some-event', (eventMessage) => {
      console.info('[C/NewModule]: some-event emitted over Socket.IO: ' + eventMessage)
      // todo: some event actions
    })
  })

  server.NewModule = {
    /*
      Methods are always inside their own Object.
     */

    newMethod(username, message) {
      // todo: some actions
      server.io.to(username).emit('method_action_over_io', message) // socket-events can be sent to a username
    },
    otherMethod(ZoneSlug, PlayerName) {
      // todo: some other actions
      server.ZoneDb.findOne({ slug: ZoneSlug }) // databases look like: UserDb, ZoneDb etc.
        .then((zone) => {
          console.info(zone)
        })
    }
  }
}
