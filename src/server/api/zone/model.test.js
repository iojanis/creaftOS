import { Zone } from '.'

let zone

beforeEach(async () => {
  zone = await Zone.create({ name: 'test', slug: 'test', description: 'test', team: 'test', team_name: 'test', username: 'test', p1: 'test', p2: 'test', p3: 'test', p4: 'test', pcenter: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = zone.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(zone.id)
    expect(view.name).toBe(zone.name)
    expect(view.slug).toBe(zone.slug)
    expect(view.description).toBe(zone.description)
    expect(view.team).toBe(zone.team)
    expect(view.team_name).toBe(zone.team_name)
    expect(view.username).toBe(zone.username)
    expect(view.p1).toBe(zone.p1)
    expect(view.p2).toBe(zone.p2)
    expect(view.p3).toBe(zone.p3)
    expect(view.p4).toBe(zone.p4)
    expect(view.pcenter).toBe(zone.pcenter)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = zone.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(zone.id)
    expect(view.name).toBe(zone.name)
    expect(view.slug).toBe(zone.slug)
    expect(view.description).toBe(zone.description)
    expect(view.team).toBe(zone.team)
    expect(view.team_name).toBe(zone.team_name)
    expect(view.username).toBe(zone.username)
    expect(view.p1).toBe(zone.p1)
    expect(view.p2).toBe(zone.p2)
    expect(view.p3).toBe(zone.p3)
    expect(view.p4).toBe(zone.p4)
    expect(view.pcenter).toBe(zone.pcenter)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
