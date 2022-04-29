import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Comment } from '.'

export const create = ({ user, bodymen: { content } }, res, next) =>
  Comment.create({ ...content, user })
    .then(comment => comment.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Comment.find(query, select, cursor)
    .populate('user')
    .then(comments => comments.map(comment => comment.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Comment.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(comment => comment ? comment.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { content }, params }, res, next) =>
  Comment.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then(comment => comment ? Object.assign(comment, content).save() : null)
    .then(comment => comment ? comment.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Comment.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then(comment => comment ? comment.remove() : null)
    .then(success(res, 204))
    .catch(next)
