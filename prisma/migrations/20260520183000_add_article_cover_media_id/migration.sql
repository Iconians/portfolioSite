-- AlterTable
ALTER TABLE "articles" ADD COLUMN "cover_media_id" TEXT;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_cover_media_id_fkey" FOREIGN KEY ("cover_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
