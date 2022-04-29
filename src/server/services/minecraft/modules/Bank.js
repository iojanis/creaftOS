module.exports = function Bank () {
  const server = this
  server.on('taken', (event) => {
    console.log(
      `[C/Bank]: ${event.player} uploaded ${event.amount} experience.`
    )
    server.bank.addToWeb(event.player, event.amount)
    server.event.genericNotification(event.player, 'DEPOSITED 11°', 'green')
  })
  server.io.on('connection', (client) => {
    client.on('download_exp', () => {
      server.bank.withdraw(server.socket.getUsernameFromId(client.id), 11)
    })
    client.on('upload_exp', () => {
      server.bank.deposit(server.socket.getUsernameFromId(client.id), 11)
    })
    client.on('transfer_exp', (receiver, amount) => {
      console.log(server.socket.getUsernameFromId(client.id))
      server.bank.transaction(
        server.socket.getUsernameFromId(client.id),
        amount,
        receiver
      )
    })
  })
  server.bank = {
    async getCurrentExp (username) {
      await server.UserDb.findOne({ username })
        .then((user) => {
          const xp = user.xp
          return xp
        })
        .catch((error) => {
          console.error(error)
        })
    },
    takeFromGame (player, amount) {
      if (!player || !amount) {
        return Promise.reject(
          new Error('api.takeFromGame: no-player-and-or-amount')
        )
      }
      if (!server.user.isOnline(player)) {
        return
      }

      if (parseFloat(amount) >= 11) {
        return server
          .send(
            'xp add @a[level=' +
              parseFloat(amount) +
              '..,name=' +
              player +
              ']' +
              ' -' +
              parseFloat(amount) +
              ' levels',
            /Given\s([\w]+)/,
            /found\snothing/
          )
          .then(() => true)
          .catch(() => false)
      }
    },
    withdraw (player, amount) {
      if (!player || !amount) {
        return Promise.reject(
          new Error('api.withdraw: no-player-and-or-amount')
        )
      }
      if (!server.user.isOnline(player)) {
        return
      }

      server.UserDb.findOne({ username: player }).then((user) => {
        if (user && user.xp >= amount) {
          server.bank.removeFromWeb(player, amount)
          server.bank.addToGame(player, amount)
          server.io.to(player).emit('bank_withdrew', amount)
          server.event.genericNotification(player, 'WITHDREW 11°', 'green')
        }
      })
    },
    deposit (player, amount) {
      if (!player || !amount) {
        return Promise.reject(
          new Error('api.takeFromGame: no-player-and-or-amount')
        )
      }
      if (!server.user.isOnline(player)) {
        return
      }

      server.bank.takeFromGame(player, amount).then(() => {
        server.io.to(player).emit('bank_deposited', amount)
      })
    },
    transaction (sender, amount, receiver) {
      const floatAmount = parseFloat(amount)
      server.UserDb.findOne({ username: sender })
        .then((user) => {
          if (user.xp >= floatAmount) {
            server.bank.removeFromWeb(sender, floatAmount)
            server.bank.addToWeb(receiver, floatAmount)
            server.io
              .to(sender)
              .emit('bank_made_transaction', (amount, receiver))
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    removeFromWeb (player, amount) {
      return server.UserDb.updateOne(
        { username: player },
        { $inc: { xp: -parseFloat(amount) } }
      ).then(() => {
        server.io.to(player).emit('bank_removed_from_web', amount)
        server.bank.updateXpDb(player)
      })
    },
    addToWeb (player, amount) {
      return server.UserDb.updateOne(
        { username: player },
        { $inc: { xp: parseFloat(amount) } }
      )
        .then(() => {
          server.io.to(player).emit('bank_added_to_web', amount)
          server.bank.updateXpDb(player)
        })
        .catch((err) => {
          console.error(err)
        })
    },
    addToGame (player, amount) {
      if (!server.user.isOnline(player)) {
        return
      }
      server.send('xp add ' + player + ' ' + parseFloat(amount) + ' levels').then(() => {
        server.io.to(player).emit('bank_added_to_game', amount)
      })
    },
    updateXp (player, exp) {
      server.io.to(player).emit('update_xp', { xp: exp })
    },
    updateXpDb (player) {
      server.UserDb.findOne({ username: player }).then((dbUser) => {
        server.io.to(dbUser.username).emit('update_xp', { xp: dbUser.xp })
        console.info(
          '[C/Bank]: Sent xp update to ' + dbUser.username + ' XP:' + dbUser.xp
        )
      })
    }
  }
}
