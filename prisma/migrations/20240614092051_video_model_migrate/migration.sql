/*
  Warnings:

  - You are about to drop the column `url` on the `Video` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[urlHd]` on the table `Video` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[urlSd]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_videoId_fkey`;

-- DropForeignKey
ALTER TABLE `Video` DROP FOREIGN KEY `Video_oauthUserId_fkey`;

-- DropForeignKey
ALTER TABLE `Video` DROP FOREIGN KEY `Video_userId_fkey`;

-- DropForeignKey
ALTER TABLE `VideoDislike` DROP FOREIGN KEY `VideoDislike_videoId_fkey`;

-- DropForeignKey
ALTER TABLE `VideoLike` DROP FOREIGN KEY `VideoLike_videoId_fkey`;

-- DropForeignKey
ALTER TABLE `VideoRating` DROP FOREIGN KEY `VideoRating_videoId_fkey`;

-- DropForeignKey
ALTER TABLE `Views` DROP FOREIGN KEY `Views_videoId_fkey`;

-- DropIndex
DROP INDEX `Video_url_key` ON `Video`;

-- AlterTable
ALTER TABLE `Video` DROP COLUMN `url`,
    ADD COLUMN `urlHd` VARCHAR(191) NULL,
    ADD COLUMN `urlSd` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Video_urlHd_key` ON `Video`(`urlHd`);

-- CreateIndex
CREATE UNIQUE INDEX `Video_urlSd_key` ON `Video`(`urlSd`);

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoRating` ADD CONSTRAINT `VideoRating_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoLike` ADD CONSTRAINT `VideoLike_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoDislike` ADD CONSTRAINT `VideoDislike_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Views` ADD CONSTRAINT `Views_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Video` ADD CONSTRAINT `Video_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Video` ADD CONSTRAINT `Video_oauthUserId_fkey` FOREIGN KEY (`oauthUserId`) REFERENCES `OauthUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
