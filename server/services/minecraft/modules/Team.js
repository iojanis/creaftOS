module.exports = function Team () {
  const server = this
  const getSlug = require('speakingurl')
  const teamPrice = 111

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
    createTeam (player, name) {
      console.log({ createTeam: { player, name } })
      server.UserDb.findOne({ username: player })
        .then((user) => {
          if (user.online && user.xp >= teamPrice) {
            const slug = getSlug(name)
            server.TeamDb.findOne({ slug, name })
              .then((team) => {
                if (!team) {
                  server.TeamDb.create({
                    name,
                    slug: getSlug(name),
                    leader: user.username,
                    whitelist: [user.username]
                  }).then(()=>{
                    server.UserDb.updateOne(
                      { username: user.username },
                      { $set: { teamed: true, team: slug }, $inc: { xp: -teamPrice } }
                    ).then(() => {
                      if (user.teamed) {
                        server.send('team leave ' + player)
                      }
                      server.send('team add ' + slug + ' "' + name + '"')
                      server.send('team join ' + slug + ' ' + user.username)
                      server.io.to(user.username).send('team_created', {
                        name,
                        slug
                      })
                      server.io.to(user.username).send('team_created_success', {
                        team, player
                      })
                      server.util.actionbar(
                          player,
                          'Created team: ' + name + ' for ' + teamPrice + '° XPL',
                          'green'
                      )
                      return true
                    })
                  })

                } else {
                  server.util.actionbar(
                      player,
                      'Failed to create team...',
                      'red'
                  )
                  server.io.to(user.username).send('team_created_fail', {
                    team, player
                  })
                  return false
                }
              })
          } else {
            server.util.actionbar(
                player,
                'Not enough XPL° to create a team...',
                'red'
            )
          }
        })
    },

    joinTeam (player, name) {
      console.log({ joinTeam: { player, name } })
      server.UserDb.findOne({ username: player }).then((user) => {
        if (user.online && !user.teamed) {
          const slug = getSlug(name)
          server.TeamDb.findOne({ slug }).then((team) => {
            if (!team) {
              return false
            }
            if (team.whitelist.includes(user.username)) {
              server.UserDb.updateOne(
                { username: user.username },
                { $set: { teamed: true, team: slug } }
              )
              server.send(
                'team join ' + slug + ' ' + user.username
              )
              server.util.actionbar(
                  player,
                  'Joined team: ' + team.name,
                  'green'
              )
              return true
            }
          })
        }
      })
    },

    leaveTeam (player) {
      console.log({ leaveTeam: { player } })
      server.UserDb.findOne({ username: player }).then((user) => {
        if (user.online && user.teamed) {
          server.UserDb.updateOne(
            { username: user.username },
            { $set: { teamed: false, team: '' } }
          )
            .then(() => {
              server.send('team leave ' + player)
              server.io.to(user.username).send('team_leave_success', {
                player
              })
              server.util.actionbar(
                  player,
                  'Left the team.',
                  'green'
              )
              return true
            })
        } else {
          server.io.to(user.username).send('team_leave_failed')
          return false
        }
      })
    },

    changeTeam (player, name) {
      const slug = getSlug(name)
      console.log({ changeTeam: { player, name } })
      server.UserDb.findOne({ username: player }).then((user) => {
        if (user.online) {
          server.TeamDb.findOne({ slug }).then((team) => {
            if (team.whitelist.includes(user.username)) {
              server.UserDb.updateOne(
                  { username: user.username },
                  { $set: { teamed: true, team: slug } }
              ).then(() => {
                server.send('team leave ' & user.username)
                server.send(
                    'team join ' + slug + ' ' + user.username
                )
                server.io.to(user.username).send('team_changed', {
                  team, player
                })
                server.util.actionbar(
                    player,
                    'Switched to team: ' + team.name,
                    'green'
                )
              })
              return true
            } else {
              return false
            }
          })
        } else {
          server.io.to(user.username).send('team_not_changed')
          return false
        }
      })
    },

    addToTeam (leader, player) {
      console.log({ addToTeam: { leader, player } })
      server.UserDb.findOne({ username: leader }).then((user) => {
        if (user.teamed) {
          console.log("user teamed")
          server.TeamDb.findOne({
            slug: user.team,
            leader: user.username
          }).then((team) => {
            if (team) {
              console.log("team exists")
              server.TeamDb.updateOne(
                {
                  slug: team.name
                },
                {
                  $addToSet: { whitelist: player }
                }
              ).then((affected) => {
                if (affected) {
                  console.log("team updated")
                  server.io.to(user.username).send('add_to_team_success', {
                    team, player
                  })
                  server.util.actionbar(
                      leader,
                      'Added to team: ' + player,
                      'green'
                  )
                  return true
                } else {
                  server.io.to(user.username).send('add_to_team_failed')
                  return false
                }
              })
            }
          })
        }
      })
    },

    removeFromTeam (leader, player) {
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
                  whitelist: { $ne: player }
                },
                {
                  $pull: { whitelist: player }
                }
              ).then((affected) => {
                return !!affected
              })
            }
          })
        }
      })
    }
  }
}
