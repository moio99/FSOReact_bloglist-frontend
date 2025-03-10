const loginWith = async (page, username, password)  => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByTestId('buttonNewBlog').click()
  await page.getByTestId('testTitle').fill(title)
  await page.getByTestId('testAuthor').fill(author)
  await page.getByTestId('testUrl').fill(url)
  await page.getByTestId('testCreate').click()
  await page.getByText('Added blog').waitFor()
}

export { loginWith, createBlog }