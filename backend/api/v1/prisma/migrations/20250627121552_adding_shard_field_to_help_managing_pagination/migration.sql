-- AlterTable
ALTER TABLE "event_categories" ADD COLUMN     "shard" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "event_reviews" ADD COLUMN     "shard" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "shard" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "shard" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "payment_attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "reservation_expires_at" TIMESTAMP(3),
ADD COLUMN     "shard" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "payment_method" DROP NOT NULL,
ALTER COLUMN "payment_method" DROP DEFAULT;

-- AlterTable
ALTER TABLE "post_comments" ADD COLUMN     "shard" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "post_likes" ADD COLUMN     "shard" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "post_tags" ADD COLUMN     "shard" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "shard" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "refunds" ADD COLUMN     "shard" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "saved_events" ADD COLUMN     "shard" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ticket_inventory" ADD COLUMN     "shard" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ticket_types" ADD COLUMN     "shard" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "shard" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "venues" ADD COLUMN     "shard" INTEGER NOT NULL DEFAULT 0;
