import SchemaBuilder from "@pothos/core";
import type { Context } from "../context.js"
import { DateTimeResolver } from "graphql-scalars";

const builder = new SchemaBuilder<{
    Context: Context;
    Scalars: {
        DateTime: {
            Input: Date;
            Output: Date;
        };
    };
}>({});

builder.addScalarType('DateTime', DateTimeResolver, {});

export default builder;