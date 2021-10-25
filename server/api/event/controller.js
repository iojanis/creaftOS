import { success, notFound } from '../../services/response/'
import { Event } from '.'

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Event.find(query, select, cursor)
    .then((events) => events.map((event) => event.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Event.findById(params.id)
    .then(notFound(res))
    .then((event) => event ? event.view() : null)
    .then(success(res))
    .catch(next)
