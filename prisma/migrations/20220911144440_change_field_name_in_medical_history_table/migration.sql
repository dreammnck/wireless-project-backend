/*
  Warnings:

  - You are about to drop the column `description` on the `MedicleHistory` table. All the data in the column will be lost.
  - Added the required column `medicalHistory` to the `MedicleHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `MedicleHistory` DROP COLUMN `description`,
    ADD COLUMN `medicalHistory` VARCHAR(191) NOT NULL;
