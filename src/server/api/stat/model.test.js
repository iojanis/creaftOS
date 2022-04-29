import { Stat } from '.'

let stat

beforeEach(async () => {
  stat = await Stat.create({ attribute: 'test', value: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = stat.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(stat.id)
    expect(view.attribute).toBe(stat.attribute)
    expect(view.value).toBe(stat.value)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = stat.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(stat.id)
    expect(view.attribute).toBe(stat.attribute)
    expect(view.value).toBe(stat.value)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
