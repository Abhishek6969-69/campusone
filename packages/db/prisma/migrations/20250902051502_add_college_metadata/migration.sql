-- AlterTable
ALTER TABLE "public"."College" ADD COLUMN     "affiliation" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "type" TEXT,
ALTER COLUMN "domain" DROP NOT NULL;
