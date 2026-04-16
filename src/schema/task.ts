import builder from "./builder.js";
import type { Task } from "./types.js";

export const TaskRef = builder.objectRef<Task>('Task');

TaskRef.implement({
    fields: (t) => ({
        id: t.exposeInt('id'),
        title: t.exposeString('title'),
        completed: t.exposeBoolean('completed'),
        createdAt: t.expose('createdAt', { type: 'DateTime' }),
        updatedAt: t.expose('updatedAt', { type: 'DateTime', nullable: true }),
    }),
});