import { prisma } from "./db/client.js";
import { PrismaClient } from "./generated/prisma/client.js";

export interface Context {
    prisma: PrismaClient;
}

export function createContext(): Context {
    return {prisma}
}