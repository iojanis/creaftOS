/* eslint-disable no-console */
import userModel from '../../../api/user/model'
import tokenModel from '../../../api/token/model'
import dataModel from '../../../api/data/model'
import itemModel from '../../../api/item/model'
import teamModel from '../../../api/team/model'
import bookModel from '../../../api/book/model'
import eventModel from '../../../api/event/model'
import commentModel from '../../../api/comment/model'
import logModel from '../../../api/log/model'
import zoneModel from '../../../api/zone/model'
import statModel from '../../../api/stat/model'

module.exports = function Mongo () {
  const server = this

  server.UserDb = userModel
  server.TokenDb = tokenModel
  server.DataDb = dataModel
  server.ItemDb = itemModel
  server.TeamDb = teamModel
  server.BookDb = bookModel
  server.EventDb = eventModel
  server.CommentDb = commentModel
  server.LogDb = logModel
  server.ZoneDb = zoneModel
  server.StatDb = statModel
}
