const { test, expect, describe, beforeEach } = require('@playwright/test')
// const { test, after, beforeEach, describe } = require('node:test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    
    const locatorUser = await page.getByText('username')
    await expect(locatorUser).toBeVisible()

    const locatorPass = await page.getByText('password')
    await expect(locatorPass).toBeVisible()
  })
})
