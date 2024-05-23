/*
  Warnings:

  - The primary key for the `Subscriber` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `ActivationCode` DROP FOREIGN KEY `ActivationCode_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_userId_fkey`;

-- DropForeignKey
ALTER TABLE `CommentRating` DROP FOREIGN KEY `CommentRating_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Subscriber` DROP FOREIGN KEY `Subscriber_channelId_fkey`;

-- DropForeignKey
ALTER TABLE `Subscriber` DROP FOREIGN KEY `Subscriber_subscriberId_fkey`;

-- DropForeignKey
ALTER TABLE `Video` DROP FOREIGN KEY `Video_userId_fkey`;

-- DropForeignKey
ALTER TABLE `VideoRating` DROP FOREIGN KEY `VideoRating_userId_fkey`;

-- DropIndex
DROP INDEX `User_id_key` ON `User`;

-- AlterTable
ALTER TABLE `ActivationCode` MODIFY `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Comment` MODIFY `userId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `CommentRating` MODIFY `userId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `OauthUser` MODIFY `accessToken` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `Subscriber` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `subscriberId` VARCHAR(191) NULL,
    MODIFY `channelId` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Video` MODIFY `userId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `VideoRating` MODIFY `userId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `ActivationCode` ADD CONSTRAINT `ActivationCode_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentRating` ADD CONSTRAINT `CommentRating_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoRating` ADD CONSTRAINT `VideoRating_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Video` ADD CONSTRAINT `Video_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscriber` ADD CONSTRAINT `Subscriber_subscriberId_fkey` FOREIGN KEY (`subscriberId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscriber` ADD CONSTRAINT `Subscriber_channelId_fkey` FOREIGN KEY (`channelId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
