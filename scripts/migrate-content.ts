import { db } from "../src/lib/db/client";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { hash } from "bcryptjs";
import { review } from "../src/app/utils/reviews";
import { portfolioItems } from "../src/app/utils/PorfolioItems";

async function migrateArticles(userId: string) {
  const postsPath = join(process.cwd(), "src/app/lib/content/posts");
  const files = readdirSync(postsPath).filter((f) => f.endsWith(".mdx"));

  console.log(`Found ${files.length} article files to migrate`);

  for (const file of files) {
    const filePath = join(postsPath, file);
    const source = readFileSync(filePath, "utf8");
    const { content, data } = matter(source);

    // Generate slug from filename
    const slug = file
      .replace(".mdx", "")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    try {
      // Check if article already exists
      const existing = await db.article.findUnique({ where: { slug } });

      if (existing) {
        console.log(`⊘ Article already exists: ${data.title}`);
      } else {
        await db.article.create({
          data: {
            title: data.title || "Untitled",
            slug,
            content,
            description: data.description || null,
            date: data.date ? new Date(data.date) : new Date(),
            tags: data.tags || [],
            featured: data.featured || false,
            status: "published",
            publishedAt: data.date ? new Date(data.date) : new Date(),
            createdBy: userId,
          },
        });
        console.log(`✓ Migrated article: ${data.title}`);
      }
    } catch (error) {
      console.error(`✗ Failed to migrate ${file}:`, error);
    }
  }
}

async function migrateReviews(userId: string) {
  console.log(`Found ${review.length} reviews to migrate`);

  for (const item of review) {
    try {
      // Check if review already exists (by title)
      const existing = await db.review.findFirst({
        where: { title: item.title },
      });

      if (existing) {
        console.log(`⊘ Review already exists: ${item.title}`);
      } else {
        await db.review.create({
          data: {
            title: item.title,
            content: item.p,
            stars: item.stars,
            createdBy: userId,
          },
        });
        console.log(`✓ Migrated review: ${item.title}`);
      }
    } catch (error) {
      console.error(`✗ Failed to migrate review ${item.title}:`, error);
    }
  }
}

async function migratePortfolio(userId: string) {
  console.log(`Found ${portfolioItems.length} portfolio items to migrate`);

  for (const item of portfolioItems) {
    try {
      // Check if portfolio item already exists (by caption)
      const existing = await db.portfolio.findFirst({
        where: { caption: item.caption },
      });

      if (existing) {
        console.log(`⊘ Portfolio item already exists: ${item.caption}`);
      } else {
        await db.portfolio.create({
          data: {
            img: item.img,
            caption: item.caption,
            description: item.desc,
            category: item.category,
            url: item.url && item.url !== "#" ? item.url : null,
            github: item.github && item.github !== "#" ? item.github : null,
            createdBy: userId,
          },
        });
        console.log(`✓ Migrated portfolio item: ${item.caption}`);
      }
    } catch (error) {
      console.error(`✗ Failed to migrate portfolio ${item.caption}:`, error);
    }
  }
}

async function createAdminUser() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const passwordHash = await hash(password, 10);

  try {
    const user = await db.user.upsert({
      where: { email },
      update: {
        passwordHash, // Update password if user exists
        role: "admin",
      },
      create: {
        email,
        passwordHash,
        role: "admin",
      },
    });

    console.log(`✓ Admin user created/updated: ${email}`);
    return user.id;
  } catch (error) {
    console.error("✗ Failed to create admin user:", error);
    throw error;
  }
}

// No longer needed - we pass userId directly to migration functions

async function main() {
  console.log("Starting migration...\n");

  try {
    // Create admin user first
    const userId = await createAdminUser();
    console.log("");

    // Migrate content with actual user ID
    await migrateArticles(userId);
    console.log("");
    await migrateReviews(userId);
    console.log("");
    await migratePortfolio(userId);
    console.log("");

    console.log("✓ Migration completed successfully!");
  } catch (error) {
    console.error("✗ Migration failed:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

main();
