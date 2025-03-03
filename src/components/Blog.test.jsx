import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author but not show url and likes', () => {
  const mockOnSaveBlog = vi.fn()

  const user = { username: 'usuario01', name: 'Iago Outeiro', id: '67bde4cb877200d147cefb1a' }
  const blog = { title: 'Título 01', author: 'Nome do autor', url: 'http://example.com', likes: 3, user: user }

  const { container } = render(<Blog blog={blog} user={user} onSaveBlog={mockOnSaveBlog} />)

  const elementTitle = screen.getByText('Título 01')
  const elementAuthor = screen.getByText('Nome do autor')
  expect(elementTitle).toBeDefined()
  expect(elementAuthor).toBeDefined()

  const div = container.querySelector('#moreInfo')
  expect(div).toHaveStyle('display: none')
})

test('shows url and likes when the view button is clicked', async () => {
  const mockOnSaveBlog = vi.fn()

  const user = { username: 'usuario01', name: 'Iago Outeiro', id: '67bde4cb877200d147cefb1a' }
  const blog = { title: 'Título 01', author: 'Nome do autor', url: 'http://example.com', likes: 3, user: user }

  const { container } = render(<Blog blog={blog} user={user} onSaveBlog={mockOnSaveBlog} />)

  const userEventSetup = userEvent.setup()
  const viewButton = container.querySelector('.view-hide')
  await userEventSetup.click(viewButton)

  const moreInfoDiv = container.querySelector('#moreInfo')
  expect(moreInfoDiv).toHaveStyle('display: block')
})

/* test('calls onChangeLikesBlog twice when like button is clicked twice', async () => {
  const mockOnChangeLikesBlog = vi.fn()

  const user = { username: 'usuario01', name: 'Iago Outeiro', id: '67bde4cb877200d147cefb1a' }
  const blog = { title: 'Título 01', author: 'Nome do autor', url: 'http://example.com', likes: 3, user: user }

  const { container } = render(<Blog blog={blog} user={user} onSaveBlog={mockOnChangeLikesBlog} />)

  const userEventSetup = userEvent.setup()
  const viewButton = container.querySelector('.view-hide')
  await userEventSetup.click(viewButton)

  const likeButton = screen.getByText('likeee')
  // const likeButton = container.querySelector('#addLikes')
  console.log('vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv',likeButton)
  await userEventSetup.click(likeButton)
  await userEventSetup.click(likeButton)

  // expect(mockOnChangeLikesBlog).toHaveBeenCalledTimes(2)
  expect(mockOnChangeLikesBlog.mock.calls).toHaveLength(2)
}) */

test('calls handleIncrementLikes twice when the like button is clicked twice', async () => {
  const mockOnChangeLikesBlog = vi.fn()

  vi.mock('../services/blogs', () => ({
    default: {
      update: vi.fn().mockResolvedValue({ data: { likes: 4 } })
    }
  }))

  const user = { id: '67bde4cb877200d147cefb1a' }
  const blog = { title: 'Título 01', author: 'Nome do autor', url: 'http://example.com', likes: 3, user: user }

  render(<Blog blog={blog} user={user} onChangeLikesBlog={mockOnChangeLikesBlog} />)

  const userEventInstance = userEvent.setup()
  const likeButton = screen.getByText('like')

  await userEventInstance.click(likeButton)
  await userEventInstance.click(likeButton)

  expect(mockOnChangeLikesBlog).toHaveBeenCalledTimes(2)
})