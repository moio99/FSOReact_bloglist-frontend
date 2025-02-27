const BlogForm = ({newTitle, newAuthor, newUrl, onAddBlog, onTitleChange, onAuthorChange, onUrlChange}) => {
  return (
    <form onSubmit={onAddBlog}>
      <div>
        title: <input id='title' value={newTitle} onChange={onTitleChange} />
      </div>
      <div>
        author: <input id='author' value={newAuthor} onChange={onAuthorChange} />
      </div>
      <div>
        url: <input id='url' value={newUrl} onChange={onUrlChange} />
      </div>
      <div>
        <button type='submit' value={newUrl}>create</button>
      </div>
    </form>
  )
}

export default BlogForm