/*
  Warnings:

  - You are about to drop the column `createdAT` on the `SubTask` table. All the data in the column will be lost.
  - You are about to drop the column `endAT` on the `SubTask` table. All the data in the column will be lost.
  - You are about to drop the column `createdAT` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `endAT` on the `tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SubTask" DROP COLUMN "createdAT",
DROP COLUMN "endAT",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "createdAT",
DROP COLUMN "endAT",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endAt" TIMESTAMP(3);
