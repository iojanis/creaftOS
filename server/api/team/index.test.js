import request from 'supertest'
import { apiRoot } from '../../config'
import express from '../../services/express'
import routes, { Team } from '.'

const app = () => express(apiRoot, routes)

let team

beforeEach(async () => {
  team = await Team.create({})
})

test('GET /teams 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /teams/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${team.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(team.id)
})

test('GET /teams/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})
