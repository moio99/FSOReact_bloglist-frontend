import { useState } from 'react'
import blogService from '../services/blogs'

const BlogForm = ({ blogs, user, onSaveBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleTitleChange = (event) => {
    const inputValue = event.target.value
    setNewTitle(inputValue)
  }

  const handleAuthorChange = (event) => {
    const inputValue = event.target.value
    setNewAuthor(inputValue)
  }

  const handleUrlChange = (event) => {
    const inputValue = event.target.value
    setNewUrl(inputValue)
  }

  const handleAddBlog = (event) => {
    event.preventDefault()

    const form = event.target
    const inputTitle = form.querySelector('input[id="title"]').value
    const inputAuthor = form.querySelector('input[id="author"]').value
    const inputUrl = form.querySelector('input[id="url"]').value
    if (inputTitle.length > 0) {
      const blog = blogs.find(
        (blog) =>
          blog.title.toLocaleLowerCase() === inputTitle.toLocaleLowerCase()
      )
      if (blog) {
        updateBlog(blog, inputAuthor, inputUrl)
      } else {
        addBlog(inputTitle, inputAuthor, inputUrl)
      }
    }
  }

  const updateBlog = (blog, inputAuthor, inputUrl) => {
    const confirmText = `The title "${blog.title}" is already added to the blog list, update the old values author: "${blog.author}" url: "${blog.url}"?`
    if (window.confirm(confirmText)) {
      const updateBlog = {
        title: blog.title,
        author: inputAuthor,
        url: inputUrl,
        likes: blog.likes,
        user: user,
      }
      blogService
        .update(blog.id, updateBlog)
        .then((response) => {
          console.log('update', response.data)
          setNewTitle('')
          setNewAuthor('')
          setNewUrl('')
          const changedBlogs = blogs.map((b) =>
            b.id === blog.id
              ? { ...b, author: inputAuthor, url: inputUrl, likes: blog.likes }
              : b
          )
          onSaveBlog(
            changedBlogs,
            `Updated blog: "${response.data.title}"!`,
            false
          )
        })
        .catch((error) => {
          console.log('UpdateError', error)
          if (error.response && error.response.status === 400) {
            onSaveBlog(blogs, error.response.data.error, true)
          } else {
            onSaveBlog(blogs, `Error on update "${blog.title}"`, true)
          }
        })
    }
  }

  const addBlog = (inputTitle, inputAuthor, inputUrl) => {
    const newBlog = {
      title: inputTitle,
      author: inputAuthor,
      url: inputUrl,
      user: user,
    }
    blogService
      .create(newBlog)
      .then((response) => {
        console.log('create', response.data)
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
        const changedBlogs = blogs.concat(response.data)
        onSaveBlog(
          changedBlogs,
          `Added blog title: "${response.data.title}"!`,
          false
        )
      })
      .catch((error) => {
        console.log('CreateError', error)
        if (error.response && error.response.status === 400) {
          onSaveBlog(blogs, error.response.data.error, true)
        } else {
          onSaveBlog(blogs, `Error on create ""${newBlog.title}"`, true)
        }
      })
  }

  return (
    <form onSubmit={handleAddBlog}>
      <div>
        title:{' '}
        <input
          type="text"
          id="title"
          value={newTitle}
          data-testid="testTitle"
          onChange={handleTitleChange}
        />
      </div>
      <div>
        author:{' '}
        <input
          type="text"
          id="author"
          value={newAuthor}
          data-testid="testAuthor"
          onChange={handleAuthorChange}
        />
      </div>
      <div>
        url:{' '}
        <input
          type="text"
          id="url"
          value={newUrl}
          data-testid="testUrl"
          onChange={handleUrlChange}
        />
      </div>
      <div>
        <button type="submit" data-testid="testCreate">
          create
        </button>
      </div>
    </form>
  )
}

export default BlogForm
