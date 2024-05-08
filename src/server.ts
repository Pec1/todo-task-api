import fastify from "fastify";
import { createTask } from "./routes/create-task";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { getTask } from "./routes/get-task";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTask)
app.register(getTask)

app.listen({
    port: 3333
}).then(() => {
    console.log('Server running!')
})