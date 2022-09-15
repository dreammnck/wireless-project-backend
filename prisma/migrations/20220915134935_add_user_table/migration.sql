/*
  Warnings:

  - You are about to drop the column `doctor` on the `InfusionHistory` table. All the data in the column will be lost.
  - You are about to drop the column `class` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `nurse` to the `InfusionHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `InfusionHistory` DROP COLUMN `doctor`,
    ADD COLUMN `nurse` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Patient` DROP COLUMN `class`;

-- DropTable
DROP TABLE `Admin`;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `role` ENUM('DOCTOR', 'NURSE') NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
