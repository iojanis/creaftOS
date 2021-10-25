import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Book } from '.'

export const create = ({ user, bodymen: { content } }, res, next) =>
  Book.create({ ...content, user })
    .then((book) => book.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Book.find(query, select, cursor)
    .populate('user')
    .then((books) => books.map((book) => book.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Book.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((book) => book ? book.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { content }, params }, res, next) =>
  Book.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((book) => book ? Object.assign(book, content).save() : null)
    .then((book) => book ? book.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Book.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((book) => book ? book.remove() : null)
    .then(success(res, 204))
    .catch(next)
