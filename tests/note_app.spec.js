const { test, expect, describe, beforeEach } = require('@playwright/test')
const axios = require('axios');

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await axios.delete('http://localhost:3003/api/users')
    await axios.delete('http://localhost:3003/api/blogs')

    await axios.post('http://localhost:3003/api/users', {
      name: 'test name',
      username: 'testUser',
      password: 'testPass'
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    
    const locatorUser = await page.getByText('username')
    await expect(locatorUser).toBeVisible()

    const locatorPass = await page.getByText('password')
    await expect(locatorPass).toBeVisible()
  })

  
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').first().fill('testUser')
      await page.getByTestId('password').fill('testPass')
      await page.getByRole('button', { name: 'login' }).click()
      
      await expect(page.getByText('test name logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').first().fill('testUserWrong')
      await page.getByTestId('password').fill('testPass')
      await page.getByRole('button', { name: 'login' }).click()
      
      await expect(page.getByText('Wrong username or password')).toBeVisible()
    })
  })
})
