-- CreateEnum
CREATE TYPE "InviteType" AS ENUM ('EMAIL', 'LINK');

-- AlterTable
ALTER TABLE "invites" ADD COLUMN     "type" "InviteType" NOT NULL DEFAULT 'EMAIL';
