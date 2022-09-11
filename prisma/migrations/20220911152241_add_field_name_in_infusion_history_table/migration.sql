/*
  Warnings:

  - Added the required column `serialNumber` to the `InfusionHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `InfusionHistory` ADD COLUMN `serialNumber` VARCHAR(191) NOT NULL;
