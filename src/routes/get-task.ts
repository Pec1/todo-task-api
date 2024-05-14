import { ZodTypeProvider } from "fastify-type-provider-zod"
import { FastifyInstance } from "fastify"
import { prisma } from "../lib/prisma"
import { z } from "zod"

export async function getTask(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/tasks/:identifier', {
        schema: {
            params: z.object({
                identifier: z.string(),
            }),
            response: { 
                200: z.object({
                    task: z.object({
                        id: z.string(),     
                        title: z.string(),
                        description: z.string(),
                        priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
                        completed: z.boolean(),
                        createdAt: z.string(),
                        endAt: z.string().optional().nullable() ,
                        subTasks: z.array(z.object({
                            id: z.string().uuid(),
                            title: z.string(),
                            description: z.string(),
                            priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
                            completed: z.boolean(),
                            createdAt: z.string(),
                            endAt: z.string().optional().nullable() ,
                        })).optional(),
                    })
                })
            }
        }
    }, async (request, reply) => {
        const { identifier } = request.params

        let task

        if (z.string().uuid().safeParse(identifier).success) {
            task = await prisma.task.findUnique({
                select: {
                    id: true,
                    title: true,
                    description: true,
                    priority: true,
                    completed: true,
                    createdAt: true,
                    endAt: true,
                    subTasks: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            priority: true,
                            completed: true,
                            createdAt: true,
                            endAt: true,
                        }
                    }
                },
                where: {
                    id: identifier
                }
            })
        } else {
            task = await prisma.task.findUnique({
                select: {
                    id: true,
                    title: true,
                    description: true,
                    priority: true,
                    completed: true,
                    createdAt: true,
                    endAt: true,
                    subTasks: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            priority: true,
                            completed: true,
                            createdAt: true,
                            endAt: true,
                        }
                    }
                },
                where: {
                    id: identifier
                }
            })
        }

        if (task === null) {
            throw new Error('Tarefa não encontrada.')
        }

        return reply.send({ 
            task: {
                id: task.id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                completed: task.completed,
                createdAt: task.createdAt.toLocaleDateString('pt-BR'),
                endAt: task.endAt?.toLocaleDateString('pt-BR'),
                subTasks: task.subTasks.map(subTask => {
                    return {
                        id: subTask.id,
                        title: subTask.title,
                        description: subTask.description,
                        priority: subTask.priority ?? undefined,
                        completed: subTask.completed,
                        createdAt: subTask.createdAt.toLocaleDateString('pt-BR'),
                        endAt: subTask.endAt?.toLocaleDateString('pt-BR'),
                    }
                })
            } 
        })
    })
}