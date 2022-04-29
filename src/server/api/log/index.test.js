import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Log } from '.'

const app = () => express(apiRoot, routes)

let userSession, adminSession, log

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  adminSession = signSync(admin.id)
  log = await Log.create({})
})

test('GET /logs 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /logs 401 (user)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /logs 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /logs/:id 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${log.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(log.id)
})

test('GET /logs/:id 401 (user)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${log.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /logs/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${log.id}`)
  expect(status).toBe(401)
})

test('GET /logs/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})
