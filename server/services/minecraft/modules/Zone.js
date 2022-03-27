module.exports = function Zone () {
  const server = this
  const getSlug = require('speakingurl')

  server.io.on('connection', (client) => {
    client.on('create_zone', (options) => {
      server.zone.createZone(
        server.socket.getUsernameFromId(client.id),
        options
      )
    })
    client.on('update_zone', (options) => {
      server.zone.updateZone(
        server.socket.getUsernameFromId(client.id),
        options
      )
    })
    client.on('remove_zone', (options) => {
      server.zone.removeZone(
        server.socket.getUsernameFromId(client.id),
        options
      )
    })
    client.on('tp_to_zone', (zone) => {
      server.zone.tpToZone(server.socket.getUsernameFromId(client.id), zone)
    })
  })

  server.zone = {
    checkForZone (player) {
      server.UserDb.findOne({ username: player }).then((user) => {
        if (user.online) {
          const cx = Math.round(user.joined_x)
          const cz = Math.round(user.joined_z)
          // eslint-disable-next-line no-unused-vars
          const cy = Math.round(user.joined_y)
          const ox = Math.round(cx - 127)
          const oz = Math.round(cz - 127)
          const nx = Math.round(cx + 129)
          const nz = Math.round(cz - 127)
          const mx = Math.round(cx - 127)
          const mz = Math.round(cz + 129)
          const dx = Math.round(cx + 129)
          const dz = Math.round(cz + 129)

          // eslint-disable-next-line no-unused-vars
          const oy = 0
          // eslint-disable-next-line no-unused-vars
          const ny = 0
          // eslint-disable-next-line no-unused-vars
          const my = 0

          const filter = {
            $or: [
              {
                $and: [
                  { p1: { $lte: cx } },
                  { p2: { $lte: cz } },
                  { p3: { $gte: cx } },
                  { p4: { $gte: cz } }
                ]
              },
              {
                $and: [
                  { p1: { $lte: ox } },
                  { p2: { $lte: oz } },
                  { p3: { $gte: ox } },
                  { p4: { $gte: oz } }
                ]
              },
              {
                $and: [
                  { p1: { $lte: dx } },
                  { p2: { $lte: dz } },
                  { p3: { $gte: dx } },
                  { p4: { $gte: dz } }
                ]
              },
              {
                $and: [
                  { p1: { $lte: mx } },
                  { p2: { $lte: mz } },
                  { p3: { $gte: mx } },
                  { p4: { $gte: mz } }
                ]
              },
              {
                $and: [
                  { p1: { $lte: nx } },
                  { p2: { $lte: nz } },
                  { p3: { $gte: nx } },
                  { p4: { $gte: nz } }
                ]
              }
            ]
          }

          server.ZoneDb.findOne(filter).then((zone) => {
            console.log(zone)
            if (zone && zone.username === player) {
              server.util.actionbar(
                player,
                'You\'re in a friendly Zone!',
                'green'
              )
              server.send('gamemode survival ' + player)
              server.send(
                'tellraw ' +
                player +
                ' ["",{"text":"[' +
                zone.name +
                '] nearby: ","bold":true,"clickEvent":{"action":"open_url","value":"https://rea.lity.cc/map/' +
                zone.slug +
                '"},"hoverEvent":{"action":"show_text","value":{"text":"","extra":[{"text":"EnderNET"}]}}},{"text":"X ","color":"red","bold":true},{"text":"' +
                zone.pcenter[0] +
                '","bold":true,"italic":true,"color":"none"},{"text":" Y ","color":"green","bold":true,"italic":false},{"text":"' +
                  zone.pcenter[1] +
                  '","bold":true,"italic":true,"color":"none"},{"text":" Z","color":"dark_blue","bold":true,"italic":false},{"text":" ' +
                  zone.pcenter[2] +
                  '","bold":true,"italic":true,"color":"none"}]'
              )
            } else if (zone) {
              server.util.actionbar(
                player,
                'You\'re in/near a foreign Zone!',
                'yellow'
              )
              server.send(
                'tellraw ' +
                  player +
                  ' ["",{"text":"[' +
                  zone.name +
                '] nearby: ","bold":true,"clickEvent":{"action":"open_url","value":"https://rea.lity.cc/map/' +
                zone.slug +
                '"},"hoverEvent":{"action":"show_text","value":{"text":"","extra":[{"text":"EnderNET"}]}}},{"text":"X ","color":"red","bold":true},{"text":"' +
                zone.pcenter[0] +
                '","bold":true,"italic":true,"color":"none"},{"text":" Y ","color":"green","bold":true,"italic":false},{"text":"' +
                zone.pcenter[1] +
                '","bold":true,"italic":true,"color":"none"},{"text":" Z","color":"dark_blue","bold":true,"italic":false},{"text":" ' +
                zone.pcenter[2] +
                '","bold":true,"italic":true,"color":"none"}]'
              )
            } else {
              server.UserDb.findOne({ username: player }).then((user) => {
                server.util.actionbar(player, 'You\'re in a free Zone!', 'blue')
                server.send('gamemode survival ' + player)
                server.send(
                  'tellraw ' +
                  player +
                  ' ["",{"text":"Free Zone: ","bold":true,"clickEvent":{"action":"open_url","value":"https://rea.lity.cc/map"},"hoverEvent":{"action":"show_text","value":{"text":"","extra":[{"text":"Creaft.NET"}]}}},{"text":"X ","color":"red","bold":true},{"text":"' +
                  parseInt(user.joined_x) +
                  '","bold":true,"italic":true,"color":"none"},{"text":" Y ","color":"green","bold":true,"italic":false},{"text":"' +
                  parseInt(user.joined_y) +
                  '","bold":true,"italic":true,"color":"none"},{"text":" Z","color":"dark_blue","bold":true,"italic":false},{"text":" ' +
                  parseInt(user.joined_z) +
                  '","bold":true,"italic":true,"color":"none"}]'
                )
              })
            }
          })
        }
        return false
      })
    },

    createZone (player, name) {
      server.UserDb.findOne({ username: player }).then((user) => {
        if (user.online) {
          const cx = Math.round(user.joined_x)
          const cz = Math.round(user.joined_z)
          const cy = Math.round(user.joined_y)
          const ox = Math.round(cx - 127)
          const oz = Math.round(cz - 127)
          const nx = Math.round(cx + 129)
          const nz = Math.round(cz - 127)
          const mx = Math.round(cx - 127)
          const mz = Math.round(cz + 129)
          const dx = Math.round(cx + 129)
          const dz = Math.round(cz + 129)

          const oy = 0
          const ny = 0
          const my = 0

          const filter = {
            $or: [
              {
                $and: [
                  { p1: { $lte: cx } },
                  { p2: { $lte: cz } },
                  { p3: { $gte: cx } },
                  { p4: { $gte: cz } }
                ]
              },
              {
                $and: [
                  { p1: { $lte: ox } },
                  { p2: { $lte: oz } },
                  { p3: { $gte: ox } },
                  { p4: { $gte: oz } }
                ]
              },
              {
                $and: [
                  { p1: { $lte: dx } },
                  { p2: { $lte: dz } },
                  { p3: { $gte: dx } },
                  { p4: { $gte: dz } }
                ]
              },
              {
                $and: [
                  { p1: { $lte: mx } },
                  { p2: { $lte: mz } },
                  { p3: { $gte: mx } },
                  { p4: { $gte: mz } }
                ]
              },
              {
                $and: [
                  { p1: { $lte: nx } },
                  { p2: { $lte: nz } },
                  { p3: { $gte: nx } },
                  { p4: { $gte: nz } }
                ]
              }
            ]
          }

          server.ZoneDb.findOne(filter).then((zone) => {
            const implemented = true
            if (zone && zone.username === player) {
              server.util.actionbar(
                player,
                'You\'re in a friendly Zone!',
                'green'
              )
              server.send('gamemode survival ' + player)
              server.send(
                'tellraw ' +
                player +
                ' ["",{"text":"[' +
                zone.name +
                '] nearby: ","bold":true,"clickEvent":{"action":"open_url","value":"https://rea.lity.cc/map/' +
                zone.slug +
                '"},"hoverEvent":{"action":"show_text","value":{"text":"","extra":[{"text":"EnderNET"}]}}},{"text":"X ","color":"red","bold":true},{"text":"' +
                zone.pcenter[0] +
                '","bold":true,"italic":true,"color":"none"},{"text":" Y ","color":"green","bold":true,"italic":false},{"text":"' +
                  zone.pcenter[1] +
                  '","bold":true,"italic":true,"color":"none"},{"text":" Z","color":"dark_blue","bold":true,"italic":false},{"text":" ' +
                  zone.pcenter[2] +
                  '","bold":true,"italic":true,"color":"none"}]'
              )
            } else if (zone) {
              server.util.actionbar(
                player,
                'You\'re in a foreign Zone!',
                'yellow'
              )
              server.send(
                'tellraw ' +
                  player +
                  ' ["",{"text":"[' +
                  zone.name +
                  '] nearby: ","bold":true,"clickEvent":{"action":"open_url","value":"https://rea.lity.cc/map/' +
                  zone.slug +
                  '"},"hoverEvent":{"action":"show_text","value":{"text":"","extra":[{"text":"EnderNET"}]}}},{"text":"X ","color":"red","bold":true},{"text":"' +
                  zone.pcenter[0] +
                  '","bold":true,"italic":true,"color":"none"},{"text":" Y ","color":"green","bold":true,"italic":false},{"text":"' +
                  zone.pcenter[1] +
                  '","bold":true,"italic":true,"color":"none"},{"text":" Z","color":"dark_blue","bold":true,"italic":false},{"text":" ' +
                  zone.pcenter[2] +
                  '","bold":true,"italic":true,"color":"none"}]'
              )
            } else if (implemented) {
              server.UserDb.findOne({ username: player }).then((user) => {
                server.util.actionbar(player, 'You\'re in a free Zone!', 'blue')

                const owner = 'team=' + user.team
                const notowner = 'team=!' + user.team

                server.ZoneDb.create({
                  cx,
                  cy,
                  cz,
                  ox,
                  oz,
                  dx,
                  dz,
                  mx,
                  mz,
                  nx,
                  nz,
                  username: user.username,
                  name,
                  slug: getSlug(name),
                  team: user.team,
                  p1: [nx, nz],
                  p2: [ox, oz],
                  p3: [mx, mz],
                  p4: [dx, dz],
                  pcenter: [cx, cy, cz]
                }).then(() => {

                })

                setTimeout(function () {
                  // SET CB(Gamemode 0 for OWNER)
                  server.send(
                    'setblock ' +
                      (ox + 128) +
                      ' 2 ' +
                      (oz + 128) +
                      ' repeating_command_block{auto: 1b, Command:"/gamemode survival @a[' +
                      'x=' +
                      (ox + 4) +
                      ',y=' +
                      oy +
                      ',z=' +
                      (oz + 4) +
                      ',dx=247,dy=256,dz=247' +
                      ',gamemode=adventure,' +
                      owner +
                      ']"} replace'
                  )
                }, 0 * 200)

                setTimeout(function () {
                  // SET ORIGIN BORDER
                  server.send(
                    'setblock ' +
                      (ox + 128) +
                      ' 1 ' +
                      (oz + 127) +
                      ' repeating_command_block{auto: 1b, Command:"/gamemode survival @a[' +
                      'x=' +
                      ox +
                      ',y=' +
                      oy +
                      ',z=' +
                      oz +
                      ',dx=250,dy=256,dz=2' +
                      ',gamemode=adventure,' +
                      notowner +
                      ']"} replace'
                  )
                }, 3 * 200)
                setTimeout(function () {
                  // SET CB(Going out of Area)
                  server.send(
                    'setblock ' +
                      (ox + 129) +
                      ' 1 ' +
                      (oz + 128) +
                      ' repeating_command_block{auto: 1b, Command:"/gamemode survival @a[' +
                      'x=' +
                      (nx - 3) +
                      ',y=' +
                      ny +
                      ',z=' +
                      nz +
                      ',dx=2,dy=256,dz=250' +
                      ',gamemode=adventure,' +
                      notowner +
                      ']"} replace'
                  )
                }, 3 * 200)
                setTimeout(function () {
                  // SET CB(Going out of Area)
                  server.send(
                    'setblock ' +
                      (ox + 128) +
                      ' 1 ' +
                      (oz + 129) +
                      ' repeating_command_block{auto: 1b, Command:"/gamemode survival @a[' +
                      'x=' +
                      (mx + 3) +
                      ',y=' +
                      my +
                      ',z=' +
                      (mz - 3) +
                      ',dx=250,dy=256,dz=2' +
                      ',gamemode=adventure,' +
                      notowner +
                      ']"} replace'
                  )
                }, 3 * 200)
                setTimeout(function () {
                  // SET CB(Going out of Area)
                  server.send(
                    'setblock ' +
                      (ox + 127) +
                      ' 1 ' +
                      (oz + 128) +
                      ' repeating_command_block{auto: 1b, Command:"/gamemode survival @a[' +
                      'x=' +
                      ox +
                      ',y=' +
                      oy +
                      ',z=' +
                      (oz + 3) +
                      ',dx=2,dy=256,dz=250' +
                      ',gamemode=adventure,' +
                      notowner +
                      ']"} replace'
                  )
                }, 3 * 200)
                setTimeout(function () {
                  // SET CB(Gamemode 2 for OTHERS)
                  server.send(
                    'setblock ' +
                      (ox + 128) +
                      ' 0 ' +
                      (oz + 128) +
                      ' repeating_command_block{auto: 1b, Command:"/gamemode adventure @a[' +
                      'x=' +
                      (ox + 4) +
                      ',y=' +
                      oy +
                      ',z=' +
                      (oz + 4) +
                      ',dx=247,dy=256,dz=247' +
                      ',gamemode=survival,' +
                      notowner +
                      ']"} replace'
                  )
                }, 6 * 200)
                setTimeout(function () {
                  server.send(
                    'setblock ' +
                      (ox + 128) +
                      ' 1 ' +
                      (oz + 128) +
                      ' minecraft:stone'
                  )

                  server.send(
                    'setblock ' +
                      (ox + 128) +
                      ' 1 ' +
                      (oz + 128) +
                      ' minecraft:redstone_block'
                  )
                }, 15 * 200)
                server.send(
                  '/tellraw ' +
                  user.username +
                  ' ["",{"text":"Zonen-Zentrum: ","bold":true,"clickEvent":{"action":"open_url","value":"https://rea.lity.cc"},"hoverEvent":{"action":"show_text","value":{"text":"","extra":[{"text":"Creaft.NET Meldung"}]}}},{"text":"X ","color":"red","bold":true},{"text":"' +
                  cx +
                  '","bold":true,"italic":true,"color":"none"},{"text":" Y ","color":"green","bold":true,"italic":false},{"text":"' +
                  cy +
                  '","bold":true,"italic":true,"color":"none"},{"text":" Z","color":"dark_blue","bold":true,"italic":false},{"text":" ' +
                  cz +
                  '","bold":true,"italic":true,"color":"none"}]'
                )
                server.send('gamemode survival ' + player)
              })
            }
          })
        }
        return false
      })
    }, // todo: Implement ASAP

    updateZone () {
    },

    removeZone () {
    },

    tpToZone (player, zone) {
      server.ZoneDb.findOne({ _id: zone }).then((zone) => {
        server.UserDb.findOne({ username: player }).then((user) => {
          if (user.xp >= 11) {
            server.UserDb.update(
              { username: player },
              { $inc: { xp: -11 } }
            ).then((_user) => {
              server.send(
                'tp ' + player + ' ' + zone.cx + ' ' + zone.cy + ' ' + zone.cz
              )
            })
          }
        })
      })
    }

    // createZone(name, team, user) { // todo: Remove but reuse code
    //   check(name, String)
    //   check(team, Boolean)
    //
    //   let notowner, owner
    //   var user = Meteor.user()
    //   const timestamp = moment().format().toString()
    //
    //   if (!user.online) {
    //     throw new Meteor.Error('user-not-online')
    //   } else {
    //     // console.log("buyZone - online");
    //     const cx = Math.round(user.gx) // center positions
    //     const cy = Math.round(user.gy)
    //     const cz = Math.round(user.gz)
    //     const ox = Math.round(cx - 127) // origin positions
    //     const oy = 0
    //     const oz = Math.round(cz - 127)
    //     const nx = Math.round(cx + 129) // next positions
    //     const ny = 0
    //     const nz = Math.round(cz - 127)
    //     const mx = Math.round(cx - 127) // more positions
    //     const my = 0
    //     const mz = Math.round(cz + 129)
    //     const dx = Math.round(cx + 129) // destination positions
    //     const dy = 256
    //     const dz = Math.round(cz + 129)
    //
    //     const possibleZone = server.zones.findOne({ $or:
    //         [
    //           { $and: [ { ox: { $lte: cx } }, { oz: { $lte: cz } }, { dx: { $gte: cx } }, { dz: { $gte: cz } } ] },
    //           { $and: [ { ox: { $lte: ox } }, { oz: { $lte: oz } }, { dx: { $gte: ox } }, { dz: { $gte: oz } } ] },
    //           { $and: [ { ox: { $lte: dx } }, { oz: { $lte: dz } }, { dx: { $gte: dx } }, { dz: { $gte: dz } } ] },
    //           { $and: [ { ox: { $lte: mx } }, { oz: { $lte: mz } }, { dx: { $gte: mx } }, { dz: { $gte: mz } } ] },
    //           { $and: [ { ox: { $lte: nx } }, { oz: { $lte: nz } }, { dx: { $gte: nx } }, { dz: { $gte: nz } } ] }
    //         ]
    //     })
    //
    //     if (possibleZone) {
    //       throw new Meteor.Error('name-in-use')
    //     } else if (user.experience > 332) {
    //       // Settings.update({name: "interactions"}, { $inc: {var: 1}});
    //       server.users.update({ username: user.username }, { $inc: { 'experience': -333 } })
    //       const posZo = Server.zones.findOne({ slug: getSlug(name) })
    //
    //       if (posZo) {
    //         throw new Meteor.Error('name-in-use')
    //       }
    //
    //       if (team) {
    //         if (user.teamed) {
    //           var argu = { 'cx': cx,
    //             'cy': cy, // CENTER-POSITIONS
    //             'cz': cz,
    //             'ox': ox,
    //             'oz': oz,
    //             'dx': dx,
    //             'dz': dz,
    //             'mx': mx,
    //             'mz': mz,
    //             'nx': nx,
    //             'nz': nz, // CORNER POSITIONS
    //             'username': user.username,
    //             'name': name,
    //             'slug': getSlug(name),
    //             'team': user.team, // SETTINGS
    //             'p1': [nx, nz],
    //             'p2': [ox, oz],
    //             'p3': [mx, mz],
    //             'p4': [dx, dz] // NEW CORNER POSITIONS
    //           }
    //           owner = 'team=' + user.team
    //           notowner = 'team=!' + user.team
    //         } else {
    //           throw new Meteor.Error('not-teamed')
    //         }
    //       } else {
    //         var argu = { 'cx': cx,
    //           'cy': cy, // CENTER-POSITIONS
    //           'cz': cz,
    //           'ox': ox,
    //           'oz': oz,
    //           'dx': dx,
    //           'dz': dz,
    //           'mx': mx,
    //           'mz': mz,
    //           'nx': nx,
    //           'nz': nz, // CORNER POSITIONS
    //           'username': user.username,
    //           'name': name,
    //           'slug': getSlug(name), // SETTINGS
    //           'p1': [nx, nz],
    //           'p2': [ox, oz],
    //           'p3': [mx, mz],
    //           'p4': [dx, dz] // NEW CORNER POSITIONS
    //         }
    //         owner = 'name=' + user.username
    //         notowner = 'name=!' + user.username
    //       }
    //
    //       server.zones.insert(argu)
    //
    //       setTimeout(function () {
    //         // SET CB(Gamemode 0 for OWNER)
    //         S.send('setblock ' + (ox + 128) + ' 2 ' + (oz + 128) +
    //             ' repeating_command_block 1 replace {auto: 1b, Command:"/gamemode @a[' +
    //             'x=' + (ox + 4) + ',y=' + (oy) + ',z=' + (oz + 4) +
    //             ',dx=247,dy=256,dz=247' +
    //             ',m=2,' + owner + '] survival"}')
    //       }, 0 * 200)
    //
    //       setTimeout(function () {
    //         // SET ORIGIN BORDER
    //         S.send('setblock ' + (ox + 128) + ' 1 ' + (oz + 127) +
    //             ' repeating_command_block 1 replace {auto: 1b, Command:"/gamemode @a[' +
    //             'x=' + (ox) + ',y=' + (oy) + ',z=' + (oz) +
    //             ',dx=250,dy=256,dz=2' +
    //             ',m=2,' + notowner + '] survival"}')
    //       }, 3 * 200)
    //       setTimeout(function () {
    //         // SET CB(Going out of Area)
    //         S.send('setblock ' + (ox + 129) + ' 1 ' + (oz + 128) +
    //             ' repeating_command_block 1 replace {auto: 1b, Command:"/gamemode @a[' +
    //             'x=' + (nx - 3) + ',y=' + (ny) + ',z=' + (nz) +
    //             ',dx=2,dy=256,dz=250' +
    //             ',m=2,' + notowner + '] survival"}')
    //       }, 3 * 200)
    //       setTimeout(function () {
    //         // SET CB(Going out of Area)
    //         S.send('setblock ' + (ox + 128) + ' 1 ' + (oz + 129) +
    //             ' repeating_command_block 1 replace {auto: 1b, Command:"/gamemode @a[' +
    //             'x=' + (mx + 3) + ',y=' + (my) + ',z=' + (mz - 3) +
    //             ',dx=250,dy=256,dz=2' +
    //             ',m=2,' + notowner + '] survival"}')
    //       }, 3 * 200)
    //       setTimeout(function () {
    //         // SET CB(Going out of Area)
    //         S.send('setblock ' + (ox + 127) + ' 1 ' + (oz + 128) +
    //             ' repeating_command_block 1 replace {auto: 1b, Command:"/gamemode @a[' +
    //             'x=' + (ox) + ',y=' + (oy) + ',z=' + (oz + 3) +
    //             ',dx=2,dy=256,dz=250' +
    //             ',m=2,' + notowner + '] survival"}')
    //       }, 3 * 200)
    //       setTimeout(function () {
    //         // SET CB(Gamemode 2 for OTHERS)
    //         S.send('setblock ' + (ox + 128) + ' 0 ' + (oz + 128) +
    //             ' repeating_command_block 1 replace {auto: 1b, Command:"/gamemode @a[' +
    //             'x=' + (ox + 4) + ',y=' + (oy) + ',z=' + (oz + 4) +
    //             ',dx=247,dy=256,dz=247' +
    //             ',m=0,' + notowner + '] adventure"}')
    //       }, 6 * 200)
    //       setTimeout(function () {
    //         S.send('setblock ' + (ox + 128) + ' 1 ' + (oz + 128) + ' minecraft:stone')
    //
    //         S.send('setblock ' + (ox + 128) + ' 1 ' + (oz + 128) + ' minecraft:redstone_block')
    //       }, 15 * 200)
    //       S.send('/tellraw ' + user.username + ' ["",{"text":"Zonen-Zentrum: ","bold":true,"clickEvent":{"action":"open_url","value":"https://rea.lity.cc"},"hoverEvent":{"action":"show_text","value":{"text":"","extra":[{"text":"Creaft.NET Meldung"}]}}},{"text":"X ","color":"red","bold":true},{"text":"' + cx + '","bold":true,"italic":true,"color":"none"},{"text":" Y ","color":"green","bold":true,"italic":false},{"text":"' + cy + '","bold":true,"italic":true,"color":"none"},{"text":" Z","color":"dark_blue","bold":true,"italic":false},{"text":" ' + cz + '","bold":true,"italic":true,"color":"none"}]')
    //     } else {
    //       // not enough exp
    //     }
    //   }
    // },
    //
    // tpZone(player, zone) {
    //   const hypo = server.zones.findOne({ _id: zone })
    //   server.users.update({ username: player }, { $inc: { 'experience': -11 } })
    //   that.send('tp ' + player + ' ' + hypo.cx + ' ' + hypo.cy + ' ' + hypo.cz)
    // }
  }
}
