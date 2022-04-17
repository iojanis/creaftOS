import { success, notFound } from '../../services/response/'
import { Zone } from '.'

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Zone.find(query, select, cursor)
    .then(zones => zones.map(zone => zone.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Zone.findById(params.id)
    .then(notFound(res))
    .then(zone => zone ? zone.view() : null)
    .then(success(res))
    .catch(next)


export const showByTeam = ({ params }, res, next) =>
  Zone.find({ team: params.team })
    .then(notFound(res))
    .then(zones => zones.map(zone => zone.view()))
    .then(success(res))
    .catch(next)
