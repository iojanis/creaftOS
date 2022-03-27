import { Token } from '.'

let token

beforeEach(async () => {
  token = await Token.create({
    username: 'test',
    code: 'test',
    activation: 'test'
  })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = token.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(token.id)
    expect(view.username).toBe(token.username)
    expect(view.code).toBe(token.code)
    expect(view.activation).toBe(token.activation)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = token.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(token.id)
    expect(view.username).toBe(token.username)
    expect(view.code).toBe(token.code)
    expect(view.activation).toBe(token.activation)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
