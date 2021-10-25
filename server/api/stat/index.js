import { Router } from 'express'
import { middleware as query } from 'querymen'
import { token } from '../../services/passport'
import { index, show } from './controller'
export Stat, { schema } from './model'

const router = new Router()

/**
 * @api {get} /stats Retrieve stats
 * @apiName RetrieveStats
 * @apiGroup Stat
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} stats List of stats.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/',
  token({ required: true }),
  query(),
  index)

/**
 * @api {get} /stats/:id Retrieve stat
 * @apiName RetrieveStat
 * @apiGroup Stat
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} stat Stat's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Stat not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({ required: true }),
  show)

export default router
