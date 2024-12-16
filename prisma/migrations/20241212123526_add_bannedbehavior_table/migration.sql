-- CreateTable
CREATE TABLE `BannedBehavior` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `senderId` VARCHAR(191) NOT NULL,
    `receiverId` VARCHAR(191) NOT NULL,
    `bannedword` VARCHAR(191) NOT NULL,
    `send_content` VARCHAR(191) NOT NULL,
    `send_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
