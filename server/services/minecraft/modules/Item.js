module.exports = function Item () {
  const server = this

  server.on('cleared', (event) => {
    const clearedAmount = parseInt(event.amount, 0)
    server.UserDb.findOne({ username: event.player }).then((dbUser) => {
      server.ItemDb.findOneAndUpdate(
        { username: dbUser.username, item: dbUser.last_item },
        { $inc: { amount: clearedAmount } },
        { new: true }
      ).then((item) => {
        server.item.updateItem(dbUser.username, item)
        server.event.genericNotification(event.player, 'UPLOADED ' + event.amount + ' ' + item.name, 'yellow')
      })
    })
  })

  server.io.on('connection', (client) => {
    client.on('download_item', (item, amount) => {
      server.item.removeItemsFromDb(
        server.socket.getUsernameFromId(client.id),
        amount,
        item
      )
    })
    client.on('upload_item', (item, amount) => {
      server.item.removeItemsFromGame(
        server.socket.getUsernameFromId(client.id),
        amount,
        item
      )
    })
  })

  server.item = {
    async getItemsFrom (username, filter) {
      const _filter = (filter === 0) ? { name: 1 } : { name: 0 }
      await server.ItemDb.find({ username }, _filter).sort().then(
        (items) => {
          if (items) {
            return items
          }
        }
      ).catch(
        (err) => {
          console.error(err)
        }
      )
    },
    initStockFor (username) {
      const _filter = {}
      server.ItemDb.find({ username }, _filter).then(
        (items) => {
          if (items) {
            server.io.to(username).emit('init_stock', items)
            console.info(
              '[C/Item]: ' + username + ' got all stock items from db.'
            )
          }
        }
      ).catch(
        (err) => {
          console.error(err)
        }
      )
    },
    removeItemsFromGame (username, amount, item) {
      if (!server.user.isOnline(username)) {
        return Promise.reject(new Error('not-online-ingame'))
      }
      server.ItemDb.findOne({ item }).then((remItem) => {
        server.UserDb.updateOne(
          { username },
          { $set: { last_item: item } }
        ).then(() => {
          server.send(
            'clear ' +
            username +
            ' minecraft:' +
            remItem.item +
            ' ' +
            amount
          )
        })
      })
    },
    removeItemsFromDb (username, amount, name) {
      if (!server.user.isOnline(username)) {
        return Promise.reject(new Error('not-online-ingame'))
      }
      server.ItemDb.findOne({
        item: name,
        username
      }).then((item) => {
        if (item.amount === 0) {
          return Promise.reject(new Error('not-enough-items'))
        }
        if (item && item.amount < amount) {
          amount = item.amount
        }
        if (item && item.amount >= amount) {
          server.ItemDb.findOneAndUpdate(
            { _id: item._id },
            { $inc: { amount: -amount } },
            { new: true }
          ).then((newItem) => {
            server.send(
              'give ' +
              username +
              ' minecraft:' +
              newItem.item +
              ' ' +
              amount
            )
            console.log(
              '[C/Item]: ' + username + ' downloaded ' + newItem.item + ' ' + amount + '.'
            )
            server.event.genericNotification(username, 'DOWNLOADED ' + amount + ' ' + newItem.name, 'yellow')
            server.item.updateItem(username, newItem)
          })
        }
      })
    },
    addItemsToGame (username, amount, item) {
      if (!server.user.isOnline(username)) {
        return Promise.reject(new Error('not-online-ingame'))
      }
      server.send('give ' + username + ' minecraft:' + item + ' ' + amount)
    },
    addItemsToDb (username, amount, item) {
      if (server.user.isOnline(username)) {
        server.ItemDb.findOne({ username, item })
          .then(
            (dataItem) => {
              server.ItemDb.updateOne(dataItem._id, { $inc: { amount } })
                .then((item) => {
                  server.item.updateItem(username, item)
                })
            }
          )
      }
    },
    updateItem (username, item, reverse = false) {
      console.log(JSON.stringify(item))
      server.io.to(username).emit('item_updated', item)
      if (item.market || !reverse) {
        server.io.emit('market_item_updated', item)
      }
    }
  }
}
