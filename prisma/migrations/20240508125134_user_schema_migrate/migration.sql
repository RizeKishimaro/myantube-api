/*
  Warnings:

  - You are about to drop the column `activationCodeId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `ActivationCode` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `User_activationCodeId_key` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `activationCodeId`,
    ADD COLUMN `password` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `ActivationCode_code_key` ON `ActivationCode`(`code`);
