import { User } from '../user'
import { Book } from '.'

let user, book

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  book = await Book.create({ user, title: 'test', body: 'test', likes: 'test', comments: 'test', username: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = book.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(book.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.title).toBe(book.title)
    expect(view.body).toBe(book.body)
    expect(view.likes).toBe(book.likes)
    expect(view.comments).toBe(book.comments)
    expect(view.username).toBe(book.username)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = book.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(book.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.title).toBe(book.title)
    expect(view.body).toBe(book.body)
    expect(view.likes).toBe(book.likes)
    expect(view.comments).toBe(book.comments)
    expect(view.username).toBe(book.username)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
