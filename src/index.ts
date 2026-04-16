import './schema/task.js';
import './schema/resolvers.js';

import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";
import builder from "./schema/builder.js";
import { createContext } from "./context.js"

// Schemas are designed using Pothos builder, then export and imported by Yoga.
// The schema is essentially Yogas rulebook and instruction manual.
// It defines what fields and types exist (validation), and maps each field to its resolver function (execution)
const yoga = createYoga({
  schema: builder.toSchema(),
  context: createContext,
});

// Creates a node.js server using the previously created yoga instance as a listener
const server = createServer(yoga);

server.listen(4000, () => {
  console.log("Server running on http://localhost:4000/graphql");
});
