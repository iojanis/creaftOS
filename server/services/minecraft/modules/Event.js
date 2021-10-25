module.exports = function Event() {
  const server = this
  /*
    EventModule for Notification-Handling.
   */

  server.io.on('connection', (client) => {
    client.on('authenticated', () => {})
  })

  server.event = {
    genericNotification(player, message, color) {
      notifyGame(player, message, color)
    },
    notifyMention(username, sender) {
      console.info('[C/Event]: ' + sender + ' mentioned ' + ' ' + username)
      server.io.to(username).emit('mentioned_by', sender)
    },
    notifyTransaction(username, item, amount, buyer) {
      notifyGame()
      notifyWeb()
    },
    notifyTransfer(username, amount, sender) {},
    notifyKill(username, killer) {},
    notifyTeamChange(username) {},
    notifyNewProperty(zone) {},
    notifyNewComment(book) {},
    otherMethod(ZoneSlug, PlayerName) {
      // todo: some other actions
      server.ZoneDb.findOne({ slug: ZoneSlug }) // databases look like: UserDb, ZoneDb etc.
        .then((zone) => {
          console.info(zone)
        })
    }
  }

  function notifyGame(player, message, color = 'yellow') {
    server.util.actionbar(
      player,
      message,
      color
    )
  }

  function notifyWeb() {}
}
