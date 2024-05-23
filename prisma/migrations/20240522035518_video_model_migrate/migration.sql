/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `dislikes` on the `VideoRating` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `VideoRating` table. All the data in the column will be lost.
  - You are about to drop the `Dislike` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `View` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `userId` on table `Video` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Dislike` DROP FOREIGN KEY `Dislike_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Dislike` DROP FOREIGN KEY `Dislike_videoId_fkey`;

-- DropForeignKey
ALTER TABLE `Like` DROP FOREIGN KEY `Like_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Like` DROP FOREIGN KEY `Like_videoId_fkey`;

-- DropForeignKey
ALTER TABLE `Video` DROP FOREIGN KEY `Video_userId_fkey`;

-- DropForeignKey
ALTER TABLE `View` DROP FOREIGN KEY `View_userId_fkey`;

-- DropForeignKey
ALTER TABLE `View` DROP FOREIGN KEY `View_videoId_fkey`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Video` DROP COLUMN `createdAt`,
    ADD COLUMN `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `VideoRating` DROP COLUMN `dislikes`,
    DROP COLUMN `likes`;

-- DropTable
DROP TABLE `Dislike`;

-- DropTable
DROP TABLE `Like`;

-- DropTable
DROP TABLE `View`;

-- CreateTable
CREATE TABLE `VideoLike` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `videoId` INTEGER NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `oauthUserId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VideoDislike` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `videoId` INTEGER NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `oauthUserId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Views` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `videoId` INTEGER NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `oauthUserId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VideoLike` ADD CONSTRAINT `VideoLike_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoLike` ADD CONSTRAINT `VideoLike_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoLike` ADD CONSTRAINT `VideoLike_oauthUserId_fkey` FOREIGN KEY (`oauthUserId`) REFERENCES `OauthUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoDislike` ADD CONSTRAINT `VideoDislike_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoDislike` ADD CONSTRAINT `VideoDislike_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoDislike` ADD CONSTRAINT `VideoDislike_oauthUserId_fkey` FOREIGN KEY (`oauthUserId`) REFERENCES `OauthUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Views` ADD CONSTRAINT `Views_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Views` ADD CONSTRAINT `Views_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Views` ADD CONSTRAINT `Views_oauthUserId_fkey` FOREIGN KEY (`oauthUserId`) REFERENCES `OauthUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Video` ADD CONSTRAINT `Video_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
