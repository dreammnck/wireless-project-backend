/*
  Warnings:

  - You are about to drop the column `serialNumber` on the `InfusionHistory` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `Patient` table. All the data in the column will be lost.
  - Added the required column `addressId` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthDate` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergencyPhoneNumber` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `InfusionHistory` DROP COLUMN `serialNumber`;

-- AlterTable
ALTER TABLE `Patient` DROP COLUMN `age`,
    ADD COLUMN `addressId` INTEGER NOT NULL,
    ADD COLUMN `birthDate` VARCHAR(191) NOT NULL,
    ADD COLUMN `emergencyPhoneNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `province` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `subDistrict` VARCHAR(191) NOT NULL,
    `zipCode` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Patient` ADD CONSTRAINT `Patient_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
