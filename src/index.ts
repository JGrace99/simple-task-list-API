import './schema/task.js';
import './schema/resolvers.js';

import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";
import builder from "./schema/builder.js";
import { createContext } from "./context.js"
import { connectDB, prisma } from './db/client.js';

// Prevent the process from crashing on unhandled errors and rejected promises
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception: ", error);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});

// Schemas are designed using Pothos builder, then exported and imported by Yoga.
// The schema is essentially Yoga's rulebook and instruction manual.
// It defines what fields and types exist (validation), and maps each field to its resolver function (execution)
const yoga = createYoga({
  schema: builder.toSchema(),
  context: createContext,
});

// Creates a node.js server using the previously created yoga instance as a listener
const server = createServer(yoga);

// Gracefully shuts down by stopping new requests and closing the database connection
const shutdown = async () => {
  console.log("Shutting down...");
  await prisma.$disconnect();
  server.close(() => {
    console.log("Server Closed");
    // Exits sucessfully
    process.exit(0);
  })
}

// Listens for signals sent from the operating system that would result in server termination and handles them gracefully
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

connectDB()
  .then(() => {
    server.listen(4000, () => {
    console.log("Server running on http://localhost:4000/graphql");
  });
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
    // Exit with an error
    process.exit(1);
  })
