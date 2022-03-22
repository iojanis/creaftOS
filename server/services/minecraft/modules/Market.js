module.exports = function Market () {
  const server = this
  server.io.on('connection', (client) => {
    client.on('get_market_items', (item) => {
      server.market.getMarketItemStats(
        server.socket.getUsernameFromId(client.id),
        item
      )
    })
    client.on('get_market_item_stats_by', (filter) => {
      server.market.getMarketItemStats(
        server.socket.getUsernameFromId(client.id),
        filter
      )
    })
    client.on('get_market_items_from', (username, filter) => {
      server.market.getMarketItemsFrom(
        username,
        server.socket.getUsernameFromId(client.id),
        filter
      )
    })
    client.on('get_market_items_by', (item, filter) => {
      server.market.getMarketItemsBy(
        server.socket.getUsernameFromId(client.id),
        item,
        filter
      )
    })
    client.on('set_market_item', (item, amount, limit) => {
      server.market.setMarketItem(
        server.socket.getUsernameFromId(client.id),
        item,
        amount,
        limit
      )
    })
    client.on('buy_market_item', (item) => {
      server.market.buyMarketItem(
        server.socket.getUsernameFromId(client.id),
        item.seller,
        item.item,
        item.amount,
        item.price
      )
    })
  })
  server.market = {
    getMarketItemStats (username, item) {
      server.StatDb.find({ attribute: item })
        .then((items) => {
          if (items) {
            server.io.to(username).emit('receive_market_item_stats', items)
          }
        })
    },
    getRecentMarketItems (username, filter) {
      const _filter = {}
      server.ItemDb.find({ market: true }, _filter)
        .then((items) => {
          if (items) {
            server.io.to(username).emit('init_market', items)
            console.info(
              '[C/Item]: ' + username + ' got most recent market items from db.'
            )
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    getMarketItemsFrom (username, receiver, filter) {
      const _filter = {}
      server.ItemDb.find({ username, market: true }, _filter)
        .then((items) => {
          if (items) {
            server.io.to(receiver).emit('init_market', items)
            console.info(
              '[C/Item]: ' +
              receiver +
              ' got all market items by ' +
              username +
                ' from db.'
            )
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    getMarketItemsBy (username, item, filter) {
      const _filter = {}
      server.ItemDb.find({ item, market: true }, _filter)
        .then((items) => {
          if (items) {
            server.io.to(username).emit('init_market', items)
            console.info(
              '[C/Item]: ' +
              username +
              ' got all market items by ' +
              item +
                ' from db.'
            )
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    setMarketItem (username, name, amount, limit) {
      let price = 0
      if (amount) {
        const res = amount.replace(',', '.')
        price = parseFloat(res)
        console.log(name)
        console.log(amount)
        server.ItemDb.findOneAndUpdate(
          { item: name, username },
          { $set: { market: true, price, limit } },
          { new: true }
        ).then((item) => {
          server.item.updateItem(username, item)
        })
      } else {
        server.ItemDb.findOneAndUpdate(
          { item: name, username },
          { $set: { market: false } },
          { new: true }
        ).then((item) => {
          server.item.updateItem(username, item, false)
        })
      }
    },
    buyMarketItem (username, name, seller, amount, price) {
      console.log(`${username} buys ${amount} ${name} for ${price}`)
      server.UserDb.findOne({ username }).then((user) => {
        server.ItemDb.findOne({ item: name, username: seller }).then((item) => {
          console.log(item.username, item.amount, item.price, item.name)
          if (item.username === username) {
            return
          }
          if (item.price !== price) {
            return
          }
          if (item.amount === 0) {
            return
          }
          if (!item.market) {
            return
          }
          let _amount = amount
          let _price = amount * price
          const _limit = item.limit ? item.limit : 1
          if (item.amount < amount) {
            _amount = item.amount
            _price = _amount * price
          }
          if (item.amount < (_amount + _limit)) {
            _amount = item.amount - _limit
            _price = _amount * price
          }
          if (user.xp >= _price) {
            server.UserDb.findOneAndUpdate(
              { username },
              { $inc: { xp: -_price } },
              { new: true }
            ).then((user_) => {
              server.bank.updateXp(username, user_.xp)
            })
            server.UserDb.findOneAndUpdate(
              { username: seller },
              { $inc: { xp: _price } },
              { new: true }
            ).then((user_) => {
              server.bank.updateXp(seller, user_.xp)
            })
            server.ItemDb.findOneAndUpdate(
              { item: name, username: seller },
              { $inc: { amount: -_amount } },
              { new: true }
            ).then((item_) => {
              server.item.updateItem(seller, item_)
            })
            server.ItemDb.findOneAndUpdate(
              { item: name, username },
              { $inc: { amount: _amount } },
              { new: true }
            ).then((item_) => {
              server.item.updateItem(username, item_, true)
            })
            server.stats.noteItemPrice(name, price, amount)
          }
        })
      })
    }
  }
}
