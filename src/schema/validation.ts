import { z } from "zod"

// Title accepts a string but it can't be empty. Set max title length to 100 characters
export const CreateTaskSchema = z.object({
    title: z.string().min(1, "Title cannot be empty").max(50, "Title too long"),
});

// ID can be an integer, but must be a positive integer
export const TaskIdSchema = z.object({
    id: z.number().int().positive("ID must be a positive integer"),
})

// Ensures completed is passed a boolean
export const ToggleTaskSchema = z.object({
    id: z.number().int().positive("ID must be a positive integer"),
    completed: z.boolean(),
})

// Validates Id and title length
export const EditTaskSchema = z.object({
    id: z.number().int().positive("ID must be a positive integer"),
    title: z.string().min(1, "Title cannot be empty").max(50, "Title too long"),
})