import { Router } from 'express'
import { middleware as query } from 'querymen'
import { token } from '../../services/passport'
import { index, show } from './controller'
export Log, { schema } from './model'

const router = new Router()

/**
 * @api {get} /logs Retrieve logs
 * @apiName RetrieveLogs
 * @apiGroup Log
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} logs List of logs.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 admin access only.
 */
router.get('/',
  token({ required: true, roles: ['admin'] }),
  query(),
  index)

/**
 * @api {get} /logs/:id Retrieve log
 * @apiName RetrieveLog
 * @apiGroup Log
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess {Object} log Log's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Log not found.
 * @apiError 401 admin access only.
 */
router.get('/:id',
  token({ required: true, roles: ['admin'] }),
  show)

export default router
