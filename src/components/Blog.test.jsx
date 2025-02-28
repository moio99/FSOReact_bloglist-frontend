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