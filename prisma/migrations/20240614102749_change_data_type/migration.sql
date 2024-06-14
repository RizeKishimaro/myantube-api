-- DropIndex
DROP INDEX `Video_urlHd_key` ON `Video`;

-- DropIndex
DROP INDEX `Video_urlSd_key` ON `Video`;

-- AlterTable
ALTER TABLE `Video` MODIFY `poster` LONGTEXT NULL,
    MODIFY `urlHd` LONGTEXT NULL,
    MODIFY `urlSd` LONGTEXT NULL;
