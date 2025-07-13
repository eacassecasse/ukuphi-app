/*
  Warnings:

  - You are about to drop the column `image_url` on the `events` table. All the data in the column will be lost.
  - Added the required column `imageURL` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "image_url",
ADD COLUMN     "imageURL" TEXT NOT NULL;
