import { Router } from 'express'
import { middleware as query } from 'querymen'
import { index, show } from './controller'
export Zone, { schema } from './model'

const router = new Router()

/**
 * @api {get} /zones Retrieve zones
 * @apiName RetrieveZones
 * @apiGroup Zone
 * @apiUse listParams
 * @apiSuccess {Object[]} zones List of zones.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /zones/:id Retrieve zone
 * @apiName RetrieveZone
 * @apiGroup Zone
 * @apiSuccess {Object} zone Zone's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Zone not found.
 */
router.get('/:id',
  show)

export default router
