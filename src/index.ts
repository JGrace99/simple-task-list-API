import { createServer } from 'node:http'
import { createYoga } from 'graphql-yoga'
import { schema } from './schema/builder.js'

// Schemas are designed using Pothos builder, then export and imported by Yoga.
// The schema is essentially Yogas rulebook and instruction manual. 
// It defines what fields and types exist (validation), and maps each field to its resolver function (execution)
const yoga = createYoga({ schema })

// Creates a node.js server using the previously created yoga instance as a listener
const server = createServer(yoga)

server.listen(4000, () => {
    console.log('Server running on http://localhost:4000/graphql')
})