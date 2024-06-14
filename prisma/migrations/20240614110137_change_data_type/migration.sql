/*
  Warnings:

  - You are about to alter the column `poster` on the `Video` table. The data in that column could be lost. The data in that column will be cast from `VarChar(3000)` to `VarChar(500)`.
  - You are about to alter the column `urlHd` on the `Video` table. The data in that column could be lost. The data in that column will be cast from `VarChar(3000)` to `VarChar(500)`.
  - You are about to alter the column `urlSd` on the `Video` table. The data in that column could be lost. The data in that column will be cast from `VarChar(3000)` to `VarChar(500)`.

*/
-- AlterTable
ALTER TABLE `Video` MODIFY `poster` VARCHAR(500) NULL,
    MODIFY `urlHd` VARCHAR(500) NULL,
    MODIFY `urlSd` VARCHAR(500) NULL;
