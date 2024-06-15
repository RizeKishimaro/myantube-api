/*
  Warnings:

  - Added the required column `duration` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalUrl` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Video` ADD COLUMN `duration` INTEGER NOT NULL,
    ADD COLUMN `originalUrl` VARCHAR(191) NOT NULL;
