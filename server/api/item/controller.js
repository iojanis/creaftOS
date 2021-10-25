import { success, notFound } from '../../services/response/'
import { Item } from '.'

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Item.find(query, select, cursor)
    .then(items => items.map(item => item.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Item.findById(params.id)
    .then(notFound(res))
    .then(item => (item ? item.view() : null))
    .then(success(res))
    .catch(next)
