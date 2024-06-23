/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `OauthUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `OauthUser_id_key` ON `OauthUser`(`id`);
