import { success, notFound } from '../../services/response/'
import { Team } from '.'

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Team.find(query, select, cursor)
    .then(teams => teams.map(team => team.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Team.findOne({ slug: params.slug })
    .then(notFound(res))
    .then(team => team ? team.view() : null)
    .then(success(res))
    .catch(next)
