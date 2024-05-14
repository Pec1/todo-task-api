import { ZodTypeProvider } from "fastify-type-provider-zod";
import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function addSubTask(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().put('/tasks/:identifier/subtasks', {
        schema: {
            params: z.object({
                identifier: z.string(),
            }),
            body: z.object({
                title: z.string().trim().min(3),
                description: z.string().trim().min(3),
                priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
            }),
        },
    }, async (request, reply) => {
        const { identifier } = request.params;
        const { title, description, priority } = request.body;

        try {
            const task = await prisma.task.findUnique({
                where: { id: identifier },
                include: { subTasks: true },
            });

            if (!task) {
                throw new Error('Task not found.');
            }

            const newSubTask = await prisma.subTask.create({
                data: {
                    title,
                    description,
                    priority,
                    completed: false,
                    taskId: identifier,
                },
            });

            return reply.status(200).send({ message: 'Subtask created successfully', newSubTask });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ message: 'Failed to create subtask' });
        }
    });
}
