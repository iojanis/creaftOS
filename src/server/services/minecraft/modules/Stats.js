module.exports = function Stats () {
  const server = this
  /*
    StatsModule to keep track of Statistics.
   */

  server.io.on('connection', (client) => {
    client.on('some-event', (eventMessage) => {
      console.info('[C/Event]: some-event emitted over Socket.IO')
      // todo: some event actions
    })
  })

  server.stats = {
    noteItemPrice (item, price, amount) {
      console.info('[C/Stats]: ' + item + ' at price ' + ' ' + price)
      server.StatDb.create({ attribute: item, type: 'item', value: price, amount })
    },
    noteUserExp (user) {
      console.info('[C/Stats]: ' + user)
      // server.StatDb
      server.StatDb.create({ type: 'user', attribute: user.username, value: user.price })
    },
    noteAllUsersExp () {
      server.UserDb.find({}).then((users) => {
        users.forEach((user) => {
          this.noteUserExp(user)
        })
      })
    }
  }
}
