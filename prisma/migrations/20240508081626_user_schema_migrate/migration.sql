/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[activationCodeId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `activationCodeId` INTEGER NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `ActivationCode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `ActivationCode_id_key`(`id`),
    UNIQUE INDEX `ActivationCode_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_id_key` ON `User`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `User_activationCodeId_key` ON `User`(`activationCodeId`);

-- AddForeignKey
ALTER TABLE `ActivationCode` ADD CONSTRAINT `ActivationCode_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
