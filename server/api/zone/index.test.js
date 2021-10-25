import request from 'supertest'
import { apiRoot } from '../../config'
import express from '../../services/express'
import routes, { Zone } from '.'

const app = () => express(apiRoot, routes)

let zone

beforeEach(async () => {
  zone = await Zone.create({})
})

test('GET /zones 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /zones/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${zone.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(zone.id)
})

test('GET /zones/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})
