import { test, expect, describe, beforeAll, afterAll } from "bun:test";
import { db } from "@/lib/db/client";
import {
  createArticle,
  getAllArticles,
  getArticleBySlug,
} from "@/lib/data/articles";
import type { CreateArticleInput } from "@/lib/types/articles";

// Note: These tests require a test database
// Set TEST_DATABASE_URL in .env for running tests

describe("Article Data Access", () => {
  beforeAll(async () => {
    // Setup test database if needed
  });

  afterAll(async () => {
    // Cleanup test database if needed
    await db.$disconnect();
  });

  test("should get all published articles", async () => {
    const articles = await getAllArticles();
    expect(Array.isArray(articles)).toBe(true);
    // All articles should be published
    articles.forEach((article) => {
      expect(article.status).toBe("published");
    });
  });

  test("should get article by slug", async () => {
    // This would require a test article in the database
    // const article = await getArticleBySlug('test-slug')
    // expect(article).toBeDefined()
  });

  // Note: createArticle requires authentication
  // These tests would need to mock the requireAdmin function
});
