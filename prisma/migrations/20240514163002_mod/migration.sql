/*
  Warnings:

  - You are about to drop the `SubTask` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SubTask" DROP CONSTRAINT "SubTask_taskId_fkey";

-- DropTable
DROP TABLE "SubTask";

-- CreateTable
CREATE TABLE "sub-tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "Priority",
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endAt" TIMESTAMP(3),
    "taskId" TEXT NOT NULL,

    CONSTRAINT "sub-tasks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sub-tasks" ADD CONSTRAINT "sub-tasks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
