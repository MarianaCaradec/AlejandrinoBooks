-- DropForeignKey
ALTER TABLE `book` DROP FOREIGN KEY `Book_categoryId_fkey`;

-- DropIndex
DROP INDEX `user_password_key` ON `user`;

-- AddForeignKey
ALTER TABLE `book` ADD CONSTRAINT `book_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
