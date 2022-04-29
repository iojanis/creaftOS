import request from 'supertest'
// eslint-disable-next-line import/named
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Data } from '.'

const app = () => express(apiRoot, routes)

let userSession, adminSession, data

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const admin = await User.create({
    email: 'c@c.com',
    password: '123456',
    role: 'admin'
  })
  userSession = signSync(user.id)
  adminSession = signSync(admin.id)
  data = await Data.create({})
})

test('POST /data 201 (admin)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({
      access_token: adminSession,
      type: 'test',
      meta: 'test',
      name: 'test',
      text_type: 'test'
    })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.type).toEqual('test')
  expect(body.meta).toEqual('test')
  expect(body.name).toEqual('test')
  expect(body.text_type).toEqual('test')
})

test('POST /data 401 (user)', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('POST /data 401', async () => {
  const { status } = await request(app()).post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /data 200', async () => {
  const { status, body } = await request(app()).get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /data/:id 200', async () => {
  const { status, body } = await request(app()).get(`${apiRoot}/${data.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(data.id)
})

test('GET /data/:id 404', async () => {
  const { status } = await request(app()).get(
    apiRoot + '/123456789098765432123456'
  )
  expect(status).toBe(404)
})

test('PUT /data/:id 200 (admin)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${data.id}`)
    .send({
      access_token: adminSession,
      type: 'test',
      meta: 'test',
      name: 'test',
      text_type: 'test'
    })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(data.id)
  expect(body.type).toEqual('test')
  expect(body.meta).toEqual('test')
  expect(body.name).toEqual('test')
  expect(body.text_type).toEqual('test')
})

test('PUT /data/:id 401 (user)', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${data.id}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('PUT /data/:id 401', async () => {
  const { status } = await request(app()).put(`${apiRoot}/${data.id}`)
  expect(status).toBe(401)
})

test('PUT /data/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({
      access_token: adminSession,
      type: 'test',
      meta: 'test',
      name: 'test',
      text_type: 'test'
    })
  expect(status).toBe(404)
})

test('DELETE /data/:id 204 (admin)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${data.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(204)
})

test('DELETE /data/:id 401 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${data.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('DELETE /data/:id 401', async () => {
  const { status } = await request(app()).delete(`${apiRoot}/${data.id}`)
  expect(status).toBe(401)
})

test('DELETE /data/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})
