import { Data } from '.'

let data

beforeEach(async () => {
  data = await Data.create({
    type: 'test',
    meta: 'test',
    name: 'test',
    text_type: 'test'
  })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = data.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(data.id)
    expect(view.type).toBe(data.type)
    expect(view.meta).toBe(data.meta)
    expect(view.name).toBe(data.name)
    expect(view.text_type).toBe(data.text_type)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = data.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(data.id)
    expect(view.type).toBe(data.type)
    expect(view.meta).toBe(data.meta)
    expect(view.name).toBe(data.name)
    expect(view.text_type).toBe(data.text_type)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
