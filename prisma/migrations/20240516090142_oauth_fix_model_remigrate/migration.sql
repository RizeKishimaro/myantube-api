/*
  Warnings:

  - You are about to drop the column `firstName` on the `OauthUser` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `OauthUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `OauthUser` DROP COLUMN `firstName`,
    DROP COLUMN `lastName`,
    ADD COLUMN `name` VARCHAR(191) NULL,
    MODIFY `provider` VARCHAR(191) NULL,
    MODIFY `providerId` VARCHAR(191) NULL;
