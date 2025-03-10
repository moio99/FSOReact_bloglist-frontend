const { test, expect, describe, beforeEach } = require('@playwright/test')
const axios = require('axios');
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await axios.post('http://localhost:3003/api/testing/reset')

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
      await loginWith(page, 'testUser', 'testPass')
      
      await expect(page.getByText('test name logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testUserWrong', 'testPass')
      
      await expect(page.getByText('Wrong username or password')).toBeVisible()
    })
  })

  test('new blogs can be created', async ({ page }) => {
    await loginWith(page, 'testUser', 'testPass')

    await createBlog(page, 'test title', 'test author', 'test url')
  })
})
