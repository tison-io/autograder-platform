import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display the login form correctly', async ({ page }) => {
    await expect(page.locator('text=Welcome Back')).toBeVisible();
    await expect(page.locator('input[placeholder="Email Address"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Wait for error response
    await expect(page.locator('text=Invalid email or password')).toBeVisible({ timeout: 5000 });
  });

  test('should log in successfully with valid credentials', async ({ page }) => {

    await page.route('http://localhost:5000/auth/login', async route => {
      const mockResponse = {
        message: 'Login successful',
        user: {
          _id: '68f0bedf27fb63d641e70d44',
          fullname: 'John Doe',
          email: 'john.doe@example.com',
        },
        accessToken: 'mocked-access-token'
      };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse),
      });
    });

    // Fill login form
    await page.fill('input[name="email"]', 'john.doe@example.com');
    await page.fill('input[name="password"]', 'correctpassword');
    await page.click('button[type="submit"]');

    // Wait for success message
    await expect(page.locator('text=Login successful!')).toBeVisible({ timeout: 5000 });

    // Confirm redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
  });
});
