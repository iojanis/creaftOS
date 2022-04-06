/*
  Name: User-Module (User.js)
  Description: Handles User-related events and actions.
  Author: Janis Jendraß
 */
module.exports = function User () {
  const server = this
  server.onlinePlayers = []
  server.onlineCount = () => server.onlinePlayers.length

  server.io.on('connection', (client) => {
    client.on('create-user-account', (options) => {
      server.user.useToken(options, client)
    })
  })

  server.on('login', (event) => {
    server.user.setOnline(event)
    server.io.emit('player_joined', event.player)
    server.util.log({
      username: event.player,
      action: 'entered the game.',
      public: true,
      createdAt: new Date()
    })
    console.info(
      `[C/User]: ${event.player} entered the game at ${event.x} ${event.y} ${
        event.z
      } with IP: ${event.ip}`
    )
    // server.send(`tell ${event.player} sshh... they may hear you!`) RELICT_DO_NOT_DELETE
    server.onlinePlayers.push(event.player)
  })

  server.on('uuid', (event) => {
    console.log('todo: UUID check...')
  })

  server.on('teleported', (event) => {
    server.UserDb.findOneAndUpdate(
        { username: event.player },
        {
          $set: {
            joined_x: event.x,
            joined_y: event.y,
            joined_z: event.z,
          }
        },
        { new: true }
    )
  })

  server.on('quit', (event) => {
    server.util.log({
      username: event.player,
      action: 'left the game.',
      public: true,
      createdAt: new Date()
    })
    server.io.emit('player_left', event.player)
    console.info(`[C/User]: ${event.player} left the game`)
    server.user.setOffline(event.player)
    const index = server.onlinePlayers.indexOf(event.player)
    if (index > -1) {
      server.onlinePlayers.splice(index, 1)
    }
  })



  server.user = {
    setOnline (event) {
      server.UserDb.findOne({ username: event.player }).then((user) => {
        if (user) {
          const OnlineUserCount = server.UserDb.find({ online: true }).count()
          if (OnlineUserCount === 1) {
            server.util.setClock(0)
          }
          console.info('[C/User]: ' + event.player + ' is registered')
          if (user.user_version === 0) {
            console.info('[C/User]: ' + event.player + ' is still on user_version: 0 ... NOT YET IMPLEMENTED')
          }
          server.UserDb.findOneAndUpdate(
            { username: event.player },
            {
              $set: {
                online: true,
                joined_x: event.x,
                joined_y: event.y,
                joined_z: event.z,
                ip: event.ip
              }
            },
            { new: true }
          ).then((user) => {
            server.cmdTo('title', event.player, 'times 20 100 20')
            server.cmdTo(
              'title',
              event.player,
              'subtitle {"text":"' + 'Our World Is A Simulation' + '"}'
            )
            server.cmdTo(
              'title',
              event.player,
              'title {"text":"' + 'EnderNET' + '","color":"gold"}'
            )
            setTimeout(function () {
              server.zone.checkForZone(user.username)
              setTimeout(function () {
                server.util.actionbar(
                    event.player,
                    'Welcome back, ' + event.player,
                    'yellow'
                )
                setTimeout(function () {

                  server.util.actionbar(
                      event.player,
                      'Your balance in the bank: ' + (user.xp).toFixed(2) + '°',
                      'green'
                  )
                  setTimeout(function () {
                    server.util.actionbar(
                        event.player,
                        'The price on your head: ' + user.bounty + '°',
                        'green'
                    )
                  }, 3000)
                }, 3000)
              }, 3000)
            }, 1)
            // server.zone.checkForZone(user)
          })
        } else {
          console.info('[C/User]: ' + event.player + ' is not registered')
          server.user.createToken(event.player)
        }
      })
    },
    createToken (player) {
      server.TokenDb.findOne({ username: player, activation: false }).then(
        (user) => {
          if (user) {
            console.info(
              '[C/User]: ' + player + ' is still not registered (' + user.code + ')'
            )
            setTimeout(function () {
              server.cmdTo('title', player, 'times 20 1000 20')
              server.util.subtitle(
                user.username,
                "Here's your Token: " + user.code,
                'yellow'
              )
              server.send(
                'tell ' +
                  player +
                  " Here's your Token: " +
                  user.code +
                  ', again...'
              )
              server.send(
                'kick ' +
                  player +
                  ' Go to: EnderNET/join Token: ' +
                  user.code
              )
            }, 0 * 500)
            return true
          } else {
            server.user.preparePlayer(player)
            const code = Math.floor(Math.random() * (1 + 99999 - 11111))
            console.info(
              '[C/User]: ' + player + ' is new to EnderNET. His token is: ' + code
            )
            const newToken = server.TokenDb({
              username: player,
              code,
              activation: false
            })
            newToken.save()
            setTimeout(function () {
              server.user.welcomeNewbieMessage(player, code)
              server.send('tell ' + player + " Here's your Token: " + code)
              server.send(
                'tell ' +
                  player +
                  ' Go to EnderNET/join to create an account!'
              )
            }, 0 * 500)
          }
        }
      )
    },
    welcomeNewbieMessage (player, ticket) {
      setTimeout(function () {
        server.cmdTo('title', player, 'times 20 100 20')
        server.cmdTo(
          'title',
          player,
          'subtitle {"text":"' + 'Our World Is A Simulation' + '"}'
        )
        server.cmdTo(
          'title',
          player,
          'title {"text":"' + 'EnderNET' + '","color":"gold"}'
        )
        setTimeout(function () {
          server.cmdTo('title', player, 'times 20 200 20')
          server.cmdTo(
            'title',
            player,
            'subtitle {"text":"' + 'Follow the instructions to play...' + '"}'
          )
          server.cmdTo(
            'title',
            player,
            'title {"text":"' + 'Ticket: ' + ticket + '","color":"gold"}'
          )
          setTimeout(function () {
            server.cmdTo('title', player, 'times 20 200 20')
            server.cmdTo(
              'title',
              player,
              'subtitle {"text":"' + 'Visit EnderNET/Join to create an account.' + '"}'
            )
            server.cmdTo(
              'title',
              player,
              'title {"text":"' + 'Ticket: ' + ticket + '","color":"gold"}'
            )
            setTimeout(function () {
              server.cmdTo('title', player, 'times 20 200 20')
              server.cmdTo(
                'title',
                player,
                'subtitle {"text":"' + 'The instructions are also in the chat.' + '"}'
              )
              server.cmdTo(
                'title',
                player,
                'title {"text":"' + 'Ticket: ' + ticket + '","color":"gold"}'
              )
            }, 7000)
          }, 7000)
        }, 7000)
      }, 1)
    },
    useToken (options, client) {
      const code = parseInt(options.ticket)
      const password = options.password
      const passwordConfirm = options.passwordConfirm
      if (!code || !password || !passwordConfirm) {
        return
      }
      server.TokenDb.findOne({ code, activation: false }).then((user) => {
        if (password !== passwordConfirm) {
          server.io.to(client.id).emit('account-creation-failed', 'Password do not match...')
          return
        }
        if (user) {
          server.UserDb.create({
            username: user.username,
            password,
            email: user.username + '@lol.de',
            uuid: user.username,
            experience: 111,
            kills: 0,
            total_kills: 0,
            bounty: 0,
            teamed: false
          }).then((newUser) => {
            server.TokenDb.updateOne(
              { username: newUser.username },
              { $set: { activation: true } }
            ).then(() => {
              console.info('[C/User]: Token has been deactivated')
              console.info('[C/User]: ' + newUser.username + ' is now registered')
              server.send(
                'kick ' + newUser.username + ' Account created! Please reconnect... '
              )
              server.io.to(client.id).emit('account-created')
              server.user.prepareUserAccount(newUser.username)
            })
          })
        } else {
          server.io.to(client.id).emit('account-creation-failed', 'Ticket not valid!')
        }
      })
    },
    createDebugUser (username, email, password) {
      server.UserDb.create({
        username,
        email,
        password,
        experience: 111,
        kills: 0,
        total_kills: 0,
        bounty: 0,
        teamed: false
      }).then((newUser) => {
        console.info('[C/User]: ' + newUser.username + ' is now registered')
        server.send(
          'kick ' + newUser.username + ' Account created! Please reconnect... '
        )
        server.user.prepareUserAccount(newUser.username)
      }).catch((err) => {
        console.log(err)
      })
    },
    preparePlayer (username) {
      server.bounty.initBounty(username)
      // todo: Implement all command-executions here...
    },
    prepareUserAccount (username) {
      const prefix = '[C/User/prepareUserAccount]: '
      console.info(prefix + username + 'is going to be prepared.')
      console.info(prefix + 'get all Items from DataDB')
      server.DataDb.find({}).then((items) => {
        console.info(prefix + 'found ' + items.length + ' items in DataDB')
        items.forEach((item) => {
          server.ItemDb.findOne({ username, item: item.item }).then((exItem) => {
            if (exItem) {
              console.info(prefix + ' ' + item.item + ' found in ' + username + ' inventory not adding it again.')
            } else {
              server.ItemDb.create({
                username,
                item: item.item,
                name: item.name,
                amount: 0,
                market: false,
                price: 0
              }).then((newItem) => {
                console.info(prefix + ' ' + item.item + ' added to ' + username + ' inventory.')
              })
            }
          })
        })
      })
    },
    upgradeUserAccount (username) {
      const prefix = '[C/User/upgradeUserAccount]: '
      console.info(prefix + username + 'is going to be upgraded.')
      // todo: Research Upgrade
    },
    isOnline (player) {
      return server.onlinePlayers.includes(player)
    },
    setOffline (player) {
      server.UserDb.updateOne(
        { username: player },
        {
          $set: {
            online: false
          }
        }
      ).then(() => {
      })
    },
    isAdmin (player) {
      // todo: implement isAdmin in user-module
    },
    setAdmin (player) {
      // todo: implement setAdmin in user-module
    },
    setLatLong (player) {
      server.send('tp ' + player + ' ~ ~ ~')
    }
  }
}
