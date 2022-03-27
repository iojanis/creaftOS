module.exports = function Bounty () {
  const server = this

  server.on('slain', (event) => {
    console.info(`[C/Bounty]: ${event.player} ${event.by} ${event.killer}.`)
    server.bounty.checkBounty(event.player, event.by, event.killer)
  })

  server.io.on('connection', (client) => {
    client.on('even-bounty', (amount) => {
      const floatAmount = parseFloat(amount)
      const player = server.socket.getUsernameFromId(client.id)
      server.UserDb.findOne({ username: player }).then((user) => {
        if (user.xp >= floatAmount) {
          server.bank.removeFromWeb(player, floatAmount)
          server.io
            .to(player)
            .emit('evened_out_bounty', (amount, player))
        } else {
          server.io
            .to(player)
            .emit('not_enough_money', amount)
        }
      })
    })
  })

  server.bounty = {
    initBounty (player) {
      if (!server.user.isOnline(player)) {
        console.error(`${player} is not Online (in-game)...`)
      }
      server.send(
        'scoreboard objectives add killCount playerKillCount'
      )
    },
    checkBounty (player, by, killer) {
      server.UserDb.findOne({ username: killer })
        .then((dbKiller) => {
          if (dbKiller) {
            const killCount = parseInt(dbKiller.total_kills) + 1
            server
              .send(
                `execute if score ${killer} killCount matches ${killCount}`,
                /Test passed/,
                /Test failed/
              )
              .then(() => {
                server.bounty.incKills(killer)
                server.UserDb.findOne({ username: player })
                  .then((dbPlayer) => {
                    if (dbPlayer.bounty > 0) {
                      server.bounty.payBounty(killer, dbPlayer.bounty)
                      server.bounty.unsetBounty(player)
                    } else {
                      server.bounty.setBounty(killer)
                    }
                  })
              })
              .catch(() => false)
          }
        })
    },
    setBounty (player) {
      server.UserDb.update({ username: player }, { $inc: { bounty: 11 } })
        .then(() => {
          console.info(`[C/Bounty]: ${player} bounty set!`)
          server.event.genericNotification(player, 'YOU GOT A BOUNTY ON YOUR HEAD', 'red')
        })
        .catch(() => {
          console.error(`[C/Bounty]: couldn't set bounty for ${player}!`)
        })
    },
    incKills (player) {
      server.UserDb.update({ username: player }, { $inc: { total_kills: 1 } })
        .then(() => {
          console.info(`[C/Bounty]: incremented total_kills for ${player}`)
          server.event.genericNotification(player, 'YOUR BOUNTY HAS INCREASED', 'red')
        })
        .catch(() => {
          console.error(`[C/Bounty]: couldn't increment total_kills for ${player}!`)
        })
    },
    payBounty (player, amount, killer) {
      server.bank.removeFromWeb(killer, amount)
      server.bank.addToWeb(player, amount)
      console.info(`[C/Bounty]: Gave ${player} ${amount}°.`)
      console.info(`[C/Bounty]: Removed ${killer} ${amount}°.`)
    },
    unsetBounty (player) {
      server.UserDb.update({ username: player }, { kills: 0, bounty: 0 })
        .then(() => {
          console.info(`[C/Bounty]: Set bounty and kills of ${player} to 0.`)
        })
        .catch(() => {
          console.error(`[C/Bounty]: couldn't set bounty and kills for ${player} to 0!`)
        })
    }
  }
}
