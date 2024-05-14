import { ZodTypeProvider } from "fastify-type-provider-zod"
import { FastifyInstance } from "fastify"
import { prisma } from "../lib/prisma"
import { z } from "zod"

export async function createTask(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/tasks', {
        schema: {
            body: z.object({
                title: z.string().trim().min(3),
                description: z.string().trim().min(3),
                priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).refine(
                    (value) => value !== undefined && value !== null,
                    'Priority is required',
                ),
                subTasks: z.array(
                    z.object({
                      title: z.string().trim().min(3),
                      description: z.string().trim().min(3),
                      priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
                    })
                  ).optional(),
            }),

            response: {
                201: z.object({
                    taskId: z.string().uuid()
                })
            }
        }
        
    }, async (request, reply) =>{
        const {
            title,
            description,
            priority,
            subTasks
        } = request.body

        const task = await prisma.task.create({
            data: {
                title,
                description,
                priority,
                subTasks: {
                    create: subTasks?.map((subTask) => ({
                      title: subTask.title,
                      description: subTask.description,
                      priority: subTask.priority,
                    })),
                }
            }
        })
        return reply.status(201).send({ taskId: task.id })
    })
}