-- CreateTable
CREATE TABLE `UserBlock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `start_day` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `days` INTEGER NOT NULL,
    `end_day` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
