-- AlterTable
ALTER TABLE `post` ADD COLUMN `isChecked` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `BannedWord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `word` VARCHAR(191) NOT NULL,
    `banned_state` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
