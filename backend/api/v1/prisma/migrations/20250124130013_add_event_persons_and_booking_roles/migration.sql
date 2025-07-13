-- CreateEnum
CREATE TYPE "Rank" AS ENUM ('NEWBIE', 'BRONZE', 'SILVER', 'GOLD', 'PRO');

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_user_id_fkey";

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "booked_by_id" TEXT,
ADD COLUMN     "guest_email" TEXT,
ADD COLUMN     "guest_name" TEXT,
ADD COLUMN     "guest_phone" TEXT,
ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "rank" "Rank" NOT NULL DEFAULT 'NEWBIE';

-- CreateTable
CREATE TABLE "persons" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "bio" TEXT,
    "image_url" TEXT,

    CONSTRAINT "persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_persons" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,

    CONSTRAINT "event_persons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_persons_event_id_person_id_key" ON "event_persons"("event_id", "person_id");

-- AddForeignKey
ALTER TABLE "event_persons" ADD CONSTRAINT "event_persons_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_persons" ADD CONSTRAINT "event_persons_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_booked_by_id_fkey" FOREIGN KEY ("booked_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
