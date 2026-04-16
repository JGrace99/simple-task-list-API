import SchemaBuilder from "@pothos/core";

const builder = new SchemaBuilder({});

// All fields are created within one builder.queryType
builder.queryType({
    fields: (t) => ({
        // Field name
        hello: t.string({
            // Argument that can be passed into a field. Set argument data type
            args: {
                name: t.arg.string(),
            },
            // Upon validation, the resolver function is called performing a desired operations with the data passed to the server from the client
            resolve: (parent, { name }) => `hello, ${name || 'World'}`,
        }),
        goodbye: t.string({
            args: { 
                name: t.arg.string(),
            },
            resolve: (parent, { name }) => `Goodbye, ${name || 'Everyone'}`,
        }),
    }),
});

// The schema is used to validate incoming query requests. Upon validation, executes the resolver function
const schema = builder.toSchema();

export {schema}