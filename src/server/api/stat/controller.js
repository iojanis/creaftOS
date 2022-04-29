import { success, notFound } from '../../services/response/'
import { Stat } from '.'

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Stat.find(query, select, cursor)
    .then(stats => stats.map(stat => stat.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Stat.findById(params.id)
    .then(notFound(res))
    .then(stat => stat ? stat.view() : null)
    .then(success(res))
    .catch(next)
