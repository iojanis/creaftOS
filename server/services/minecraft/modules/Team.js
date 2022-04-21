const getSlug = require("speakingurl")
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

    createAllTeamsFromDb() {
      // find all teams in TeamDB
      // create all Teams in Game

      server.TeamDb.find({}, (err, teams) => {
        if (err) {
          console.log(err)
        } else {
          teams.forEach((team) => {
            server.send('team add ' + team.slug + ' "' + team.name + '"')
          })
        }
      })
    },

    checkTeam(player) {
      console.log({ checkTeam: { player } })
      server.UserDb.findOne({ username: player }).then((user) => {
        if (user.online) {
          const slug = getSlug(user.team)
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
                "team join " + slug + " " + user.username
              )
              server.util.actionbar(
                player,
                'You are part of ' + team.name,
                'green'
              )
              server.io.to(user.username).emit('update_team', {
                team: user.team,
              })
              return true
            } else {
              server.UserDb.updateOne(
                { username: user.username },
                { $set: { teamed: false, team: '' } }
              )
              server.util.actionbar(
                player,
                'You got removed from ' + team.name,
                'red'
              )
              server.io.to(user.username).emit('update_team', {
                team: '',
              })
              return false
            }
          })
        }
      })
    },

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
                      server.io.to(user.username).emit('team_created', {
                        name,
                        slug
                      })
                      server.io.to(user.username).emit('team_created_success', {
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
                  server.io.to(user.username).emit('team_created_fail', {
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
              server.io.to(user.username).emit('update_team', {
                team: '',
              })
              server.util.actionbar(
                  player,
                  'Left the team.',
                  'green'
              )
              return true
            })
        } else {
          return false
        }
      })
    },

    changeTeam (player, name) {
      console.log({ changeTeam: { player, name } })
      const slug = getSlug(name)
      server.UserDb.findOne({ username: player }).then((user) => {
        if (user.online) {
          server.TeamDb.findOne({ slug }).then((team) => {
            if (team.whitelist.includes(user.username)) {
              server.UserDb.updateOne(
                  { username: user.username },
                  { $set: { teamed: true, team: slug } }
              ).then(() => {
                server.send('team leave ' + player)
                server.send(
                    'team join ' + slug + ' ' + user.username
                )
                server.io.to(user.username).emit('update_team', {
                  team: user.team,
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
          server.io.to(user.username).emit('team_not_changed')
          return false
        }
      })
    },

    addToTeam (leader, player) {
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
                  slug: team.slug
                },
                {
                  $addToSet: { whitelist: player }
                }
              ).then((affected) => {
                if (affected) {
                  server.io.to(user.username).emit('update_team', {
                    team: user.team,
                  })
                  server.util.actionbar(
                      leader,
                      'Added player whitelist: ' + player,
                      'green'
                  )
                  server.util.actionbar(
                      player,
                      'Added to whitelist of: ' + team.name,
                      'green'
                  )
                  return true
                } else {
                  server.io.to(user.username).emit('add_to_team_failed')
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
                  slug: team.slug,
                  whitelist: { $ne: player }
                },
                {
                  $pull: { whitelist: player }
                }
              ).then((affected) => {
                this.checkTeam(player)
              })
            }
          })
        }
      })
    }
  }
}
