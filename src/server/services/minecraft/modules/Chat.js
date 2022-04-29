module.exports = function Chat () {
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
      message: event.message, time: new Date()
    })
    server.chat.sendChatMessage(event.player, event.message)
    console.log(server.latestMessages)
  })

  server.io.on('connection',  (client) => {
    const latest = server.latestMessages
    const online = server.onlinePlayers
    client.emit('init_chat', { latest, online })
    client.on('send-chat-message', (message) => {
      console.log('received chat message')
      const player = server.socket.getUsernameFromId(client.id)
      if (player) {
        // if (process.env.OPENAI_API_KEY) server.bot.respondWithAI({ player, message })
        server.latestMessages.unshift({ player, message, time: new Date() })
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
    sendChatMessage (player, message) {
      server.io.emit('chat_message', { player, message, time: new Date() })
    }
  }
}
