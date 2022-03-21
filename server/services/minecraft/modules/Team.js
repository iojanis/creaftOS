module.exports = function Team() {
  const server = this
  const getSlug = require('speakingurl')

  server.io.on('connection', (client) => {
    client.on('create_team', (team) => {
      server.team.createTeam(server.socket.getUsernameFromId(client.id), team)
    })
    client.on('join_team', (team) => {
      server.team.joinTeam(server.socket.getUsernameFromId(client.id), team)
    })
    client.on('leave_team', () => {
      server.team.leaveTeam(server.socket.getUsernameFromId(client.id))
    })
    client.on('change_team', (team) => {
      server.team.changeTeam(server.socket.getUsernameFromId(client.id), team)
    })
    client.on('add_to_team', (player) => {
      server.team.addToTeam(server.socket.getUsernameFromId(client.id), player)
    })
    client.on('remove_from_team', (player) => {
      server.team.removeFromTeam(server.socket.getUsernameFromId(client.id), player)
    })
  })

  server.team = {
    createTeam(player, name) {
      console.log({ createTeam: { player, name } })
      server.UserDb.findOne({ username: player })
        .then((user) => {
          if (user.online) {
            const slug = getSlug(name)
            server.TeamDb.findOne({ slug })
              .then((team) => {
                if (!team) {
                  server.TeamDb.create({
                    name,
                    slug: getSlug(name),
                    leader: user.username,
                    whitelist: [user.username]
                  })
                  server.UserDb.updateOne(
                    { username: user.username },
                    { $set: { teamed: true, team: slug } }
                  ).then(() => {
                    if (user.teamed) {
                      server.send('team leave ' + player)
                    }
                    server.send('team add ' + slug + ' "' + name + '"')
                    server.send('team join ' + slug + ' ' + user.username)
                    return true
                  })
                } else {
                  return false
                }
              })
          }
        })
    },

    joinTeam(player, name) {
      console.log({ joinTeam: { player, name } })
      server.UserDb.findOne({ username: player }).then((user) => {
        if (user.online) {
          const slug = getSlug(name)
          server.TeamDb.findOne({ slug }).then((team) => {
            if (!team) {
              return false
            }
            if (team.whitelist.indexOf(user.username) < -1) {
              return false
            } else {
              server.UserDb.updateOne(
                { username: user.username },
                { $set: { teamed: true, team: slug } }
              )
              server.send(
                'team join ' + slug + ' ' + user.username
              )
              return true
            }
          })
        }
      })
    },

    leaveTeam(player) {
      console.log({ leaveTeam: { player } })
      server.UserDb.findOne({ username: player }).then((user) => {
        if (user.online && user.teamed) {
          server.UserDb.updateOne(
            { username: user.username },
            { $set: { teamed: false, team: null } }
          )
            .then(() => {
              server.send('team leave ' + player)
              return true
            })
        } else {
          return false
        }
      })
    },

    changeTeam(player, name) {
      console.log({ changeTeam: { player, name } })
      server.UserDb.findOne({ username: player }).then((user) => {
        if (user.online && user.teamed) {
          server.UserDb.updateOne(
            { username: user.username },
            { $set: { teamed: false, team: null } }
          ).then(() => {
            server.send('team leave ' & user.username)
            const slug = getSlug(name)
            server.TeamDb.findOne({ slug }).then((team) => {
              if (!team) {
                return false
              }
              if (team.whitelist.indexOf(user.username) < -1) {
                return false
              } else {
                server.UserDb.updateOne(
                  { username: user.username },
                  { $set: { teamed: true, team: slug } }
                ).then(() => {
                  server.send(
                    'team join ' + slug + ' ' + user.username
                  )
                })
                return true
              }
            })
          })
        } else {
          return false
        }
      })
    },

    addToTeam(leader, player) {
      console.log({ addToTeam: { leader, player } })
      server.UserDb.findOne({ username: leader }).then((user) => {
        if (user.teamed) {
          server.TeamDb.findOne({
            slug: user.team,
            leader: user.username
          }).then((team) => {
            if (team) {
              server.TeamDb.updateOne(
                {
                  slug: team.name,
                  whitelist: { $ne: leader }
                },
                {
                  $addToSet: { whitelist: player }
                }
              ).then((affected) => {
                if (affected) {
                  return true
                } else {
                  throw new Error('not affected')
                }
              })
            }
          })
        }
      })
    },

    removeFromTeam(leader, player) {
      console.log({ removeFromTeam: { leader, player } })
      server.UserDb.findOne({ username: leader }).then((user) => {
        if (user.teamed) {
          server.TeamDb.findOne({
            slug: user.team,
            leader: user.username
          }).then((team) => {
            if (team) {
              server.TeamDb.updateOne(
                {
                  slug: team.name,
                  whitelist: { $ne: leader }
                },
                {
                  $pull: { whitelist: player }
                }
              ).then((affected) => {
                if (affected) {
                  return true
                } else {
                  throw new Error('error-appeared')
                }
              })
            }
          })
        }
      })
    }
  }
}
