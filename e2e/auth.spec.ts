import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should show login form when not authenticated', async ({ page }) => {
    await page.goto('/')
    
    // Should show login form
    await expect(page.locator('h1')).toContainText('Sprint Coach')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('should toggle between sign in and sign up', async ({ page }) => {
    await page.goto('/')
    
    // Should start with sign in
    await expect(page.locator('button[type="submit"]')).toContainText('Sign In')
    
    // Click toggle to sign up
    await page.click('text="Don\'t have an account? Sign up"')
    await expect(page.locator('button[type="submit"]')).toContainText('Sign Up')
    
    // Click toggle back to sign in
    await page.click('text="Already have an account? Sign in"')
    await expect(page.locator('button[type="submit"]')).toContainText('Sign In')
  })

  test('should validate email field', async ({ page }) => {
    await page.goto('/')
    
    // Try to submit with invalid email
    await page.fill('input[type="email"]', 'invalid-email')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // Should show validation error
    await expect(page.locator('text="Invalid email address"')).toBeVisible()
  })

  test('should validate password field', async ({ page }) => {
    await page.goto('/')
    
    // Try to submit with short password
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', '12345')
    await page.click('button[type="submit"]')
    
    // Should show validation error
    await expect(page.locator('text="Password must be at least 6 characters"')).toBeVisible()
  })
})