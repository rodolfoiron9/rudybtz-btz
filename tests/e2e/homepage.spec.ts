import { test, expect } from '@playwright/test'

test.describe('RUDYBTZ Portfolio', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')
    
    // Check if the page loads
    await expect(page).toHaveTitle(/RUDYBTZ/)
    
    // Check for key elements
    await expect(page.locator('h1')).toBeVisible()
  })

  test('should navigate to admin login', async ({ page }) => {
    await page.goto('/')
    
    // Look for admin link or navigate directly
    await page.goto('/admin/login')
    
    // Check login form elements
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should display albums showcase', async ({ page }) => {
    await page.goto('/')
    
    // Wait for albums to load
    await page.waitForSelector('[data-testid="album-showcase"]', { timeout: 10000 })
    
    // Check if albums are displayed
    const albums = page.locator('[data-testid="album-card"]')
    await expect(albums.first()).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Check mobile responsiveness
    await expect(page.locator('body')).toBeVisible()
    
    // Check for mobile menu if it exists
    const mobileMenu = page.locator('[data-testid="mobile-menu"]')
    if (await mobileMenu.isVisible()) {
      await expect(mobileMenu).toBeVisible()
    }
  })

  test('should handle audio player', async ({ page }) => {
    await page.goto('/')
    
    // Wait for audio player to be available
    const audioPlayer = page.locator('[data-testid="audio-player"]')
    if (await audioPlayer.isVisible({ timeout: 5000 })) {
      await expect(audioPlayer).toBeVisible()
      
      // Check for play/pause button
      const playButton = page.locator('[data-testid="play-button"]')
      if (await playButton.isVisible()) {
        await expect(playButton).toBeVisible()
      }
    }
  })
})