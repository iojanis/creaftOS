import { Router } from 'express'
import user from './user'
import auth from './auth'
import token from './token'
import item from './item'
import data from './data'
import zone from './zone'
import team from './team'
import book from './book'
import comment from './comment'
import log from './log'
import event from './event'
import stat from './stat'

const router = new Router()

/**
 * @apiDefine master Master access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine admin Admin access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine user User access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine listParams
 * @apiParam {String} [q] Query to search.
 * @apiParam {Number{1..30}} [page=1] Page number.
 * @apiParam {Number{1..100}} [limit=30] Amount of returned items.
 * @apiParam {String[]} [sort=-createdAt] Order of returned items.
 * @apiParam {String[]} [fields] Fields to be returned.
 */
router.use('/users', user)
router.use('/auth', auth)
router.use('/tokens', token)
router.use('/items', item)
router.use('/data', data)
router.use('/zones', zone)
router.use('/teams', team)
router.use('/books', book)
router.use('/comments', comment)
router.use('/logs', log)
router.use('/events', event)
router.use('/stats', stat)

export default router
