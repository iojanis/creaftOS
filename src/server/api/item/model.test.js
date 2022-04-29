import { Item } from '.'

let item

beforeEach(async () => {
  item = await Item.create({
    item: 'test',
    name: 'test',
    text: 'test',
    type: 'test',
    meta: 'test',
    amount: 'test',
    market: 'test',
    price: 'test'
  })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = item.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(item.id)
    expect(view.item).toBe(item.item)
    expect(view.name).toBe(item.name)
    expect(view.text).toBe(item.text)
    expect(view.type).toBe(item.type)
    expect(view.meta).toBe(item.meta)
    expect(view.amount).toBe(item.amount)
    expect(view.market).toBe(item.market)
    expect(view.price).toBe(item.price)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = item.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(item.id)
    expect(view.item).toBe(item.item)
    expect(view.name).toBe(item.name)
    expect(view.text).toBe(item.text)
    expect(view.type).toBe(item.type)
    expect(view.meta).toBe(item.meta)
    expect(view.amount).toBe(item.amount)
    expect(view.market).toBe(item.market)
    expect(view.price).toBe(item.price)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
