import { success, notFound } from '../../services/response/'
import { Log } from '.'

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Log.find(query, select, cursor)
    .then(logs => logs.map(log => log.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Log.findById(params.id)
    .then(notFound(res))
    .then(log => log ? log.view() : null)
    .then(success(res))
    .catch(next)
