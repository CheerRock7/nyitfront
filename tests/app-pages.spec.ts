import { expect, test, type Page } from "@playwright/test";

const publicRoutes = ["/", "/products", "/builder", "/login", "/register", "/settings"];

function collectPageProblems(page: Page) {
  const problems: string[] = [];
  page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") problems.push(`console: ${message.text()}`);
  });
  return problems;
}

async function expectHealthyPage(page: Page, problems: string[]) {
  await expect(page.locator("body")).toBeVisible();
  await expect(page.locator("h1").first()).toBeVisible();
  await expect(page.getByText("Runtime Error")).toHaveCount(0);
  await expect(page.getByText("Console Error")).toHaveCount(0);
  await expect(page.getByText("An error occurred in the Server Components render")).toHaveCount(0);
  expect(problems).toEqual([]);
}

test.describe("app pages", () => {
  for (const route of publicRoutes) {
    test(`loads ${route}`, async ({ page }) => {
      const problems = collectPageProblems(page);
      await page.goto(route);
      await expectHealthyPage(page, problems);
    });
  }

  test("loads a real product detail page from the product listing", async ({ page }) => {
    const problems = collectPageProblems(page);
    await page.goto("/products");

    const productLink = page.locator('main a[href^="/products/"]').first();
    await expect(productLink).toBeVisible();
    await productLink.click();

    await expect(page).toHaveURL(/\/products\/[^/?#]+$/);
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page.locator("main aside").getByRole("button").first()).toBeVisible();
    await expectHealthyPage(page, problems);
  });

  test("admin dashboard can show product controls for admin", async ({ page }) => {
    const problems = collectPageProblems(page);
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("nyit_auth_user_v1", JSON.stringify({ name: "Admin", email: "admin", username: "admin" }));
    });

    await page.goto("/admin");
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page.getByTestId("admin-product-toggle").first()).toBeVisible();
    await page.getByTestId("admin-section-banner").click();
    await expect(page.getByText("รูปโปรโมชั่นหน้าแรก")).toBeVisible();
    await expect(page.getByText("2048 x 715 px")).toBeVisible();
    await expectHealthyPage(page, problems);
  });

  test("home page shows the editable promotion image", async ({ page }) => {
    const problems = collectPageProblems(page);
    await page.goto("/");
    await expect(page.getByTestId("promotion-banner-image")).toBeVisible();
    await expectHealthyPage(page, problems);
  });
});
