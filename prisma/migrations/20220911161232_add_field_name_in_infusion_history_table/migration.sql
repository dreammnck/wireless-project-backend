/*
  Warnings:

  - Added the required column `doctor` to the `InfusionHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `InfusionHistory` ADD COLUMN `doctor` VARCHAR(191) NOT NULL;
