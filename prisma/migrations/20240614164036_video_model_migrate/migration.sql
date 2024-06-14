/*
  Warnings:

  - A unique constraint covering the columns `[urlHdHash]` on the table `Video` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[urlSdHash]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Video_urlHd_key` ON `Video`;

-- DropIndex
DROP INDEX `Video_urlSd_key` ON `Video`;

-- AlterTable
ALTER TABLE `Video` ADD COLUMN `urlHdHash` VARCHAR(191) NULL,
    ADD COLUMN `urlSdHash` VARCHAR(191) NULL,
    MODIFY `poster` TEXT NULL,
    MODIFY `urlHd` TEXT NULL,
    MODIFY `urlSd` TEXT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Video_urlHdHash_key` ON `Video`(`urlHdHash`);

-- CreateIndex
CREATE UNIQUE INDEX `Video_urlSdHash_key` ON `Video`(`urlSdHash`);
