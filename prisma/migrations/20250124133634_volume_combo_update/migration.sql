-- AlterTable
ALTER TABLE "Combo" ADD COLUMN     "settings" JSONB;

-- AlterTable
ALTER TABLE "Volume" ADD COLUMN     "layout" TEXT,
ADD COLUMN     "settings" JSONB;
