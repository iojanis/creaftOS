import { Event } from '.'

let event

beforeEach(async () => {
  event = await Event.create({ content: 'test', username: 'test', link: 'test', public: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = event.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(event.id)
    expect(view.content).toBe(event.content)
    expect(view.username).toBe(event.username)
    expect(view.link).toBe(event.link)
    expect(view.public).toBe(event.public)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = event.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(event.id)
    expect(view.content).toBe(event.content)
    expect(view.username).toBe(event.username)
    expect(view.link).toBe(event.link)
    expect(view.public).toBe(event.public)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
