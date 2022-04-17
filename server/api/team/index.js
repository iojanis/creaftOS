import { Router } from 'express'
import { middleware as query } from 'querymen'
import { index, show } from './controller'
export Team, { schema } from './model'

const router = new Router()

/**
 * @api {get} /teams Retrieve teams
 * @apiName RetrieveTeams
 * @apiGroup Team
 * @apiUse listParams
 * @apiSuccess {Object[]} teams List of teams.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /teams/:id Retrieve team
 * @apiName RetrieveTeam
 * @apiGroup Team
 * @apiSuccess {Object} team Team's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Team not found.
 */
router.get('/:slug',
  show)

export default router
