import { useState } from 'react'
import commentService from '../services/comments'

const CommentForm = ({ comments, blogId, onSaveComment }) => {
  const [newTitle, setNewTitle] = useState('')

  const handleTitleChange = (event) => {
    const inputValue = event.target.value
    setNewTitle(inputValue)
  }

  const handleAddComment = (event) => {
    event.preventDefault()

    const form = event.target
    const inputTitle = form.querySelector('input[id="title"]').value
    if (inputTitle.length > 0) {
      const newComment = {
        title: inputTitle,
        blog: blogId,
      }
      commentService
        .create(newComment)
        .then((response) => {
          setNewTitle('')
          onSaveComment(
            response.data,
            `Added comment: "${response.data.title}"!`,
            false
          )
        })
        .catch((error) => {
          console.log('CreateError', error)
          if (error.response && error.response.status === 400) {
            onSaveComment(newComment, error.response.data.error, true)
          } else {
            onSaveComment(newComment, `Error on create ""${newComment.title}"`, true)
          }
        })
    }
  }

  return (
    <form onSubmit={handleAddComment}>
      Comment:{' '}
      <input
        type="text"
        id="title"
        value={newTitle}
        data-testid="testTitle"
        onChange={handleTitleChange}
      />
      <button type="submit" data-testid="testCreate">
        Add comment
      </button>
    </form>
  )
}

export default CommentForm
