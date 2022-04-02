/*
  Name: Events-Module (Events.js)
  Description: Contains all the essential events used in other modules.
*/
module.exports = function Events () {
  const server = this

  server.on('console', (event) => {
    const stripped = event.match(/\]:\s<(§.)?([\w]+)(§.)?>\s(.*)/)
    if (stripped) {
      server.emit('chat', {
        player: stripped[2],
        color: stripped[1],
        message: stripped[4],
        timestamp: Date.now()
      })
    }
  })

  server.on('console', (event) => {
    const stripped = event.match(/]:(.*)/)
    if (stripped) {
      server.emit('terminal', {
        text: stripped[1]
      })
    }
  })

  server.on('console', (event) => {
    const stripped = event.match(
      /]:\s([\w]+)\[\/([.\d]+)[^(]+\(([-.\d]+),\s([-.\d]+),\s([-.\d]+)/
    )
    if (stripped) {
      server.emit('login', {
        player: stripped[1],
        ip: stripped[2],
        x: stripped[3],
        y: stripped[4],
        z: stripped[5],
        timestamp: Date.now()
      })
    }
  })

  server.on('console', (event) => {
    const stripped = event.match(
      /Teleported ([\w]+) to ([-.\d]+),\s([-.\d]+),\s([-.\d]+)/
    )
    if (stripped) {
      server.emit('teleported', {
        player: stripped[1],
        x: stripped[2],
        y: stripped[3],
        z: stripped[4],
        timestamp: Date.now()
      })
    }
  })

  server.on('console', (event) => {
    const stripped = event.match(/]:\sUUID\sof\splayer\s([\w]+)\sis\s([a-z0-9-]+)/)
    if (stripped) {
      server.emit('uuid', {
        player: stripped[1],
        uuid: stripped[2],
        timestamp: Date.now()
      })
    }
  })

  server.on('console', (event) => {
    const stripped = event.match(/]:\s([\w]+)[^{]+{text='([\w ]+)'/)
    if (stripped) {
      server.emit('logout', {
        player: stripped[1],
        reason: stripped[2],
        timestamp: Date.now()
      })
    }
  })

  server.on('console', (event) => {
    const stripped = event.match(/]:\s([\w]+)[^{]lost connection/)
    if (stripped) {
      server.emit('quit', {
        player: stripped[1],
        timestamp: Date.now()
      })
    }
  })

  server.on('console', (event) => {
    const stripped = event.match(/]:\sDone.+([\S]+)!.For/)
    if (stripped) {
      server.emit('done', {
        seconds: stripped[1],
        timestamp: Date.now()
      })
    }
  })

  server.on('console', (event) => {
    const stripped = event.match(/]:\s([\w]+)[^[]+\[([\w ]+)\]/)
    if (stripped) {
      server.emit('achievement', {
        player: stripped[1],
        achievement: stripped[2],
        timestamp: Date.now()
      })
    }
  })

  server.on('console', (event) => {
    const stripped = event.match(/Gave\s-([\w]+)\sexperience\slevels\sto\s([\w]+)/)
    if (stripped) {
      server.emit('taken', {
        player: stripped[2],
        amount: stripped[1],
        timestamp: Date.now()
      })
    }
  })

  server.on('console', (event) => {
    const stripped = event.match(
      /Removed\s([\w]+)\sitems\sfrom\splayer\s([\w]+)/
      // /Cleared\sthe\sinventory\sof\s([\w]+),\sremoving\s([\w]+)/
    )
    if (stripped) {
      server.emit('cleared', {
        amount: stripped[1],
        player: stripped[2],
        timestamp: Date.now()
      })
    }
  })

  server.on('console', (event) => {
    const stripped = event.match(/([\w]+).was.([\w]+).by.([\w]+)/)
    if (stripped) {
      server.emit('slain', {
        player: stripped[1],
        by: stripped[2],
        killer: stripped[3]
      })
    }
  })
}
