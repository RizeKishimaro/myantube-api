-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Subscriber` DROP FOREIGN KEY `Subscriber_channelId_fkey`;

-- DropForeignKey
ALTER TABLE `Subscriber` DROP FOREIGN KEY `Subscriber_subscriberId_fkey`;

-- DropForeignKey
ALTER TABLE `Video` DROP FOREIGN KEY `Video_userId_fkey`;

-- AlterTable
ALTER TABLE `Comment` ADD COLUMN `oauthUserId` VARCHAR(191) NULL,
    MODIFY `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `CommentRating` ADD COLUMN `oauthUserId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Subscriber` ADD COLUMN `oauthChannelId` VARCHAR(191) NULL,
    ADD COLUMN `oauthSubscriberId` VARCHAR(191) NULL,
    MODIFY `subscriberId` INTEGER NULL,
    MODIFY `channelId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Video` ADD COLUMN `oauthUserId` VARCHAR(191) NULL,
    MODIFY `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `VideoRating` ADD COLUMN `oauthUserId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `OauthUser` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `picture` VARCHAR(191) NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerId` VARCHAR(191) NOT NULL,
    `accessToken` VARCHAR(191) NULL,

    UNIQUE INDEX `OauthUser_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_oauthUserId_fkey` FOREIGN KEY (`oauthUserId`) REFERENCES `OauthUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentRating` ADD CONSTRAINT `CommentRating_oauthUserId_fkey` FOREIGN KEY (`oauthUserId`) REFERENCES `OauthUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoRating` ADD CONSTRAINT `VideoRating_oauthUserId_fkey` FOREIGN KEY (`oauthUserId`) REFERENCES `OauthUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Video` ADD CONSTRAINT `Video_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Video` ADD CONSTRAINT `Video_oauthUserId_fkey` FOREIGN KEY (`oauthUserId`) REFERENCES `OauthUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscriber` ADD CONSTRAINT `Subscriber_subscriberId_fkey` FOREIGN KEY (`subscriberId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscriber` ADD CONSTRAINT `Subscriber_channelId_fkey` FOREIGN KEY (`channelId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscriber` ADD CONSTRAINT `Subscriber_oauthSubscriberId_fkey` FOREIGN KEY (`oauthSubscriberId`) REFERENCES `OauthUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscriber` ADD CONSTRAINT `Subscriber_oauthChannelId_fkey` FOREIGN KEY (`oauthChannelId`) REFERENCES `OauthUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
