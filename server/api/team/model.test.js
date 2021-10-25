import { Team } from '.'

let team

beforeEach(async () => {
  team = await Team.create({ name: 'test', slug: 'test', description: 'test', leader: 'test', whitelist: 'test', xp: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = team.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(team.id)
    expect(view.name).toBe(team.name)
    expect(view.slug).toBe(team.slug)
    expect(view.description).toBe(team.description)
    expect(view.leader).toBe(team.leader)
    expect(view.whitelist).toBe(team.whitelist)
    expect(view.xp).toBe(team.xp)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = team.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(team.id)
    expect(view.name).toBe(team.name)
    expect(view.slug).toBe(team.slug)
    expect(view.description).toBe(team.description)
    expect(view.leader).toBe(team.leader)
    expect(view.whitelist).toBe(team.whitelist)
    expect(view.xp).toBe(team.xp)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
