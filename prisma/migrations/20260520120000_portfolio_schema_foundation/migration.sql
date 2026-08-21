-- AlterTable
ALTER TABLE "portfolio" ADD COLUMN "slug" TEXT,
ADD COLUMN "subtitle" TEXT,
ADD COLUMN "summary" TEXT,
ADD COLUMN "problem" TEXT,
ADD COLUMN "solution" TEXT,
ADD COLUMN "architecture" TEXT,
ADD COLUMN "challenges" TEXT,
ADD COLUMN "lessons_learned" TEXT,
ADD COLUMN "future_improvements" TEXT,
ADD COLUMN "lifecycle_status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN "publish_status" TEXT NOT NULL DEFAULT 'published',
ADD COLUMN "start_date" TIMESTAMP(3),
ADD COLUMN "end_date" TIMESTAMP(3),
ADD COLUMN "sort_order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "gallery" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN "features" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN "responsibilities" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN "show_platform_section" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "platform_features" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "seo_title" TEXT,
ADD COLUMN "seo_description" TEXT,
ADD COLUMN "docs" TEXT,
ADD COLUMN "hero_media_id" TEXT,
ADD COLUMN "og_media_id" TEXT;

-- CreateTable
CREATE TABLE "portfolio_metrics" (
    "id" TEXT NOT NULL,
    "portfolio_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolio_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_versions" (
    "id" TEXT NOT NULL,
    "portfolio_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "version" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "portfolio_slug_key" ON "portfolio"("slug");

-- CreateIndex
CREATE INDEX "portfolio_slug_idx" ON "portfolio"("slug");

-- CreateIndex
CREATE INDEX "portfolio_publish_status_idx" ON "portfolio"("publish_status");

-- CreateIndex
CREATE INDEX "portfolio_metrics_portfolio_order_idx" ON "portfolio_metrics"("portfolio_id", "display_order");

-- CreateIndex
CREATE INDEX "project_versions_portfolio_order_idx" ON "project_versions"("portfolio_id", "sort_order");

-- AddForeignKey
ALTER TABLE "portfolio" ADD CONSTRAINT "portfolio_hero_media_id_fkey" FOREIGN KEY ("hero_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio" ADD CONSTRAINT "portfolio_og_media_id_fkey" FOREIGN KEY ("og_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_metrics" ADD CONSTRAINT "portfolio_metrics_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_versions" ADD CONSTRAINT "project_versions_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
