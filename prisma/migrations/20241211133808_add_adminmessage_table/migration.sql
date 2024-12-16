/*
  Warnings:

  - You are about to drop the column `content` on the `adminmessage` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `adminmessage` table. All the data in the column will be lost.
  - Added the required column `m_content` to the `AdminMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `m_title` to the `AdminMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `adminmessage` DROP COLUMN `content`,
    DROP COLUMN `title`,
    ADD COLUMN `m_content` VARCHAR(191) NOT NULL,
    ADD COLUMN `m_title` VARCHAR(191) NOT NULL;
