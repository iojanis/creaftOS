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
    client.on('set_lat_long', () => {
      server.user.setLatLong(server.socket.getUsernameFromId(client.id))
    })
  })

  function setCommandBlocks(ox, oz, oy, owner, notowner, nx, ny, nz, mx, my, mz) {
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
    }, 0)
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
  }

  function getFilter(cx, cz, ox, oz, dx, dz, mx, mz, nx, nz) {
    return {
      $or: [
        {
          $and: [
            {p2x:  {$lte: cx}},
            {p2z:  {$lte: cz}},
            {p4x:  {$gte: cx}},
            {p4z:  {$gte: cz}}
          ]
        },
        {
          $and: [
            {p2x: {$lte: ox}},
            {p2z: {$lte: oz}},
            {p4x: {$gte: ox}},
            {p4z: {$gte: oz}}
          ]
        },
        {
          $and: [
            {p2x: {$lte: dx}},
            {p2z: {$lte: dz}},
            {p4x: {$gte: dx}},
            {p4z: {$gte: dz}}
          ]
        },
        {
          $and: [
            {p2x: {$lte: mx}},
            {p2z: {$lte: mz}},
            {p4x: {$gte: mx}},
            {p4z: {$gte: mz}}
          ]
        },
        {
          $and: [
            {p2x: {$lte: nx}},
            {p2z: {$lte: nz}},
            {p4x: {$gte: nx}},
            {p4z: {$gte: nz}}
          ]
        }
      ]
    }
  }

  function createCoors(user) {
    const cx = Math.round(user.joined_x) // pcenter[0]
    const cz = Math.round(user.joined_z) // pcenter[1]
    const cy = Math.round(user.joined_y) // pcenter[2]

    const nx = Math.round(cx + 129) // p1
    const nz = Math.round(cz - 127) // p1

    const ox = Math.round(cx - 127) // p2
    const oz = Math.round(cz - 127) // p2

    const mx = Math.round(cx - 127) // p3
    const mz = Math.round(cz + 129) // p3

    const dx = Math.round(cx + 129) // p4
    const dz = Math.round(cz + 129) // p4

    const oy = 0  // *1     *2
    const ny = 0  //    *c
    const my = 0  // *4     *3
    return { cx, cz, cy, nx, nz, ox, oz, mx, mz, dx, dz, oy, ny, my }
  }

  function joinedFriendly(player, zone) {
    server.util.actionbar(
        player,
        'You joined in/near a friendly Zone!',
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
        zone.pcx +
        '","bold":true,"italic":true,"color":"none"},{"text":" Y ","color":"green","bold":true,"italic":false},{"text":"' +
        zone.pcy +
        '","bold":true,"italic":true,"color":"none"},{"text":" Z","color":"dark_blue","bold":true,"italic":false},{"text":" ' +
        zone.pcz +
        '","bold":true,"italic":true,"color":"none"}]'
    )
  }

  function joinedForeign(player, zone) {
    server.util.actionbar(
        player,
        'You joined in/near a foreign Zone!',
        'yellow'
    )
    server.send(
        'tellraw ' +
        player +
        ' ["",{"text":"[' +
        zone.name +
        '] nearby: ","bold":true,"clickEvent":{"action":"open_url","value":"https://rea.lity.cc/map' +
        zone.slug +
        '"},"hoverEvent":{"action":"show_text","value":{"text":"","extra":[{"text":"EnderNET"}]}}},{"text":"X ","color":"red","bold":true},{"text":"' +
        zone.pcx +
        '","bold":true,"italic":true,"color":"none"},{"text":" Y ","color":"green","bold":true,"italic":false},{"text":"' +
        zone.pcy +
        '","bold":true,"italic":true,"color":"none"},{"text":" Z","color":"dark_blue","bold":true,"italic":false},{"text":" ' +
        zone.pcz +
        '","bold":true,"italic":true,"color":"none"}]'
    )
  }

  function joinedClaimed(player) {
    server.UserDb.findOne({username: player}).then((user) => {
      server.util.actionbar(player, 'You joined in/near unclaimed land.', 'green')
      server.send('gamemode survival ' + player)
      server.send(
          'tellraw ' +
          player +
          ' ["",{"text":"Free Zone: ","bold":true,"clickEvent":{"action":"open_url","value":"https://rea.lity.cc/map"},"hoverEvent":{"action":"show_text","value":{"text":"","extra":[{"text":"EnderNET"}]}}},{"text":"X ","color":"red","bold":true},{"text":"' +
          parseInt(user.joined_x) +
          '","bold":true,"italic":true,"color":"none"},{"text":" Y ","color":"green","bold":true,"italic":false},{"text":"' +
          parseInt(user.joined_y) +
          '","bold":true,"italic":true,"color":"none"},{"text":" Z","color":"dark_blue","bold":true,"italic":false},{"text":" ' +
          parseInt(user.joined_z) +
          '","bold":true,"italic":true,"color":"none"}]'
      )
    })
  }

  function createZone(player, name, nx, nz, ox, oz, mx, mz, dx, dz, cx, cy, cz, oy, ny, my) {
    server.UserDb.findOne({username: player}).then((user) => {
      if (user.xp >= 111) {
        server.UserDb.updateOne(
            {username: player},
            {$inc: {xp: -111}}
        ).then((_user) => {
          const owner = 'team=' + user.team
          const notowner = 'team=!' + user.team

          server.ZoneDb.create({
            username: user.username,
            name,
            slug: getSlug(name),
            team: user.team,
            p1x: nx,
            p1z: nz,
            p2x: ox,
            p2z: oz,
            p3x: mx,
            p3z: mz,
            p4x: dx,
            p4z: dz,
            pcx: cx,
            pcy: cy,
            pcz: cz,
          }).then(() => {
            setCommandBlocks(ox, oz, oy, owner, notowner, nx, ny, nz, mx, my, mz)
            server.send(
                '/tellraw ' +
                user.username +
                ' ["",{"text":"Zone Center: ","bold":true,"clickEvent":{"action":"open_url","value":"https://rea.lity.cc"},"hoverEvent":{"action":"show_text","value":{"text":"","extra":[{"text":"EnderNET Alert"}]}}},{"text":"X ","color":"red","bold":true},{"text":"' +
                cx +
                '","bold":true,"italic":true,"color":"none"},{"text":" Y ","color":"green","bold":true,"italic":false},{"text":"' +
                cy +
                '","bold":true,"italic":true,"color":"none"},{"text":" Z","color":"dark_blue","bold":true,"italic":false},{"text":" ' +
                cz +
                '","bold":true,"italic":true,"color":"none"}]'
            )
            server.util.actionbar(player, 'Zone purchased! -111°', 'green')
            server.send('gamemode survival ' + player)
          })
        })
      } else {
        server.util.actionbar(player, 'You\'ll need 111° XPL!', 'red')
      }
    })
  }

  server.zone = {
    checkForZone (player) {
      server.UserDb.findOne({ username: player }).then((user) => {
        if (user.online) {
          const { cx, cz, nx, nz, ox, oz, mx, mz, dx, dz } = createCoors(user)
          const filter = getFilter(cx, cz, ox, oz, dx, dz, mx, mz, nx, nz)

          server.ZoneDb.findOne(filter).then((zone) => {
            if (zone && zone.username === player) {
              joinedFriendly(player, zone)
            } else if (zone) {
              joinedForeign(player, zone)
            } else {
              joinedClaimed(player)
            }
          })
        }
        return false
      })
    },

    createZone (player, name) {
      server.UserDb.findOne({ username: player }).then((user) => {
        if (user.online) {
          const { cx, cz, cy, nx, nz, ox, oz, mx, mz, dx, dz, oy, ny, my } = createCoors(user)
          const filter = getFilter(cx, cz, ox, oz, dx, dz, mx, mz, nx, nz)

          server.ZoneDb.findOne(filter).then((zone) => {
            const implemented = true
            if (zone && zone.username === player) {
              joinedFriendly(player, zone)
            } else if (zone) {
              joinedForeign(player, zone)
            } else if (implemented && !zone) {
              createZone(player, name, nx, nz, ox, oz, mx, mz, dx, dz, cx, cy, cz, oy, ny, my)
            }
          })
        }
        return false
      })
    },

    updateZone () {
    },

    removeZone () {
    },

    tpToZone (player, zoneName) {
      const slug = getSlug(zoneName)
      server.ZoneDb.findOne({ slug }).then((zone) => {
        server.UserDb.findOne({ username: player }).then((user) => {
          if (user.xp >= 11) {
            server.UserDb.updateOne(
              { username: player },
              { $inc: { xp: -11 } }
            ).then((_user) => {
              server.util.actionbar(
                  player,
                  'Teleported to '+ zone.name +'! -11°',
                  'green'
              )
              server.send(
                'tp ' + player + ' ' + zone.pcx + ' ' + zone.pcy + ' ' + zone.pcz
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
