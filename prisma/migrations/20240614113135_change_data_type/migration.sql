/*
  Warnings:

  - A unique constraint covering the columns `[urlHd]` on the table `Video` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[urlSd]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Video_urlHd_key` ON `Video`(`urlHd`);

-- CreateIndex
CREATE UNIQUE INDEX `Video_urlSd_key` ON `Video`(`urlSd`);
