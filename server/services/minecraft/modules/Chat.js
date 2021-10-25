module.exports = function Chat() {
  const server = this
  server.latestMessages = []

  server.on('chat', (event) => {
    console.log(`[C/Chat]: ${event.player}:  ${event.message}`)
    server.util.log({
      username: event.player,
      action: event.message,
      public: true,
      createdAt: new Date()
    })
    server.latestMessages.unshift({
      player: event.player,
      message: event.message
    })
    server.chat.sendChatMessage(event.player, event.message)
    console.log(server.latestMessages)
  })

  server.io.on('connection', (client) => {
    const latest = server.latestMessages
    const online = server.onlinePlayers
    client.emit('init_chat', { latest, online })
    client.on('send-chat-message', (message) => {
      console.log('received chat message')
      const player = server.socket.getUsernameFromId(client.id)
      console.log(player)
      if (player) {
        server.latestMessages.unshift({ player: player, message: message })
        server.chat.sendChatMessage(player, message)
        server.send(
          'tellraw @a ["",{"text":"[' +
            player +
            '] ' +
            message +
            '","bold":false}]'
        )
      } else {
        console.log('no open socket found')
      }
    })
  })

  server.chat = {
    sendChatMessage(player, message) {
      server.io.emit('chat_message', { player, message })
    }
  }
}
