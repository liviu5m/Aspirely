-- AlterTable
ALTER TABLE `User` ADD COLUMN `age` INTEGER NULL,
    ADD COLUMN `certificates` VARCHAR(500) NULL,
    ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `country` VARCHAR(191) NULL,
    ADD COLUMN `education` VARCHAR(191) NULL,
    ADD COLUMN `experiences` VARCHAR(500) NULL,
    ADD COLUMN `interests` VARCHAR(500) NULL,
    ADD COLUMN `personality` VARCHAR(500) NULL,
    ADD COLUMN `skills` VARCHAR(500) NULL;
