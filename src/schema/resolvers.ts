import builder from "./builder.js";
import { TaskRef } from "./task.js";

//Reading operations. Returning all tasks or returning a specific task using an id argument
builder.queryType({
    fields: (t) => ({
        // Return all tasks
        tasks: t.field({
            type: [TaskRef],
            resolve: (_parent, _args, context) => {
                return context.prisma.task.findMany();
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
                return context.prisma.task.findUnique({
                    where: { id: args.id },
                });
            },
        }),

        // Additional Query to return all completed tasks
        completedTasks: t.field({
            type: [TaskRef],
            resolve: (_parent, _args, context) => {
                return context.prisma.task.findMany({
                    where: {completed: true }
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
                return context.prisma.task.create({
                    data: { 
                        title: args.title,
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
                return context.prisma.task.update({
                    where: { id: args.id },
                    data: { completed: args.completed }
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
                return context.prisma.task.delete({
                    where: { id: args.id }
                })
            },
        }),

        // Additional Mutation to update the title of the task
        editTask: t.field({
            type: TaskRef,
            args: {
                id: t.arg.int({ required: true }),
                newTitle: t.arg.string({ required: true }),
            },
            resolve: (_parent, args, context) => {
                return context.prisma.task.update({
                    where: { id: args.id },
                    data: { title: args.newTitle }
                })
            },
        }),
    }),
});