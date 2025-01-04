/*
  Warnings:

  - A unique constraint covering the columns `[user_id,ticket_id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "payments_ticket_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "payments_user_id_ticket_id_key" ON "payments"("user_id", "ticket_id");
