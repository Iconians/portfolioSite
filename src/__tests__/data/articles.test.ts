import { test, expect, describe, beforeAll, afterAll } from "bun:test";

import { getAllArticles } from "@/lib/data/articles";
import { db } from "@/lib/db/client";

const testDatabaseUrl = process.env.TEST_DATABASE_URL?.trim();
const shouldRunArticleIntegrationTests = Boolean(testDatabaseUrl);

// Opt-in integration tests: set TEST_DATABASE_URL to a reachable Postgres database.
// Do not rely on developer DATABASE_URL or PROJECT_READ_SOURCE from .env.

describe("Article Data Access", () => {
  const previousDatabaseUrl = process.env.DATABASE_URL;

  beforeAll(() => {
    if (!shouldRunArticleIntegrationTests || !testDatabaseUrl) {
      return;
    }
    process.env.DATABASE_URL = testDatabaseUrl;
  });

  afterAll(async () => {
    if (shouldRunArticleIntegrationTests) {
      await db.$disconnect();
    }

    if (previousDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = previousDatabaseUrl;
    }
  });

  const articleIntegrationTest = shouldRunArticleIntegrationTests ? test : test.skip;

  articleIntegrationTest("should get all published articles", async () => {
    const articles = await getAllArticles();
    expect(Array.isArray(articles)).toBe(true);
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
