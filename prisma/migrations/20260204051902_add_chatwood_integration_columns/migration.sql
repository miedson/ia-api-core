-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'suspended');

-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('agent', 'administrator');

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "chatwoot_account_id" INTEGER,
ADD COLUMN     "domain" TEXT,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'active',
ADD COLUMN     "support_email" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "chatwoot_user_id" INTEGER,
ADD COLUMN     "display_name" TEXT,
ADD COLUMN     "role" "Roles" NOT NULL DEFAULT 'agent';
