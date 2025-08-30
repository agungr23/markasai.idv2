import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page loads
    await expect(page).toHaveTitle(/MarkasAI/);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('AI untuk Bisnis yang Lebih Efektif & Efisien');
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Check if main navigation links are present and clickable
    const aboutLink = page.locator('nav').getByRole('link', { name: 'Perusahaan' });
    const productsLink = page.locator('nav').getByRole('link', { name: 'Solusi' });
    const pricingLink = page.locator('nav').getByRole('link', { name: 'Pricing' });
    const contactLink = page.locator('nav').getByRole('link', { name: 'Contact' });
    
    await expect(aboutLink).toBeVisible();
    await expect(productsLink).toBeVisible();
    await expect(pricingLink).toBeVisible();
    await expect(contactLink).toBeVisible();
  });

  test('should have working CTA buttons', async ({ page }) => {
    await page.goto('/');
    
    // Check primary CTA button
    const primaryCTA = page.getByRole('link', { name: 'Lihat Solusi AI' });
    await expect(primaryCTA).toBeVisible();
    await expect(primaryCTA).toHaveAttribute('href', '/products');
    
    // Check secondary CTA button
    const secondaryCTA = page.getByRole('link', { name: 'Jadwalkan Demo' });
    await expect(secondaryCTA).toBeVisible();
    await expect(secondaryCTA).toHaveAttribute('href', '/contact');
  });

  test('should display value pillars section', async ({ page }) => {
    await page.goto('/');
    
    // Check if value pillars are displayed
    await expect(page.locator('text=Newbie Friendly')).toBeVisible();
    await expect(page.locator('text=Tutorial & Support')).toBeVisible();
    await expect(page.locator('text=Komunitas')).toBeVisible();
    await expect(page.locator('text=Up To Date')).toBeVisible();
  });

  test('should display product grid', async ({ page }) => {
    await page.goto('/');
    
    // Check if products are displayed
    await expect(page.locator('text=VIDABOT')).toBeVisible();
    await expect(page.locator('text=AI Business Assistant')).toBeVisible();
    await expect(page.locator('text=AI Copy & Marketing')).toBeVisible();
    await expect(page.locator('text=AI Customer Support')).toBeVisible();
  });

  test('should have responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check if mobile menu button is visible
    const mobileMenuButton = page.locator('button').filter({ hasText: /menu/i });
    await expect(mobileMenuButton).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    
    // Check if desktop navigation is visible
    const desktopNav = page.locator('nav').first();
    await expect(desktopNav).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('should navigate to products page', async ({ page }) => {
    await page.goto('/');
    
    // Click on products link
    await page.getByRole('link', { name: 'Lihat Solusi AI' }).click();
    
    // Check if we're on products page
    await expect(page).toHaveURL('/products');
    await expect(page.locator('h1')).toContainText('Solusi AI');
  });

  test('should navigate to contact page', async ({ page }) => {
    await page.goto('/');
    
    // Click on contact link
    await page.getByRole('link', { name: 'Jadwalkan Demo' }).click();
    
    // Check if we're on contact page
    await expect(page).toHaveURL('/contact');
    await expect(page.locator('h1')).toContainText('Diskusikan');
  });

  test('should navigate to about page', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to about page through footer or other link
    await page.goto('/about');
    
    // Check if we're on about page
    await expect(page).toHaveURL('/about');
    await expect(page.locator('h1')).toContainText('Memberdayakan Bisnis');
  });
});

test.describe('Performance', () => {
  test('should load within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /AI untuk bisnis/i);
    
    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /MarkasAI/i);
  });
});
