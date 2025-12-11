/*
  Warnings:

  - You are about to drop the column `organizations_id` on the `invites` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `invites` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `members` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email,organization_id]` on the table `invites` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organization_id,user_id]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organization_id` to the `invites` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "invites" DROP CONSTRAINT "invites_organizations_id_fkey";

-- DropForeignKey
ALTER TABLE "invites" DROP CONSTRAINT "invites_userId_fkey";

-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_userId_fkey";

-- DropIndex
DROP INDEX "invites_organizations_id_userId_key";

-- DropIndex
DROP INDEX "members_organization_id_userId_key";

-- AlterTable
ALTER TABLE "invites" DROP COLUMN "organizations_id",
DROP COLUMN "userId",
ADD COLUMN     "organization_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "members" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "invites_email_idx" ON "invites"("email");

-- CreateIndex
CREATE UNIQUE INDEX "invites_email_organization_id_key" ON "invites"("email", "organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "members_organization_id_user_id_key" ON "members"("organization_id", "user_id");

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
