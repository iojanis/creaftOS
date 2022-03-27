import { success, notFound } from '../../services/response/'
import { Data } from '.'

export const create = ({ bodymen: { body } }, res, next) =>
  Data.create(body)
    .then(data => data.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Data.find(query, select, cursor)
    .then(data => data.map(data => data.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Data.findById(params.id)
    .then(notFound(res))
    .then(data => (data ? data.view() : null))
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Data.findById(params.id)
    .then(notFound(res))
    .then(data => (data ? Object.assign(data, body).save() : null))
    .then(data => (data ? data.view(true) : null))
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Data.findById(params.id)
    .then(notFound(res))
    .then(data => (data ? data.remove() : null))
    .then(success(res, 204))
    .catch(next)
