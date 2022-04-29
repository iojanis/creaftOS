import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Item } from '.'

const app = () => express(apiRoot, routes)

let userSession, item

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  userSession = signSync(user.id)
  item = await Item.create({})
})

test('GET /items 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /items 401', async () => {
  const { status } = await request(app()).get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /items/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${item.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(item.id)
})

test('GET /items/:id 401', async () => {
  const { status } = await request(app()).get(`${apiRoot}/${item.id}`)
  expect(status).toBe(401)
})

test('GET /items/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})
