/*
  Warnings:

  - You are about to drop the column `professorId` on the `User` table. All the data in the column will be lost.
  - Added the required column `professorId` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Class" ADD COLUMN     "professorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "professorId";

-- AddForeignKey
ALTER TABLE "public"."Class" ADD CONSTRAINT "Class_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
