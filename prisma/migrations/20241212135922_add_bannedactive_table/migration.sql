/*
  Warnings:

  - You are about to drop the `bannedlist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `bannedlist`;

-- CreateTable
CREATE TABLE `BannedActive` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ban_active` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
