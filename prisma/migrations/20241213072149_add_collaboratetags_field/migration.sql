/*
  Warnings:

  - Added the required column `bannedtype` to the `BannedBehavior` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bannedbehavior` ADD COLUMN `bannedtype` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `post` ADD COLUMN `collaboratetags` VARCHAR(191) NULL;
