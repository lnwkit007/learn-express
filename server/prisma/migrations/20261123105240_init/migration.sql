-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` ENUM('admin', 'employee') NOT NULL DEFAULT 'employee';
