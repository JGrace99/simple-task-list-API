import { ZodError, ZodType } from "zod";
import builder from "./builder.js";
import { TaskRef } from "./task.js";
import { CreateTaskSchema, EditTaskSchema, TaskIdSchema, ToggleTaskSchema } from "./validation.js";
import { GraphQLError } from "graphql";

// Intercepts ZodErrors before Yoga wraps them, rethrowing as GraphQLError so the client gets the actual message
function parseOrThrow<T>(schema: ZodType<T>, data: unknown): T {
    try {
        return schema.parse(data);
    } catch (error) {
        if (error instanceof ZodError) {
            throw new GraphQLError(error.issues[0]?.message ?? "Validation error", {
                extensions: {
                    code: "BAD_USER_INPUT",
                    field: error.issues[0]?.path.join("."),
                },
            });
        }
        throw error;
    }
}

//Reading operations. Returning all tasks or returning a specific task using an id argument by date created in decending order
builder.queryType({
    fields: (t) => ({
        // Return all tasks
        tasks: t.field({
            type: [TaskRef],
            resolve: (_parent, _args, context) => {
                return context.prisma.task.findMany({
                    orderBy: { createdAt: 'desc'}
                });
            },
        }),

        // Return a unique task via Id
        task: t.field({
            type: TaskRef,
            nullable: true,
            args: {
                id: t.arg.int({ required: true })
            },
            resolve: (_parent, args, context) => {
                const { id } = parseOrThrow(TaskIdSchema, args);
                return context.prisma.task.findUnique({
                where: { id },
                });
            },
        }),

        // Additional Query to return all completed tasks by date created in descending order
        completedTasks: t.field({
            type: [TaskRef],
            resolve: (_parent, _args, context) => {
                return context.prisma.task.findMany({
                    where: {completed: true },
                    orderBy: { createdAt: 'desc'}
                });
            }
        })
    }),
});

// Create, Update, and Delete operations
builder.mutationType({
    fields: (t) => ({
        // Create a new task
        addTask: t.field({
            type: TaskRef,
            args: {
                title: t.arg.string({ required: true })
            },
            resolve: (_parent, args, context) => {
                const { title } = parseOrThrow(CreateTaskSchema, args)
                return context.prisma.task.create({
                    data: { 
                        title,
                        completed: false,
                    },
                });
            },
        }),

        // Change whether a task is completed or not
        toggleTask: t.field({
            type: TaskRef,
            args: {
                id: t.arg.int({ required: true }),
                completed: t.arg.boolean({ required: true })
            },
            resolve: (_parent, args, context) => {
                const { id, completed } = parseOrThrow(ToggleTaskSchema, args)
                return context.prisma.task.update({
                    where: { id },
                    data: { completed }
                });
            },
        }),

        // Delete a task
        deleteTask: t.field({
            type: TaskRef,
            args: {
                id: t.arg.int({ required: true }),
            },
            resolve: (_parent, args, context) => {
                const { id } = parseOrThrow(TaskIdSchema, args)
                return context.prisma.task.delete({
                    where: { id }
                })
            },
        }),

        // Additional Mutation to update the title of the task
        editTask: t.field({
            type: TaskRef,
            args: {
                id: t.arg.int({ required: true }),
                title: t.arg.string({ required: true }),
            },
            resolve: (_parent, args, context) => {
                const { id, title } = parseOrThrow(EditTaskSchema, args)
                return context.prisma.task.update({
                    where: { id },
                    data: { title }
                })
            },
        }),
    }),
});