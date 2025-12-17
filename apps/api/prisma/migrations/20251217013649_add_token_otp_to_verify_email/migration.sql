/*
  Warnings:

  - You are about to drop the column `active` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `tokens` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expires_at` to the `tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "TokenType" ADD VALUE 'EMAIL_VERIFICATION';

-- AlterTable
ALTER TABLE "tokens" ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "token" TEXT NOT NULL,
ADD COLUMN     "used_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" DROP COLUMN "active";

-- CreateIndex
CREATE UNIQUE INDEX "tokens_token_key" ON "tokens"("token");

-- CreateIndex
CREATE INDEX "tokens_user_id_type_idx" ON "tokens"("user_id", "type");
