import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Stat } from '.'

const app = () => express(apiRoot, routes)

let userSession, stat

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  userSession = signSync(user.id)
  stat = await Stat.create({})
})

test('GET /stats 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /stats 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /stats/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${stat.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(stat.id)
})

test('GET /stats/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${stat.id}`)
  expect(status).toBe(401)
})

test('GET /stats/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})
