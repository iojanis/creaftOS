import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Book, { schema } from './model'

const router = new Router()
const { title, content, likes, comments, username } = schema.tree

/**
 * @api {post} /books Create book
 * @apiName CreateBook
 * @apiGroup Book
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Book's title.
 * @apiParam body Book's body.
 * @apiParam likes Book's likes.
 * @apiParam comments Book's comments.
 * @apiParam username Book's username.
 * @apiSuccess {Object} book Book's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Book not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ title, content, username }),
  create)

/**
 * @api {get} /books Retrieve books
 * @apiName RetrieveBooks
 * @apiGroup Book
 * @apiUse listParams
 * @apiSuccess {Object[]} books List of books.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /books/:id Retrieve book
 * @apiName RetrieveBook
 * @apiGroup Book
 * @apiSuccess {Object} book Book's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Book not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /books/:id Update book
 * @apiName UpdateBook
 * @apiGroup Book
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Book's title.
 * @apiParam body Book's body.
 * @apiParam likes Book's likes.
 * @apiParam comments Book's comments.
 * @apiParam username Book's username.
 * @apiSuccess {Object} book Book's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Book not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ title, content, likes, comments, username }),
  update)

/**
 * @api {delete} /books/:id Delete book
 * @apiName DeleteBook
 * @apiGroup Book
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Book not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
