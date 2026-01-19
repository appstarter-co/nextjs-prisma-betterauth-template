import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const baseURL = process.env.BASE_URL || 'http://localhost:3000';

test('User can log in with valid credentials', async ({ page }) => {
  await page.goto(`${baseURL}/login`);

  // Fill email and password using correct labels/placeholders
  await page.getByLabel('email').fill('example@yahoo.com');
  await page.getByLabel('password').fill('password!');

  // Click sign in button
  await page.getByRole('button', { name: /^sign in$/i }).click();

  // Expect redirect to dashboard (or dashboard content visible)
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByText(/dashboard/i)).toBeVisible();
});