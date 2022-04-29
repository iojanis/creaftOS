import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Book } from '.'

const app = () => express(apiRoot, routes)

let userSession, anotherSession, book

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  book = await Book.create({ user })
})

test('POST /books 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, title: 'test', body: 'test', likes: 'test', comments: 'test', username: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.title).toEqual('test')
  expect(body.body).toEqual('test')
  expect(body.likes).toEqual('test')
  expect(body.comments).toEqual('test')
  expect(body.username).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('POST /books 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /books 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /books/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${book.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(book.id)
})

test('GET /books/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /books/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${book.id}`)
    .send({ access_token: userSession, title: 'test', body: 'test', likes: 'test', comments: 'test', username: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(book.id)
  expect(body.title).toEqual('test')
  expect(body.body).toEqual('test')
  expect(body.likes).toEqual('test')
  expect(body.comments).toEqual('test')
  expect(body.username).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('PUT /books/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${book.id}`)
    .send({ access_token: anotherSession, title: 'test', body: 'test', likes: 'test', comments: 'test', username: 'test' })
  expect(status).toBe(401)
})

test('PUT /books/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${book.id}`)
  expect(status).toBe(401)
})

test('PUT /books/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: anotherSession, title: 'test', body: 'test', likes: 'test', comments: 'test', username: 'test' })
  expect(status).toBe(404)
})

test('DELETE /books/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${book.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /books/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${book.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /books/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${book.id}`)
  expect(status).toBe(401)
})

test('DELETE /books/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
