import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'
import blogService from '../services/blogs'

vi.mock('../services/blogs', () => ({
  default: {
    update: vi.fn().mockResolvedValue({ data: { likes: 4 } }),
    create: vi.fn().mockResolvedValue({ data: { title: 'Título test', author: 'Author test', url: 'Url test' } }),
  }
}))

beforeEach(() => {
  vi.clearAllMocks()
})

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

test('calls onChangeLikesBlog twice when like button is clicked twice', async () => {
  const mockOnChangeLikesBlog = vi.fn()
  const user = { id: '67bde4cb877200d147cefb1a' }
  const blog = { title: 'Título 01', author: 'Nome do autor', url: 'http://example.com', likes: 3, user: user }

  render(<Blog blog={blog} user={user} onChangeLikesBlog={mockOnChangeLikesBlog} />)

  const userEventInstance = userEvent.setup()
  const likeButton = screen.getByText('like')

  await userEventInstance.click(likeButton)
  await userEventInstance.click(likeButton)

  expect(mockOnChangeLikesBlog).toHaveBeenCalledTimes(2)
})

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const newBlog = vi.fn()
  const user = userEvent.setup()
  const blog = { title: 'Título 01', author: 'Nome do autor', url: 'http://example.com', likes: 3,
    user: { id: '67bde4cb877200d147cefb1a' } }
  const blogs = [ blog ]

  const { container } = render(<BlogForm blogs={blogs} user={{ username: 'usuario01' }} onSaveBlog={newBlog} />)

  const titleInput = container.querySelector('#title')
  const authorInput = container.querySelector('#author')
  const urlInput = container.querySelector('#url')
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'Título test')
  await user.type(authorInput, 'Author test')
  await user.type(urlInput, 'Url test')
  await user.click(sendButton)

  expect(blogService.create).toHaveBeenCalledTimes(1)
  expect(newBlog).toHaveBeenCalledTimes(1)
  expect(newBlog).toHaveBeenCalledWith(
    expect.arrayContaining([
      expect.objectContaining({
        title: 'Título test',
        author: 'Author test',
        url: 'Url test'
      })
    ]),
    expect.any(String),
    expect.any(Boolean)
  )
})