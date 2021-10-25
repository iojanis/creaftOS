import { User } from '../user'
import { Comment } from '.'

let user, comment

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  comment = await Comment.create({ user, content: 'test', username: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = comment.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(comment.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.content).toBe(comment.content)
    expect(view.username).toBe(comment.username)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = comment.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(comment.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.content).toBe(comment.content)
    expect(view.username).toBe(comment.username)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
