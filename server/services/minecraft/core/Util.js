/*
  Name: Util-Module (user.js)
  Description: Handles basic interactions and contains helper methods.
 */
module.exports = function Util () {
  const server = this
  let i = 0

  server.on('done', (event) => {
    server.util.clockWork()
    server.online = true
    console.info('[C/Util]: Minecraft-Server is now accepting connections') //
    server.util.event({
      server: 'was re-/started.',
      public: true,
      createdAt: new Date()
    })
  })

  server.on('terminal', (event) => {
    if (!event.text.includes('Set the time to')) {
      console.log(`[M]:${event.text}`)
      server.io.to('Iamdone').emit('message', event.text)
      server.util.event({
        server: event.text,
        public: false,
        createdAt: new Date()
      })
    }
  })

  server.on('exit', (event) => {
    console.log(event)
    server.util.event({
      server: 'closed for maintenance.',
      public: true,
      createdAt: new Date()
    })
  })

  server.util = {
    log (mongo) {
      // console.log(mongo)
    },

    event (mongo) {
      // console.log(mongo)
    },

    emit (event, args) {
      return server.io.emit(event, args)
    },

    title (target, text, color) {
      return server.send(
        `title ${target} {"text":"${text}","color":"${color}"}`
      )
    },

    subtitle (target, text, color) {
      return server.send(
        `subtitle ${target} {"text":"${text}","color":"${color}"}`
      )
    },

    actionbar (target, text, color) {
      return server.send(
        `title ${target} actionbar {"text":"${text}","color":"${color}"}`
      )
    },

    tellRaw (message, target, options) {
      return server.send(`tellraw ${target} ${JSON.stringify(options)}`)
    },

    clockWork () {
      function workLoop (time) {
        setTimeout(function () {
          server.send('time set ' + i)
          i++
          if (i > 14000) {
            workLoop(500)
          } else if (i > 24000) {
            i = 1
            workLoop(1000)
          } else if (i < 24000) {
            workLoop(1000)
          }
        }, time)
      }
      workLoop(1000)
    },

    setClock (time) {
      console.info('[C]: Set the clock to ' + time + '!')
      i = time
    }
  }
}
