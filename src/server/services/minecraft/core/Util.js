/*
  Name: Util-Module (user.js)
  Description: Handles basic interactions and contains helper methods.
 */
import { RconConnection } from '@scriptserver/core'

module.exports = function Util () {
  const server = this
  let i = 0

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

    createClockWorkRcon() {
      server.clockrcon = new RconConnection({
        rconConnection: {
          port: 25575,
          password: 'lolparty12378',
        },
      })

      server.clockrcon.connect()
    },

    clockWork () {
      function workLoop (time) {
        setTimeout(function () {
          server.clockrcon.send('time set ' + i).then(r => {})
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
    },

    prepareGamerules () {
      server.send('gamerule doDaylightCycle false')
      // server.send('gamerule doMobLoot false')
    }
  }
}
